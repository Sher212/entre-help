import React, { useState, useEffect } from "react";
import { useFarmer } from "../context/FarmerContext";
import { calculateLoan, matchSchemesProfile } from "../services/api";
import { Calculator, IndianRupee, Calendar, Percent, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";

export default function LoanCalculator() {
  const { profile } = useFarmer();
  const [matchedSchemes, setMatchedSchemes] = useState([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState("");
  const [projectCost, setProjectCost] = useState(profile.project_cost || 500000);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSchemes, setLoadingSchemes] = useState(true);

  useEffect(() => {
    matchSchemesProfile(profile).then((schemes) => {
      setMatchedSchemes(schemes);
      if (schemes.length > 0) setSelectedSchemeId(schemes[0].id);
      setLoadingSchemes(false);
    }).catch(() => setLoadingSchemes(false));
  }, [profile]);

  const handleCalculate = async () => {
    if (!selectedSchemeId) return;
    setLoading(true);
    try {
      const res = await calculateLoan({
        scheme_id: selectedSchemeId,
        project_cost: projectCost,
        annual_income: profile.annual_income,
        social_category: profile.social_category,
        gender: profile.gender,
      });
      setResult(res);
    } catch (err) {
      console.error("Loan calculation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => `₹${Number(val).toLocaleString("en-IN")}`;

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span className="badge" style={{ background: "#dbeafe", color: "#2563eb", border: "1px solid #93c5fd" }}>Financial Planning</span>
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: 0 }}>
          Loan Eligibility Calculator
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
          Calculate your loan amount, EMI, subsidy, and beneficiary contribution for any eligible scheme.
        </p>
      </div>

      <div className="grid-2" style={{ gap: "20px" }}>
        {/* Left: Input Form */}
        <div className="card">
          <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", marginBottom: "16px" }}>
            <Calculator size={16} style={{ marginRight: "6px", verticalAlign: "middle" }} />
            Enter Details
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                Select Scheme
              </label>
              {loadingSchemes ? (
                <div style={{ fontSize: "12px", color: "#64748b", padding: "10px" }}>Loading eligible schemes...</div>
              ) : (
                <select
                  value={selectedSchemeId}
                  onChange={(e) => setSelectedSchemeId(e.target.value)}
                  className="form-input"
                  style={{ margin: 0 }}
                >
                  {matchedSchemes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.scheme_name} ({Math.round(s.match_score * 100)}% match)
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                Total Project Cost (₹)
              </label>
              <input
                type="number"
                value={projectCost}
                onChange={(e) => setProjectCost(Number(e.target.value))}
                className="form-input"
                style={{ margin: 0 }}
                min={10000}
                max={50000000}
              />
            </div>

            <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: "8px", fontSize: "12px", color: "#475569" }}>
              <strong>Your Profile:</strong> {profile.social_category} · {profile.gender} · ₹{profile.annual_income?.toLocaleString("en-IN")}/yr · {profile.state}
            </div>

            <button
              onClick={handleCalculate}
              className="btn btn-primary"
              style={{ width: "100%", padding: "12px", fontSize: "14px", fontWeight: 700 }}
              disabled={loading || !selectedSchemeId}
            >
              {loading ? (
                <><RefreshCw size={16} className="spinning" /> Calculating...</>
              ) : (
                <><Calculator size={16} /> Calculate Loan Details</>
              )}
            </button>
          </div>
        </div>

        {/* Right: Results */}
        <div>
          {result ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Scheme Name Header */}
              <div className="card" style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", color: "#fff" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, opacity: 0.8, marginBottom: "4px" }}>LOAN BREAKDOWN</div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>{result.scheme_name}</h3>
              </div>

              {/* Key Figures Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div className="card" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", textAlign: "center", padding: "16px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#065f46", textTransform: "uppercase" }}>Loan Amount</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#059669" }}>{formatCurrency(result.loan_amount)}</div>
                </div>
                <div className="card" style={{ background: "#fef3c7", border: "1px solid #fde68a", textAlign: "center", padding: "16px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#92400e", textTransform: "uppercase" }}>Your Contribution</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#d97706" }}>{formatCurrency(result.beneficiary_contribution)}</div>
                </div>
                <div className="card" style={{ background: "#ede9fe", border: "1px solid #c4b5fd", textAlign: "center", padding: "16px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#5b21b6", textTransform: "uppercase" }}>Monthly EMI</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#7c3aed" }}>{formatCurrency(result.monthly_emi)}</div>
                </div>
                <div className="card" style={{ background: "#dbeafe", border: "1px solid #93c5fd", textAlign: "center", padding: "16px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#1e40af", textTransform: "uppercase" }}>Interest Rate</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#2563eb" }}>{result.interest_rate}% <span style={{ fontSize: "12px", fontWeight: 500 }}>p.a.</span></div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="card">
                <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", marginBottom: "10px" }}>📋 Full Breakdown</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ color: "#64748b" }}>Project Cost</span>
                    <span style={{ fontWeight: 700 }}>{formatCurrency(result.project_cost)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ color: "#64748b" }}>Loan Amount</span>
                    <span style={{ fontWeight: 700, color: "#059669" }}>{formatCurrency(result.loan_amount)}</span>
                  </div>
                  {result.subsidy_or_grant > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                      <span style={{ color: "#64748b" }}>Government Subsidy</span>
                      <span style={{ fontWeight: 700, color: "#059669" }}>{formatCurrency(result.subsidy_or_grant)}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ color: "#64748b" }}>Repayment Period</span>
                    <span style={{ fontWeight: 700 }}>{result.repayment_years} years</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ color: "#64748b" }}>Moratorium</span>
                    <span style={{ fontWeight: 700 }}>{result.moratorium_months} months (no EMI)</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                    <span style={{ color: "#64748b" }}>Total Repayable</span>
                    <span style={{ fontWeight: 700 }}>{formatCurrency(result.total_repayable)}</span>
                  </div>
                </div>

                {result.women_rebate_applied && (
                  <div style={{ marginTop: "10px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", color: "#065f46", fontWeight: 600 }}>
                    ✅ Women rebate applied — 0.5% interest reduction
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="card" style={{ background: "#f8fafc" }}>
                <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>📌 Important Notes</h4>
                {result.breakdown_notes.map((note, i) => (
                  <div key={i} style={{ fontSize: "12px", color: "#475569", marginBottom: "4px", display: "flex", gap: "6px" }}>
                    <CheckCircle2 size={13} color="#059669" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
              <Calculator size={48} style={{ opacity: 0.3, marginBottom: "12px" }} />
              <div style={{ fontSize: "15px", fontWeight: 600 }}>Select a scheme and click Calculate</div>
              <div style={{ fontSize: "12px", marginTop: "4px" }}>to see your loan breakdown, EMI, and contribution details.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
