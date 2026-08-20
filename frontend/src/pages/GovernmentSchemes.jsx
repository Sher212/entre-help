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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span className="badge badge-purple">Dataset 5 • Indian Government Schemes</span>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>Semantic Profile Eligibility Matcher</span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
            Government Scheme & Subsidy Discovery
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b" }}>
            Discover central and state government agricultural schemes, financial assistance, and subsidies customized for your farm.
          </p>
        </div>

        <button
          onClick={() => {
            setMatchMode(!matchMode);
            setSearchQuery("");
            setSelectedCategory("All");
          }}
          className={`btn ${matchMode ? "btn-primary" : "btn-secondary"}`}
          style={{ fontSize: "13px" }}
        >
          <UserCheck size={16} />
          <span>{matchMode ? "Matched for Your Profile" : "Switch to Profile Matching"}</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={16} color="#64748b" style={{ position: "absolute", left: "12px", top: "12px" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by scheme name or benefit (e.g. drip irrigation, solar pump, crop insurance, PM-KISAN)"
              className="form-input"
              style={{ paddingLeft: "36px" }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search Schemes
          </button>
        </form>

        {/* Category Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setMatchMode(false);
                setSelectedCategory(cat);
              }}
              style={{
                padding: "6px 12px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                border: "1px solid",
                borderColor: selectedCategory === cat && !matchMode ? "#059669" : "#e2e8f0",
                background: selectedCategory === cat && !matchMode ? "#059669" : "#ffffff",
                color: selectedCategory === cat && !matchMode ? "#ffffff" : "#334155",
                transition: "all 0.15s ease"
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
        borderRadius: "12px",
        padding: "14px 20px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontSize: "13px",
        color: "#92400e"
      }}>
        <ShieldAlert size={20} color="#b45309" style={{ flexShrink: 0 }} />
        <div>
          <strong>Important Verification Notice:</strong> Eligibility and scheme availability should always be verified on the official government portal (e.g., <a href="https://www.myscheme.gov.in" target="_blank" rel="noreferrer" style={{ color: "#b45309", fontWeight: 700 }}>MyScheme.gov.in</a> or PM-KISAN) before applying. State-level quota and application cycles may vary.
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
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span className="badge badge-purple">{s.category}</span>
                      <span className="badge badge-blue">{s.level} Scheme</span>
                      {s.match_score && (
                        <span className={`badge ${s.match_score > 0.7 ? "badge-green" : "badge-amber"}`}>
                          <Sparkles size={12} /> {(s.match_score * 100).toFixed(0)}% Profile Match
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>
                      {s.scheme_name}
                    </h3>
                    <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "10px" }}>
                      Sponsoring Authority: {s.sponsoring_agency}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(s.id)}
                    style={{ background: "#f1f5f9", border: "none", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#334155" }}
                  >
                    <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {/* Key Benefits Highlight Banner */}
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "12px 16px", marginBottom: "12px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#065f46", textTransform: "uppercase", marginBottom: "2px" }}>
                    💰 Subsidy & Financial Benefit:
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#065f46" }}>
                    {s.benefits}
                  </div>
                </div>

                {/* Short Description */}
                <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5, margin: "0 0 12px 0" }}>
                  {s.description}
                </p>

                {/* Match Reasons if in Profile Match Mode */}
                {s.match_reasons && s.match_reasons.length > 0 && (
                  <div style={{ background: "#f8fafc", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", color: "#059669", fontWeight: 600, marginBottom: "12px" }}>
                    ✅ Why you qualify: {s.match_reasons.join(" • ")}
                  </div>
                )}

                {/* Expandable Deep Details */}
                {isExpanded && (
                  <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "16px", marginTop: "12px", display: "flex", flexDirection: "column", gap: "14px" }}>
                    {/* Eligibility & Exclusions */}
                    <div>
                      <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", marginBottom: "4px" }}>
                        🎯 Eligibility Criteria:
                      </h4>
                      <div style={{ fontSize: "13px", color: "#475569" }}>
                        Target: {s.target_beneficiaries}
                      </div>
                      {s.eligibility_criteria && s.eligibility_criteria.exclusions && (
                        <div style={{ fontSize: "12px", color: "#dc2626", marginTop: "2px" }}>
                          Exclusions: {s.eligibility_criteria.exclusions}
                        </div>
                      )}
                    </div>

                    {/* Documents Required */}
                    <div>
                      <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", marginBottom: "4px" }}>
                        📄 Required Documents:
                      </h4>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {s.documents_required.map((doc, idx) => (
                          <span key={idx} style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", fontSize: "12px", color: "#334155" }}>
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* How to Apply */}
                    <div>
                      <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", marginBottom: "4px" }}>
                        📝 Step-by-Step Application Process:
                      </h4>
                      <div style={{ fontSize: "13px", color: "#475569" }}>
                        {s.application_process}
                      </div>
                    </div>

                    {/* Direct Links */}
                    <div style={{ display: "flex", gap: "12px", paddingTop: "6px" }}>
                      <a
                        href={s.official_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                        style={{ padding: "8px 14px", fontSize: "12px" }}
                      >
                        <span>Visit Official Portal</span>
                        <ExternalLink size={13} />
                      </a>

                      <a
                        href={s.myscheme_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary"
                        style={{ padding: "8px 14px", fontSize: "12px" }}
                      >
                        <span>View on MyScheme.gov.in</span>
                        <ExternalLink size={13} />
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
