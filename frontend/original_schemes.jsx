import React, { useState, useEffect } from "react";
import { useFarmer } from "../context/FarmerContext";
import { searchSchemes, matchSchemesProfile } from "../services/api";
import {
  Landmark,
  Search,
  CheckCircle2,
  ExternalLink,
  FileText,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  UserCheck,
  Award,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function GovernmentSchemes() {
  const { profile } = useFarmer();
  const [schemes, setSchemes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [matchMode, setMatchMode] = useState(true);
  const [expandedScheme, setExpandedScheme] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      if (matchMode) {
        const matched = await matchSchemesProfile(profile);
        setSchemes(matched);
        const searchRes = await searchSchemes();
        setCategories(searchRes.categories);
      } else {
        const res = await searchSchemes(searchQuery, selectedCategory);
        setSchemes(res.results);
        setCategories(res.categories);
      }
    } catch (err) {
      console.error("Schemes error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [matchMode, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setMatchMode(false);
    searchSchemes(searchQuery, selectedCategory).then((res) => {
      setSchemes(res.results);
    });
  };

  const toggleExpand = (id) => {
    setExpandedScheme(expandedScheme === id ? null : id);
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span className="badge badge-purple">Central & State Schemes</span>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>Personalized Subsidies & Benefits</span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: 0 }}>
            Government Scheme & Subsidy Discovery
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
            Discover central & state agricultural schemes and financial subsidies customized for your farm.
          </p>
        </div>

        <button
          onClick={() => {
            setMatchMode(!matchMode);
            setSearchQuery("");
            setSelectedCategory("All");
          }}
          className={`btn ${matchMode ? "btn-primary" : "btn-secondary"}`}
          style={{ fontSize: "12px", padding: "8px 14px" }}
        >
          <UserCheck size={15} />
          <span>{matchMode ? "Matched for Your Profile" : "Switch to Profile Matching"}</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
            <Search size={16} color="#64748b" style={{ position: "absolute", left: "12px", top: "12px" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schemes (e.g. drip irrigation, solar pump, PM-KISAN)"
              className="form-input"
              style={{ paddingLeft: "36px", margin: 0 }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
            Search
          </button>
        </form>

        {/* Category Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setMatchMode(false);
                setSelectedCategory(cat);
              }}
              style={{
                padding: "5px 10px",
                borderRadius: "9999px",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                border: "1px solid",
                borderColor: selectedCategory === cat && !matchMode ? "#059669" : "#e2e8f0",
                background: selectedCategory === cat && !matchMode ? "#059669" : "#ffffff",
                color: selectedCategory === cat && !matchMode ? "#ffffff" : "#334155",
                transition: "all 0.15s ease",
                minHeight: "32px"
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mandatory Government Verification Disclaimer */}
      <div style={{
        background: "#fffbeb",
        border: "1px solid #fde68a",
        borderRadius: "10px",
        padding: "12px 16px",
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "12px",
        color: "#92400e"
      }}>
        <ShieldAlert size={18} color="#b45309" style={{ flexShrink: 0 }} />
        <div>
          <strong>Important Verification Notice:</strong> Eligibility and scheme availability should always be verified on the official portal (<a href="https://www.myscheme.gov.in" target="_blank" rel="noreferrer" style={{ color: "#b45309", fontWeight: 700 }}>MyScheme.gov.in</a> or PM-KISAN) before applying.
        </div>
      </div>

      {loading && (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ display: "inline-block", animation: "spin 1s infinite linear" }}>
            <RefreshCw size={28} color="#059669" />
          </div>
          <div style={{ marginTop: "10px", fontSize: "14px", color: "#64748b" }}>
            Retrieving verified government schemes and matching eligibility...
          </div>
        </div>
      )}

      {/* Schemes List */}
      {!loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {schemes.map((s) => {
            const isExpanded = expandedScheme === s.id;
            return (
              <div
                key={s.id}
                className="card"
                style={{
                  borderLeft: s.match_score ? `4px solid ${s.match_score > 0.7 ? "#059669" : "#d97706"}` : "1px solid #e2e8f0",
                  transition: "all 0.2s ease"
                }}
              >
                {/* Scheme Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: "220px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", flexWrap: "wrap" }}>
                      <span className="badge badge-purple" style={{ fontSize: "11px" }}>{s.category}</span>
                      <span className="badge badge-blue" style={{ fontSize: "11px" }}>{s.level}</span>
                      {s.match_score && (
                        <span className={`badge ${s.match_score > 0.7 ? "badge-green" : "badge-amber"}`} style={{ fontSize: "11px" }}>
                          <Sparkles size={11} /> {(s.match_score * 100).toFixed(0)}% Match
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", margin: "4px 0" }}>
                      {s.scheme_name}
                    </h3>
                    <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "8px" }}>
                      Authority: {s.sponsoring_agency}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(s.id)}
                    style={{ background: "#f1f5f9", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600, color: "#334155", minHeight: "36px" }}
                  >
                    <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                    {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                </div>

                {/* Key Benefits Highlight Banner */}
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "10px 14px", marginBottom: "10px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#065f46", textTransform: "uppercase", marginBottom: "2px" }}>
                    💰 Subsidy Benefit:
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#065f46" }}>
                    {s.benefits}
                  </div>
                </div>

                {/* Short Description */}
                <p style={{ fontSize: "12px", color: "#475569", lineHeight: 1.4, margin: "0 0 10px 0" }}>
                  {s.description}
                </p>

                {/* Match Reasons if in Profile Match Mode */}
                {s.match_reasons && s.match_reasons.length > 0 && (
                  <div style={{ background: "#f8fafc", padding: "6px 10px", borderRadius: "6px", fontSize: "11px", color: "#059669", fontWeight: 600, marginBottom: "10px" }}>
                    ✅ Why you qualify: {s.match_reasons.join(" • ")}
                  </div>
                )}

                {/* Expandable Deep Details */}
                {isExpanded && (
                  <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "14px", marginTop: "10px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {/* Eligibility & Exclusions */}
                    <div>
                      <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#1e293b", marginBottom: "3px" }}>
                        🎯 Eligibility Criteria:
                      </h4>
                      <div style={{ fontSize: "12px", color: "#475569" }}>
                        Target: {s.target_beneficiaries}
                      </div>
                      {s.eligibility_criteria && s.eligibility_criteria.exclusions && (
                        <div style={{ fontSize: "11px", color: "#dc2626", marginTop: "2px" }}>
                          Exclusions: {s.eligibility_criteria.exclusions}
                        </div>
                      )}
                    </div>

                    {/* Documents Required */}
                    <div>
                      <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#1e293b", marginBottom: "3px" }}>
                        📄 Required Documents:
                      </h4>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {s.documents_required.map((doc, idx) => (
                          <span key={idx} style={{ background: "#f1f5f9", padding: "3px 6px", borderRadius: "4px", fontSize: "11px", color: "#334155" }}>
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* How to Apply */}
                    <div>
                      <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#1e293b", marginBottom: "3px" }}>
                        📝 How to Apply:
                      </h4>
                      <div style={{ fontSize: "12px", color: "#475569" }}>
                        {s.application_process}
                      </div>
                    </div>

                    {/* Direct Links */}
                    <div style={{ display: "flex", gap: "10px", paddingTop: "4px", flexWrap: "wrap" }}>
                      <a
                        href={s.official_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                        style={{ padding: "8px 12px", fontSize: "12px" }}
                      >
                        <span>Official Portal</span>
                        <ExternalLink size={12} />
                      </a>

                      <a
                        href={s.myscheme_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary"
                        style={{ padding: "8px 12px", fontSize: "12px" }}
                      >
                        <span>MyScheme.gov.in</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
