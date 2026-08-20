import React, { useState } from "react";
import { useFarmer } from "../context/FarmerContext";
import {
  UserCheck,
  Save,
  CheckCircle,
  Sparkles,
  MapPin,
  Sprout,
  Droplets,
  Layers,
  Scale,
  RefreshCw
} from "lucide-react";

export default function FarmerProfile() {
  const { profile, saveProfile, presets, applyPreset, loading } = useFarmer();
  const [formData, setFormData] = useState({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await saveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePresetClick = (presetId) => {
    applyPreset(presetId);
    const targetPreset = presets.find((p) => p.preset_id === presetId);
    if (targetPreset) {
      setFormData({ ...targetPreset.profile });
    }
  };

  const soilTypes = [
    "Black Soil (Regur)",
    "Alluvial Loam",
    "Red Sandy Loam",
    "Laterite Soil",
    "Clay Loam",
    "Sandy Riverbed Soil"
  ];

  const categories = [
    "Marginal (< 1 ha)",
    "Small (1-2 ha)",
    "Medium (2-10 ha)",
    "Large (> 10 ha)"
  ];

  const irrigationSources = [
    "Drip Irrigation & Well",
    "Canal & Submersible Borewell",
    "Sprinkler Irrigation",
    "Rainfed / Monsoonal",
    "River Lift Irrigation",
    "Solar Agricultural Pump"
  ];

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span className="badge badge-green">Personalized Context Hub</span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
            Farmer Profile & Farm Context
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b" }}>
            Your personal farm details dynamically customize crop recommendations, yield calculations, weather alerts, and government subsidy matching.
          </p>
        </div>
      </div>

      {/* Preset Archetype Switcher */}
      <div className="card" style={{ marginBottom: "24px", background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)", border: "1px solid #bbf7d0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <Sparkles size={18} color="#059669" />
          <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#065f46" }}>
            Quick Demo Farmer Presets (1-Click Switch)
          </h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {presets.map((p) => (
            <button
              key={p.preset_id}
              onClick={() => handlePresetClick(p.preset_id)}
              className="btn btn-secondary"
              style={{
                textAlign: "left",
                justifyContent: "flex-start",
                padding: "10px 14px",
                fontSize: "12px",
                background: profile.name === p.profile.name ? "#dcfce7" : "#ffffff",
                borderColor: profile.name === p.profile.name ? "#86efac" : "#e2e8f0",
                color: profile.name === p.profile.name ? "#166534" : "#334155"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <strong>{p.profile.name}</strong>
                <span style={{ fontSize: "11px", color: "#64748b" }}>{p.profile.district}, {p.profile.state} ({p.profile.current_crop})</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave}>
        <div className="grid-2" style={{ marginBottom: "24px" }}>
          {/* Personal & Geographic Details */}
          <div className="card">
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
              📍 Location & Farmer Identity
            </h3>

            <div className="form-group">
              <label className="form-label">Farmer Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="form-input"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleChange("district", e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Village / Taluka</label>
                <input
                  type="text"
                  value={formData.village || ""}
                  onChange={(e) => handleChange("village", e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Farmer Category</label>
                <select
                  value={formData.farmer_category}
                  onChange={(e) => handleChange("farmer_category", e.target.value)}
                  className="form-select"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Land Size (Acres)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="100"
                value={formData.land_size_acres}
                onChange={(e) => handleChange("land_size_acres", Number(e.target.value))}
                className="form-input"
              />
            </div>
          </div>

          {/* Soil & Agricultural Context */}
          <div className="card">
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
              🌱 Soil Test Readings & Cropping
            </h3>

            <div className="form-group">
              <label className="form-label">Soil Classification</label>
              <select
                value={formData.soil_type}
                onChange={(e) => handleChange("soil_type", e.target.value)}
                className="form-select"
              >
                {soilTypes.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              <div className="form-group">
                <label className="form-label">Nitrogen (N)</label>
                <input
                  type="number"
                  value={formData.nitrogen}
                  onChange={(e) => handleChange("nitrogen", Number(e.target.value))}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phosphorus (P)</label>
                <input
                  type="number"
                  value={formData.phosphorus}
                  onChange={(e) => handleChange("phosphorus", Number(e.target.value))}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Potassium (K)</label>
                <input
                  type="number"
                  value={formData.potassium}
                  onChange={(e) => handleChange("potassium", Number(e.target.value))}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Soil pH Level</label>
                <input
                  type="number"
                  step="0.1"
                  min="3.5"
                  max="9.5"
                  value={formData.soil_ph}
                  onChange={(e) => handleChange("soil_ph", Number(e.target.value))}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Current Crop</label>
                <input
                  type="text"
                  value={formData.current_crop || ""}
                  onChange={(e) => handleChange("current_crop", e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Primary Irrigation Facility</label>
              <select
                value={formData.irrigation_source}
                onChange={(e) => handleChange("irrigation_source", e.target.value)}
                className="form-select"
              >
                {irrigationSources.map((ir) => (
                  <option key={ir} value={ir}>{ir}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "14px", alignItems: "center" }}>
          {savedSuccess && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#059669", fontWeight: 700, fontSize: "14px" }}>
              <CheckCircle size={18} /> Profile updated and synced across all modules!
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: "12px 28px", fontSize: "15px" }}
          >
            <Save size={16} />
            <span>{loading ? "Saving..." : "Save Farmer Profile"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
