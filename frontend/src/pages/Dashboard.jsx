import React, { useState, useEffect } from "react";
import { useFarmer } from "../context/FarmerContext";
import {
  matchSchemesProfile, searchChannelPartners
} from "../services/api";
import {
  Landmark,
  TrendingUp,
  Store,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileText,
  Calculator,
  UserCircle,
  MapPin,
  Building2,
  Banknote
} from "lucide-react";

export default function Dashboard() {
  const { profile, setActiveTab } = useFarmer();

  const [topSchemes, setTopSchemes] = useState([]);
  const [partnerCount, setPartnerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const sRes = await matchSchemesProfile(profile);
        setTopSchemes(sRes);

        const cp = await searchChannelPartners(profile.state);
        setPartnerCount(cp.total || 0);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [profile]);

  const topScheme = topSchemes[0] || null;
  const maxLoan = topScheme?.max_loan_amount || 0;

  return (
    <div className="page-wrapper">
      {/* 1. Top Welcome Banner (Kept original class and layout) */}
      <div className="dashboard-welcome-banner">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#a7f3d0", fontWeight: 600, marginBottom: "4px" }}>
            <Sparkles size={14} /> Entre Help — AI Scheme Engine
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>
            Namaste, {profile.name}!
          </h1>
          <div style={{ fontSize: "13px", color: "#d1fae5", marginTop: "4px" }}>
            {profile.social_category} • {profile.district}, {profile.state} (₹{profile.annual_income?.toLocaleString("en-IN")}/yr)
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ background: "rgba(255,255,255,0.18)", padding: "8px 14px", borderRadius: "10px", backdropFilter: "blur(6px)" }}>
            <div style={{ fontSize: "11px", color: "#d1fae5" }}>Profile Match</div>
            <div style={{ fontSize: "16px", fontWeight: 800 }}>
              {topSchemes.length} Schemes Active
            </div>
          </div>
          <button 
            onClick={() => setActiveTab("profile")}
            className="btn btn-amber"
            style={{ padding: "8px 14px", fontSize: "13px" }}
          >
            <UserCircle size={15} /> Edit Profile
          </button>
        </div>
      </div>

      {/* 2. Mobile-First Primary Actions: Scheme Scanner CTA */}
      <div className="dashboard-scanner-cta-card">
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1 }}>
          <div className="scanner-cta-icon-box">
            <Calculator size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "#065f46" }}>
              Loan Eligibility Calculator
            </div>
            <div style={{ fontSize: "12px", color: "#047857", marginTop: "2px" }}>
              Calculate your exact loan amount, EMI, and subsidy instantly.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", width: "100%", justifyContent: "flex-end" }}>
          <button
            onClick={() => setActiveTab("schemes")}
            className="btn btn-secondary"
            style={{ fontSize: "13px", padding: "10px 14px", flex: 1, minWidth: "130px", justifyContent: "center" }}
          >
            <Landmark size={16} /> All Schemes
          </button>

          <button
            onClick={() => setActiveTab("loan-calculator")}
            className="btn btn-primary"
            style={{ fontSize: "13px", padding: "10px 18px", flex: 1.5, minWidth: "160px", justifyContent: "center", background: "linear-gradient(135deg, #059669 0%, #047857 100%)" }}
          >
            <Calculator size={16} /> <strong>Calculate EMI</strong>
          </button>
        </div>
      </div>

      {/* 3. Dashboard KPI Grid (4 Stackable Cards - kept original classes) */}
      <div className="grid-4" style={{ marginBottom: "24px" }}>
        {/* Card 1: Top Scheme */}
        <div className="card card-gradient" onClick={() => setActiveTab("schemes")} style={{ cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#065f46", textTransform: "uppercase" }}>Top Recommended Scheme</span>
            <div style={{ background: "#d1fae5", padding: "5px", borderRadius: "6px", color: "#059669" }}>
              <Landmark size={16} />
            </div>
          </div>
          <div style={{ fontSize: "17px", fontWeight: 800, color: "#065f46", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {topScheme ? topScheme.short_name : "Loading..."}
          </div>
          <div style={{ fontSize: "12px", color: "#047857", fontWeight: 600, marginBottom: "8px" }}>
            {topScheme ? `${(topScheme.match_score * 100).toFixed(0)}% Profile Match` : "Recommended"}
          </div>
          <div style={{ fontSize: "11px", color: "#059669", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
            View Match Details <ArrowRight size={12} />
          </div>
        </div>

        {/* Card 2: Max Loan Expected */}
        <div className="card card-amber-gradient" onClick={() => setActiveTab("loan-calculator")} style={{ cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#92400e", textTransform: "uppercase" }}>Max Loan Eligible</span>
            <div style={{ background: "#fef3c7", padding: "5px", borderRadius: "6px", color: "#d97706" }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "#92400e", marginBottom: "2px" }}>
            {maxLoan ? `₹${(maxLoan / 100000).toFixed(1)}L` : "—"}
          </div>
          <div style={{ fontSize: "12px", color: "#b45309", fontWeight: 600, marginBottom: "8px" }}>
            Up to 95% project cost coverage
          </div>
          <div style={{ fontSize: "11px", color: "#d97706", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
            Loan Calculator <ArrowRight size={12} />
          </div>
        </div>

        {/* Card 3: Channel Partners */}
        <div className="card card-blue-gradient" onClick={() => setActiveTab("channel-partners")} style={{ cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#0369a1", textTransform: "uppercase" }}>Channel Partners</span>
            <div style={{ background: "#e0f2fe", padding: "5px", borderRadius: "6px", color: "#0284c7" }}>
              <MapPin size={16} />
            </div>
          </div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "#0369a1", marginBottom: "2px" }}>
            {partnerCount} Found
          </div>
          <div style={{ fontSize: "12px", color: "#0284c7", fontWeight: 600, marginBottom: "8px" }}>
            Agencies in {profile.state}
          </div>
          <div style={{ fontSize: "11px", color: "#0284c7", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
            Where to Apply <ArrowRight size={12} />
          </div>
        </div>

        {/* Card 4: Total Govt Schemes Matched */}
        <div className="card" onClick={() => setActiveTab("schemes")} style={{ background: "linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)", border: "1px solid #e9d5ff", cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#6b21a8", textTransform: "uppercase" }}>Schemes Matched</span>
            <div style={{ background: "#f3e8ff", padding: "5px", borderRadius: "6px", color: "#7c3aed" }}>
              <Banknote size={16} />
            </div>
          </div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "#6b21a8", marginBottom: "2px" }}>
            {topSchemes.length} Total
          </div>
          <div style={{ fontSize: "12px", color: "#7c3aed", fontWeight: 600, marginBottom: "8px" }}>
            Central & State Subsidy Schemes
          </div>
          <div style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
            View All <ArrowRight size={12} />
          </div>
        </div>
      </div>

      {/* 4. Main 2-Column Dashboard Sections */}
      <div className="grid-2" style={{ marginBottom: "24px" }}>
        {/* Left Column: Profile Health Check */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              👤 Entrepreneur Profile Stats
            </h3>
            <span className="badge badge-green">Matching Metrics</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "14px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                <span>Annual Income (₹{profile.annual_income?.toLocaleString("en-IN")})</span>
                <span style={{ color: "#059669" }}>Eligible</span>
              </div>
              <div style={{ width: "100%", height: "7px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, (profile.annual_income / 300000) * 100)}%`, height: "100%", background: "#10b981" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                <span>Project Cost (₹{profile.project_cost?.toLocaleString("en-IN")})</span>
                <span style={{ color: "#0284c7" }}>Within Limits</span>
              </div>
              <div style={{ width: "100%", height: "7px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, (profile.project_cost / 1500000) * 100)}%`, height: "100%", background: "#0284c7" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                <span>Age ({profile.age} Years)</span>
                <span style={{ color: "#d97706" }}>Optimal</span>
              </div>
              <div style={{ width: "100%", height: "7px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, (profile.age / 50) * 100)}%`, height: "100%", background: "#f59e0b" }} />
              </div>
            </div>
          </div>

          <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: "8px", fontSize: "12px", color: "#475569" }}>
            <strong>Demographics:</strong> {profile.social_category} • <strong>Gender:</strong> {profile.gender} • <strong>SHG:</strong> {profile.is_shg_member ? "Yes" : "No"}
          </div>
        </div>

        {/* Right Column: How to Apply / Partner Spotlight */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              🏢 Apply via Channel Finance System
            </h3>
            <span className="badge badge-blue">Process</span>
          </div>

          <div>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "15px", fontWeight: 800, color: "#065f46" }}>State Channelizing Agencies (SCAs)</span>
                <span className="badge badge-green">Recommended</span>
              </div>
              <div style={{ fontSize: "12px", color: "#1e293b" }}>
                Required for: <strong>NSFDC / NSTFDC</strong> Loan Applications
              </div>
              <div style={{ marginTop: "6px", fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                ⚠️ Do NOT apply directly to NSFDC.
              </div>
            </div>
            <p style={{ fontSize: "12px", color: "#475569", margin: 0 }}>
              The MoSJE distributes loans via the <strong>Channel Finance System</strong>. You must apply through the designated SCA or PSB in your state.
            </p>
          </div>

          <button 
            onClick={() => setActiveTab("channel-partners")}
            className="btn btn-secondary"
            style={{ width: "100%", marginTop: "12px", fontSize: "12px" }}
          >
            Locate SCAs in {profile.state}
          </button>
        </div>
      </div>
    </div>
  );
}
