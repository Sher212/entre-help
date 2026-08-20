import React, { useState, useEffect } from "react";
import { useFarmer } from "../context/FarmerContext";
import {
  predictCrop,
  predictYield,
  getMarketTrends,
  getWhereToSell,
  matchSchemesProfile
} from "../services/api";
import {
  Sprout,
  TrendingUp,
  CloudSun,
  Store,
  Landmark,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Droplets,
  CheckCircle2,
  Calendar,
  Activity,
  FileText
} from "lucide-react";

export default function Dashboard() {
  const { profile, weather, setActiveTab, refreshActionPlan, setShowActionPlanModal } = useFarmer();
  const [topCropRec, setTopCropRec] = useState(null);
  const [yieldData, setYieldData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [bestMandi, setBestMandi] = useState(null);
  const [topSchemes, setTopSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        // 1. Crop Recommendation for profile
        const cRes = await predictCrop({
          N: profile.nitrogen,
          P: profile.phosphorus,
          K: profile.potassium,
          temperature: 26.5,
          humidity: 65.0,
          ph: profile.soil_ph,
          rainfall: 105.0,
          top_k: 1
        });
        setTopCropRec(cRes.recommendations[0]);

        // 2. Yield Prediction for current crop
        const yCrop = profile.current_crop || cRes.top_crop || "Wheat";
        const yRes = await predictYield({
          crop: yCrop,
          state: profile.state,
          season: profile.farming_season || "Kharif",
          area: profile.land_size_acres / 2.471, // Convert acres to hectares
          annual_rainfall: 1050.0,
          fertilizer: 110.0,
          pesticide: 1.5
        });
        setYieldData(yRes);

        // 3. Market Trends for current crop
        const mRes = await getMarketTrends(yCrop, profile.state, profile.district);
        setMarketData(mRes);

        const wSell = await getWhereToSell(yCrop, profile.state);
        if (wSell.best_mandis && wSell.best_mandis.length > 0) {
          setBestMandi(wSell.best_mandis[0]);
        }

        // 4. Matched Schemes
        const sRes = await matchSchemesProfile(profile);
        setTopSchemes(sRes.slice(0, 3));
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [profile]);

  const handleOpenActionPlan = async () => {
    await refreshActionPlan();
    setShowActionPlanModal(true);
  };

  return (
    <div className="page-wrapper">
      {/* Welcome Banner */}
      <div style={{
        background: "linear-gradient(135deg, #065f46 0%, #047857 60%, #059669 100%)",
        color: "#ffffff",
        borderRadius: "20px",
        padding: "28px 32px",
        marginBottom: "28px",
        boxShadow: "0 10px 20px -5px rgba(5, 150, 105, 0.3)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#a7f3d0", fontWeight: 600, marginBottom: "4px" }}>
            <Sparkles size={15} /> Good Morning • Kisan Sahayata Desk
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>
            Namaste, {profile.name}!
          </h1>
          <div style={{ fontSize: "14px", color: "#d1fae5", marginTop: "4px" }}>
            Farm: {profile.land_size_acres} Acres • {profile.village}, {profile.district} ({profile.state}) • Season: {profile.farming_season}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {weather && (
            <div style={{ background: "rgba(255,255,255,0.15)", padding: "10px 18px", borderRadius: "12px", textAlign: "right", backdropFilter: "blur(6px)" }}>
              <div style={{ fontSize: "12px", color: "#d1fae5" }}>Current Weather</div>
              <div style={{ fontSize: "18px", fontWeight: 800 }}>
                {weather.current.temperature.toFixed(1)}°C {weather.current.condition_text.split(" ")[0]}
              </div>
            </div>
          )}
          <button 
            onClick={handleOpenActionPlan}
            className="btn btn-amber"
            style={{ padding: "10px 20px" }}
          >
            <FileText size={16} /> View Farm Action Plan
          </button>
        </div>
      </div>

      {/* Critical Alert Bar */}
      {weather && weather.advisory && (
        <div style={{
          background: weather.advisory.irrigation_advice.status.includes("SKIP") ? "#fef3c7" : "#ecfdf5",
          border: `1px solid ${weather.advisory.irrigation_advice.status.includes("SKIP") ? "#fde68a" : "#a7f3d0"}`,
          borderRadius: "14px",
          padding: "14px 20px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "14px"
        }}>
          <AlertTriangle size={20} color={weather.advisory.irrigation_advice.status.includes("SKIP") ? "#b45309" : "#059669"} />
          <div style={{ flex: 1, fontSize: "13px", color: "#1e293b" }}>
            <strong>Agro-Weather Advisory:</strong> {weather.advisory.irrigation_advice.action} (Spraying Window: <strong>{weather.advisory.spraying_window.status}</strong>)
          </div>
          <button 
            onClick={() => setActiveTab("weather")}
            style={{ background: "transparent", border: "none", color: "#059669", fontWeight: 700, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
          >
            Details <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Dashboard KPI Grid (4 Cards) */}
      <div className="grid-4" style={{ marginBottom: "28px" }}>
        {/* Card 1: Soil & Recommended Crop */}
        <div className="card card-gradient">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#065f46", textTransform: "uppercase" }}>Recommended Crop</span>
            <div style={{ background: "#d1fae5", padding: "6px", borderRadius: "8px", color: "#059669" }}>
              <Sprout size={18} />
            </div>
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#065f46", marginBottom: "2px" }}>
            {topCropRec ? topCropRec.crop : "Loading..."}
          </div>
          <div style={{ fontSize: "12px", color: "#047857", fontWeight: 600, marginBottom: "10px" }}>
            {topCropRec ? `${topCropRec.percentage} Soil Match` : "98.8% Accuracy"}
          </div>
          <div 
            onClick={() => setActiveTab("crop-advisor")}
            style={{ fontSize: "12px", color: "#059669", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
          >
            Explore Crop Advisory <ArrowRight size={13} />
          </div>
        </div>

        {/* Card 2: Expected Yield */}
        <div className="card card-amber-gradient">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#92400e", textTransform: "uppercase" }}>Expected Yield</span>
            <div style={{ background: "#fef3c7", padding: "6px", borderRadius: "8px", color: "#d97706" }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#92400e", marginBottom: "2px" }}>
            {yieldData ? `${yieldData.predicted_yield_quintals_per_acre} Qtl/Acre` : "Estimating..."}
          </div>
          <div style={{ fontSize: "12px", color: "#b45309", fontWeight: 600, marginBottom: "10px" }}>
            {yieldData ? `${yieldData.total_expected_production_tons} Tons Total` : "R² = 0.987"}
          </div>
          <div 
            onClick={() => setActiveTab("yield-predictor")}
            style={{ fontSize: "12px", color: "#d97706", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
          >
            Yield Optimization <ArrowRight size={13} />
          </div>
        </div>

        {/* Card 3: Mandi Price Snapshot */}
        <div className="card card-blue-gradient">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#0369a1", textTransform: "uppercase" }}>Mandi Price</span>
            <div style={{ background: "#e0f2fe", padding: "6px", borderRadius: "8px", color: "#0284c7" }}>
              <Store size={18} />
            </div>
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#0369a1", marginBottom: "2px" }}>
            {marketData ? `₹${marketData.latest_modal_price}` : "Loading..."} <span style={{ fontSize: "12px", fontWeight: 500 }}>/Qtl</span>
          </div>
          <div style={{ fontSize: "12px", color: "#0284c7", fontWeight: 600, marginBottom: "10px" }}>
            {marketData ? marketData.trend_direction : "57,000+ Records"}
          </div>
          <div 
            onClick={() => setActiveTab("market")}
            style={{ fontSize: "12px", color: "#0284c7", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
          >
            Where to Sell <ArrowRight size={13} />
          </div>
        </div>

        {/* Card 4: Government Support */}
        <div className="card" style={{ background: "linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)", border: "1px solid #e9d5ff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#6b21a8", textTransform: "uppercase" }}>Govt Subsidy</span>
            <div style={{ background: "#f3e8ff", padding: "6px", borderRadius: "8px", color: "#7c3aed" }}>
              <Landmark size={18} />
            </div>
          </div>
          <div style={{ fontSize: "18px", fontWeight: 800, color: "#6b21a8", marginBottom: "2px" }}>
            {topSchemes.length > 0 ? topSchemes[0].short_name : "PM-KISAN"}
          </div>
          <div style={{ fontSize: "12px", color: "#7c3aed", fontWeight: 600, marginBottom: "10px" }}>
            {topSchemes.length > 0 ? `${(topSchemes[0].match_score * 100).toFixed(0)}% Profile Match` : "Central Scheme"}
          </div>
          <div 
            onClick={() => setActiveTab("schemes")}
            style={{ fontSize: "12px", color: "#7c3aed", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
          >
            View Top Schemes <ArrowRight size={13} />
          </div>
        </div>
      </div>

      {/* Main 2-Column Dashboard Sections */}
      <div className="grid-2" style={{ marginBottom: "28px" }}>
        {/* Left Column: Farm Health & Soil Status */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
              🌾 Farm Health & Soil Fertility
            </h3>
            <span className="badge badge-green">N-P-K Calibrated</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "18px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                <span>Nitrogen (N: {profile.nitrogen} kg/ha)</span>
                <span style={{ color: "#059669" }}>Optimal (Tillering)</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, (profile.nitrogen / 140) * 100)}%`, height: "100%", background: "#10b981" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                <span>Phosphorus (P: {profile.phosphorus} kg/ha)</span>
                <span style={{ color: "#0284c7" }}>Good (Root development)</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, (profile.phosphorus / 100) * 100)}%`, height: "100%", background: "#0284c7" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                <span>Potassium (K: {profile.potassium} kg/ha)</span>
                <span style={{ color: "#d97706" }}>Balanced (Pest resistance)</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, (profile.potassium / 80) * 100)}%`, height: "100%", background: "#f59e0b" }} />
              </div>
            </div>
          </div>

          <div style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: "10px", fontSize: "13px", color: "#475569" }}>
            <strong>Soil Type:</strong> {profile.soil_type} • <strong>pH:</strong> {profile.soil_ph} (Near Neutral) • <strong>Irrigation:</strong> {profile.irrigation_source}
          </div>
        </div>

        {/* Right Column: Mandi Intelligence Snapshot */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
              📈 Best Historical Mandi Realization
            </h3>
            <span className="badge badge-blue">Dataset 4</span>
          </div>

          {bestMandi ? (
            <div>
              <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "12px", padding: "16px", marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "#0369a1" }}>{bestMandi.market}</span>
                  <span className="badge badge-amber">{bestMandi.recommendation_badge}</span>
                </div>
                <div style={{ fontSize: "13px", color: "#1e293b" }}>
                  District: <strong>{bestMandi.district}</strong> • State: <strong>{bestMandi.state}</strong>
                </div>
                <div style={{ marginTop: "8px", fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>
                  ₹{bestMandi.avg_modal_price} <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>avg modal / Quintal (Peak ₹{bestMandi.max_price_recorded})</span>
                </div>
              </div>
              <p style={{ fontSize: "13px", color: "#475569", margin: 0 }}>
                Selling in <strong>{bestMandi.market}</strong> provides optimal price spread over local village traders.
              </p>
            </div>
          ) : (
            <div style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>
              Loading Mandi analytics...
            </div>
          )}

          <button 
            onClick={() => setActiveTab("market")}
            className="btn btn-secondary"
            style={{ width: "100%", marginTop: "16px", fontSize: "13px" }}
          >
            Compare All Mandis in {profile.state}
          </button>
        </div>
      </div>

      {/* Disease Detection Fast Action Banner */}
      <div style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "20px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#fdf2f8", color: "#db2777", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Activity size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Suspect Leaf Disease or Pest Infection?
            </h4>
            <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
              Upload a clear leaf photo for instant AI vision classification & recommended biological/chemical treatments.
            </div>
          </div>
        </div>

        <button 
          onClick={() => setActiveTab("disease-detection")}
          className="btn btn-primary"
          style={{ padding: "9px 18px", fontSize: "13px" }}
        >
          <span>Diagnose Leaf Now</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
