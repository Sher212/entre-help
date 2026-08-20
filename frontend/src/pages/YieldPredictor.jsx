import React, { useState, useEffect } from "react";
import { useFarmer } from "../context/FarmerContext";
import { predictYield, getYieldMetrics } from "../services/api";
import {
  TrendingUp,
  Scale,
  Sparkles,
  Leaf,
  Droplets,
  Layers,
  CheckCircle,
  HelpCircle,
  BarChart2
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from "recharts";

export default function YieldPredictor() {
  const { profile } = useFarmer();

  const [form, setForm] = useState({
    crop: profile.current_crop || "Wheat",
    state: profile.state || "Punjab",
    season: profile.farming_season || "Rabi",
    area_acres: profile.land_size_acres || 3.5,
    annual_rainfall: 1050.0,
    fertilizer: 110.0,
    pesticide: 1.5
  });

  const [result, setResult] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  const crops = [
    "Rice", "Wheat", "Maize", "Cotton(lint)", "Sugarcane",
    "Soybean", "Groundnut", "Rapeseed &Mustard", "Gram",
    "Arhar/Tur", "Moong(Green Gram)", "Potato", "Onion", "Tomato", "Banana"
  ];

  const states = [
    "Maharashtra", "Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh",
    "Gujarat", "Karnataka", "Tamil Nadu", "Andhra Pradesh", "Rajasthan",
    "Bihar", "West Bengal", "Odisha", "Assam", "Telangana"
  ];

  const seasons = ["Kharif", "Rabi", "Summer", "Whole Year"];

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const areaHa = Number(form.area_acres) / 2.47105;
      const res = await predictYield({
        crop: form.crop,
        state: form.state,
        season: form.season,
        area: Math.max(0.1, round(areaHa, 2)),
        annual_rainfall: Number(form.annual_rainfall),
        fertilizer: Number(form.fertilizer),
        pesticide: Number(form.pesticide)
      });
      setResult(res);
    } catch (err) {
      console.error("Yield prediction error:", err);
    } finally {
      setLoading(false);
    }
  };

  const round = (val, dec) => Number(Math.round(val + 'e' + dec) + 'e-' + dec);

  useEffect(() => {
    handlePredict();
    getYieldMetrics().then(setMetrics).catch(() => {});
  }, []);

  const driverChartData = result && result.key_drivers ? Object.entries(result.key_drivers).map(([k, v]) => ({
    name: k,
    contribution: (v * 100).toFixed(0)
  })) : [];

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span className="badge badge-amber">Dataset 3 • 8,550 Records</span>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>Gradient Boosting Regressor (R² = 0.987)</span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
            Crop Yield Prediction Engine
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b" }}>
            Estimate expected agricultural yield, productivity ranges, and agronomic optimization strategies for your acreage.
          </p>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Form */}
        <div className="card">
          <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", marginBottom: "18px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
            Farm & Cultivation Specifications
          </h2>

          <form onSubmit={handlePredict}>
            <div className="form-group">
              <label className="form-label">Select Crop</label>
              <select
                value={form.crop}
                onChange={(e) => setForm({ ...form, crop: e.target.value })}
                className="form-select"
              >
                {crops.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">State</label>
                <select
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="form-select"
                >
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Season</label>
                <select
                  value={form.season}
                  onChange={(e) => setForm({ ...form, season: e.target.value })}
                  className="form-select"
                >
                  {seasons.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <label className="form-label" style={{ margin: 0 }}>Farm Acreage</label>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#059669" }}>
                  {form.area_acres} Acres ({(form.area_acres / 2.47105).toFixed(2)} Ha)
                </span>
              </div>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="50"
                value={form.area_acres}
                onChange={(e) => setForm({ ...form, area_acres: Number(e.target.value) })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <label className="form-label" style={{ margin: 0 }}>Fertilizer Application</label>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#0284c7" }}>{form.fertilizer} kg/ha</span>
              </div>
              <input
                type="range"
                min="20"
                max="260"
                value={form.fertilizer}
                onChange={(e) => setForm({ ...form, fertilizer: Number(e.target.value) })}
                className="slider-range"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "20px" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Annual Rainfall (mm)</label>
                <input
                  type="number"
                  value={form.annual_rainfall}
                  onChange={(e) => setForm({ ...form, annual_rainfall: Number(e.target.value) })}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Pesticide (kg/ha)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.pesticide}
                  onChange={(e) => setForm({ ...form, pesticide: Number(e.target.value) })}
                  className="form-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-amber"
              style={{ width: "100%", padding: "12px", fontSize: "15px" }}
            >
              {loading ? "Calculating Expected Yield..." : "Estimate Yield & Production"}
            </button>
          </form>
        </div>

        {/* Right Output */}
        <div>
          {result && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Main Metric Hero Card */}
              <div style={{
                background: "linear-gradient(135deg, #b45309 0%, #d97706 100%)",
                color: "#ffffff",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 8px 16px rgba(217, 119, 6, 0.25)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#fef3c7", fontWeight: 700, textTransform: "uppercase" }}>
                    Expected Yield Output
                  </span>
                  <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 700 }}>
                    {result.productivity_rating}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", margin: "10px 0" }}>
                  <div style={{ fontSize: "38px", fontWeight: 800 }}>
                    {result.predicted_yield_quintals_per_acre}
                  </div>
                  <div style={{ fontSize: "16px", color: "#fef3c7", fontWeight: 600 }}>
                    Quintals / Acre
                  </div>
                </div>

                <div style={{ fontSize: "14px", color: "#fde68a", marginBottom: "16px" }}>
                  = <strong>{result.predicted_yield_tons_per_ha} Metric Tons / Hectare</strong> (Range: {result.yield_range_min_tons_per_ha} - {result.yield_range_max_tons_per_ha} Tons/Ha)
                </div>

                <div style={{ paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.2)", display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span>Total Farm Harvest ({form.area_acres} Acres):</span>
                  <strong>{result.total_expected_production_tons} Tons ({Math.round(result.total_expected_production_tons * 10)} Quintals)</strong>
                </div>
              </div>

              {/* Drivers Chart */}
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a" }}>
                    Productivity Driver Influence
                  </h3>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>Factor Share %</span>
                </div>
                <div style={{ height: "140px", width: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={driverChartData} layout="vertical" margin={{ left: 15, right: 20, top: 0, bottom: 0 }}>
                      <XAxis type="number" domain={[0, 40]} tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
                      <Tooltip formatter={(val) => [`${val}%`, "Influence"]} />
                      <Bar dataKey="contribution" fill="#d97706" radius={[0, 4, 4, 0]}>
                        {driverChartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? "#d97706" : index === 1 ? "#f59e0b" : "#fbbf24"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Actionable Productivity Optimization Recommendations */}
              <div className="card" style={{ borderLeft: "4px solid #10b981" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", marginBottom: "12px" }}>
                  Agronomic Recommendations to Maximize Yield
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {result.optimization_recommendations.map((rec, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", color: "#334155" }}>
                      <CheckCircle size={16} color="#059669" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "14px", borderTop: "1px solid #f1f5f9", paddingTop: "8px" }}>
                  {result.disclaimer}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
