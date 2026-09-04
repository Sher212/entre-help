import React, { useState } from "react";
import { useFarmer } from "../context/FarmerContext";
import { UserCircle, Save, Users, CheckCircle2 } from "lucide-react";

export default function EntrepreneurProfile() {
  const { profile, saveProfile, presets, applyPreset, loading } = useFarmer();
  const [form, setForm] = useState({ ...profile });
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    // Auto-derive is_women from gender
    const updatedForm = { ...form, is_women: form.gender === "Female" };
    await saveProfile(updatedForm);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const categories = ["SC", "ST", "OBC", "Minority", "General", "EWS", "PwD"];
  const genders = ["Male", "Female", "Transgender"];
  const educationLevels = ["Below 10th", "10th Pass", "12th Pass", "Graduate", "Post-Graduate"];
  const businessTypes = ["Manufacturing", "Service", "Trading", "Transport", "Agriculture", "Retail", "Food Processing", "Artisan", "Education", "Tech Startup", "Deeptech"];
  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const fieldGroup = (label, field, type = "text", options = null) => (
    <div style={{ flex: "1 1 200px" }}>
      <label style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
        {label}
      </label>
      {options ? (
        <select value={form[field]} onChange={(e) => handleChange(field, e.target.value)} className="form-input" style={{ margin: 0 }}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === "number" ? (
        <input type="number" value={form[field]} onChange={(e) => handleChange(field, Number(e.target.value))} className="form-input" style={{ margin: 0 }} />
      ) : type === "checkbox" ? (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 0" }}>
          <input type="checkbox" checked={form[field]} onChange={(e) => handleChange(field, e.target.checked)} style={{ width: "18px", height: "18px", cursor: "pointer" }} />
          <span style={{ fontSize: "13px", color: "#334155" }}>Yes</span>
        </div>
      ) : (
        <input type="text" value={form[field]} onChange={(e) => handleChange(field, e.target.value)} className="form-input" style={{ margin: 0 }} />
      )}
    </div>
  );

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: 0 }}>
          <UserCircle size={24} style={{ verticalAlign: "middle", marginRight: "8px" }} />
          Entrepreneur Profile
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
          Your profile determines which schemes you're eligible for. Update it for accurate matching.
        </p>
      </div>

      {/* Presets */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
          <Users size={16} color="#4f46e5" />
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Quick Load Demo Profile</h3>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {presets.map((p) => (
            <button
              key={p.preset_id}
              onClick={() => { applyPreset(p.preset_id); setForm(p.profile); }}
              className="btn btn-secondary"
              style={{ fontSize: "11px", padding: "6px 12px" }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Form */}
      <div className="card">
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>Personal & Business Details</h3>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginBottom: "20px" }}>
          {fieldGroup("Full Name", "name")}
          {fieldGroup("Social Category", "social_category", "text", categories)}
          {fieldGroup("Gender", "gender", "text", genders)}
          {fieldGroup("Age", "age", "number")}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginBottom: "20px" }}>
          {fieldGroup("Annual Family Income (₹)", "annual_income", "number")}
          {fieldGroup("State", "state", "text", states)}
          {fieldGroup("District", "district")}
          {fieldGroup("Education Level", "education_level", "text", educationLevels)}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginBottom: "20px" }}>
          {fieldGroup("Business Type", "business_type", "text", businessTypes)}
          {fieldGroup("Total Project Cost (₹)", "project_cost", "number")}
          {fieldGroup("Person with Disability", "is_pwd", "checkbox")}
          {fieldGroup("SHG Member", "is_shg_member", "checkbox")}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginBottom: "20px" }}>
          {fieldGroup("Existing Business?", "is_existing_business", "checkbox")}
        </div>

        <button
          onClick={handleSave}
          className="btn btn-primary"
          style={{ padding: "12px 24px", fontSize: "14px", fontWeight: 700 }}
          disabled={loading}
        >
          {saved ? <><CheckCircle2 size={16} /> Profile Saved!</> : <><Save size={16} /> Save & Match Schemes</>}
        </button>
      </div>
    </div>
  );
}
