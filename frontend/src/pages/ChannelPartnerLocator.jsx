import React, { useState, useEffect } from "react";
import { useFarmer } from "../context/FarmerContext";
import { searchChannelPartners, getChannelPartnerStates } from "../services/api";
import { MapPin, Phone, Building2, Filter, RefreshCw, ChevronDown } from "lucide-react";

export default function ChannelPartnerLocator() {
  const { profile } = useFarmer();
  const [partners, setPartners] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(profile.state || "");
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getChannelPartnerStates().then((res) => setStates(res.states || []));
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [selectedState, selectedType]);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await searchChannelPartners(selectedState, selectedType);
      setPartners(res.results || []);
    } catch (err) {
      console.error("Channel partner fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const typeColors = {
    SCA: { bg: "#ede9fe", color: "#7c3aed", border: "#c4b5fd" },
    PSB: { bg: "#dbeafe", color: "#2563eb", border: "#93c5fd" },
    RRB: { bg: "#d1fae5", color: "#059669", border: "#6ee7b7" },
    "NBFC-MFI": { bg: "#fef3c7", color: "#d97706", border: "#fcd34d" },
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span className="badge" style={{ background: "#ede9fe", color: "#7c3aed", border: "1px solid #c4b5fd" }}>Channel Finance System</span>
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: 0 }}>
          Channel Partner Locator
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
          Find State Channelizing Agencies (SCAs), Banks & RRBs to apply for MoSJE/NSFDC schemes.
        </p>
      </div>

      {/* Important Notice */}
      <div style={{
        background: "#fef3c7", border: "1px solid #fde68a", borderRadius: "10px",
        padding: "12px 16px", marginBottom: "20px", fontSize: "12px", color: "#92400e",
        display: "flex", alignItems: "center", gap: "10px"
      }}>
        <Building2 size={18} color="#b45309" style={{ flexShrink: 0 }} />
        <div>
          <strong>Important:</strong> NSFDC/NSTFDC do NOT accept direct loan applications. 
          You must apply through one of these authorized Channel Partners in your state.
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="form-input"
              style={{ margin: 0 }}
            >
              <option value="">All States</option>
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: "200px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
              Partner Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="form-input"
              style={{ margin: 0 }}
            >
              <option value="">All Types</option>
              <option value="SCA">State Channelizing Agency (SCA)</option>
              <option value="PSB">Public Sector Bank (PSB)</option>
              <option value="RRB">Regional Rural Bank (RRB)</option>
              <option value="NBFC-MFI">NBFC / MFI</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ display: "inline-block", animation: "spin 1s infinite linear" }}>
            <RefreshCw size={28} color="#7c3aed" />
          </div>
          <div style={{ marginTop: "10px", fontSize: "14px", color: "#64748b" }}>
            Finding Channel Partners...
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>
            Showing {partners.length} Channel Partner{partners.length !== 1 ? "s" : ""}
            {selectedState ? ` in ${selectedState}` : ""}
          </div>

          {partners.map((p) => {
            const colors = typeColors[p.type] || typeColors.SCA;
            return (
              <div
                key={p.id}
                className="card"
                style={{ borderLeft: `4px solid ${colors.color}`, transition: "all 0.2s ease" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ flex: 1, minWidth: "220px" }}>
                    <div style={{ display: "flex", gap: "6px", marginBottom: "6px", flexWrap: "wrap" }}>
                      <span style={{
                        padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700,
                        background: colors.bg, color: colors.color, border: `1px solid ${colors.border}`
                      }}>
                        {p.type}
                      </span>
                      <span className="badge" style={{ background: "#f1f5f9", color: "#475569", fontSize: "11px" }}>
                        {p.state}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", margin: "4px 0" }}>
                      {p.name}
                    </h3>

                    {p.address && (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                        <MapPin size={12} /> {p.address}
                      </div>
                    )}

                    {p.contact && (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#059669", fontWeight: 600, marginTop: "4px" }}>
                        <Phone size={12} /> {p.contact}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {partners.length === 0 && (
            <div className="card" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
              No Channel Partners found. Try selecting a different state or type.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
