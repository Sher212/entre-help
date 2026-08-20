import React, { useEffect } from "react";
import { useFarmer } from "../context/FarmerContext";
import confetti from "canvas-confetti";
import {
  X,
  Sprout,
  Droplets,
  CloudSun,
  Bug,
  TrendingUp,
  Landmark,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Sparkles
} from "lucide-react";

export default function ActionPlanModal() {
  const { showActionPlanModal, setShowActionPlanModal, actionPlan, profile } = useFarmer();

  useEffect(() => {
    if (showActionPlanModal) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti fallback
      }
    }
  }, [showActionPlanModal]);

  if (!showActionPlanModal || !actionPlan) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowActionPlanModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: "32px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", borderBottom: "1px solid #e2e8f0", paddingBottom: "18px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <span className="badge badge-green" style={{ padding: "5px 12px", fontSize: "13px" }}>
                <Sparkles size={14} /> Official Farm Intelligence Summary
              </span>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                {actionPlan.generated_at}
              </span>
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
              Your Farm Action Plan
            </h2>
            <div style={{ fontSize: "14px", color: "#475569" }}>
              Tailored agronomic decision support for <strong>{actionPlan.farmer_name}</strong> ({profile.district}, {profile.state})
            </div>
          </div>

          <button
            onClick={() => setShowActionPlanModal(false)}
            style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <X size={18} color="#64748b" />
          </button>
        </div>

        {/* 8-Point Farm Action Plan Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* 1. Crop Advisory */}
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <div style={{ background: "#10b981", color: "#fff", padding: "6px", borderRadius: "8px" }}>
                <Sprout size={18} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#065f46" }}>
                🌱 Recommended Crop: {actionPlan.crop_advice.recommended_crop} ({actionPlan.crop_advice.confidence} Match)
              </h3>
            </div>
            <p style={{ fontSize: "14px", color: "#1e293b", margin: "0 0 6px 0" }}>
              <strong>Agronomic Suitability:</strong> {actionPlan.crop_advice.soil_reason}
            </p>
            <div style={{ fontSize: "13px", color: "#047857" }}>
              Expected Maturity Cycle: {actionPlan.crop_advice.duration}
            </div>
          </div>

          {/* 2. Water & Irrigation */}
          <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "12px", padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <div style={{ background: "#0284c7", color: "#fff", padding: "6px", borderRadius: "8px" }}>
                <Droplets size={18} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0369a1" }}>
                💧 Water & Irrigation Schedule: {actionPlan.irrigation_water_advice.status}
              </h3>
            </div>
            <p style={{ fontSize: "14px", color: "#1e293b", margin: "0 0 6px 0" }}>
              {actionPlan.irrigation_water_advice.action}
            </p>
            <div style={{ fontSize: "13px", color: "#0284c7" }}>
              Optimal Timing: {actionPlan.irrigation_water_advice.timing}
            </div>
          </div>

          {/* 3. Weather & 4. Health Grid */}
          <div className="grid-2">
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "12px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <CloudSun size={18} color="#b45309" />
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#92400e" }}>
                  🌦️ Weather Consideration
                </h4>
              </div>
              <div style={{ fontSize: "13px", color: "#1e293b", marginBottom: "4px" }}>
                {actionPlan.weather_action.alert}
              </div>
              <div style={{ fontSize: "12px", color: "#b45309", fontWeight: 600 }}>
                Spraying Condition: {actionPlan.weather_action.spraying_window}
              </div>
            </div>

            <div style={{ background: "#fdf2f8", border: "1px solid #fbcfe8", borderRadius: "12px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Bug size={18} color="#db2777" />
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#9d174d" }}>
                  🦠 Crop Health & Protection
                </h4>
              </div>
              <div style={{ fontSize: "13px", color: "#1e293b", marginBottom: "4px" }}>
                {actionPlan.crop_health_action.preventive_measure}
              </div>
              <div style={{ fontSize: "12px", color: "#be185d", fontWeight: 600 }}>
                Fungal Alert: {actionPlan.crop_health_action.fungal_risk}
              </div>
            </div>
          </div>

          {/* 5. Market & 6. Government Grid */}
          <div className="grid-2">
            <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <TrendingUp size={18} color="#0f172a" />
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>
                  📈 Market Selling Strategy
                </h4>
              </div>
              <div style={{ fontSize: "13px", color: "#1e293b", marginBottom: "4px" }}>
                <strong>{actionPlan.market_advice.commodity}:</strong> {actionPlan.market_advice.modal_price} ({actionPlan.market_advice.trend})
              </div>
              <div style={{ fontSize: "12px", color: "#059669", fontWeight: 600 }}>
                Best Realization Mandi: {actionPlan.market_advice.best_mandi}
              </div>
            </div>

            <div style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: "12px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Landmark size={18} color="#7e22ce" />
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#6b21a8" }}>
                  🏛️ Top Government Scheme
                </h4>
              </div>
              <div style={{ fontSize: "13px", color: "#1e293b", marginBottom: "4px" }}>
                <strong>{actionPlan.government_support.top_scheme}</strong>
              </div>
              <div style={{ fontSize: "12px", color: "#7e22ce" }}>
                {actionPlan.government_support.benefits}
              </div>
            </div>
          </div>

          {/* 7. Critical Risks */}
          <div style={{ background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: "12px", padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <AlertTriangle size={16} color="#e11d48" />
              <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#9f1239" }}>
                ⚠️ Important Risks & Uncertainties
              </h4>
            </div>
            <ul style={{ paddingLeft: "20px", fontSize: "13px", color: "#4c0519", margin: 0 }}>
              {actionPlan.critical_risks.map((risk, idx) => (
                <li key={idx} style={{ marginBottom: "2px" }}>{risk}</li>
              ))}
            </ul>
          </div>

          {/* 8. Recommended Next Steps */}
          <div style={{ background: "linear-gradient(135deg, #059669 0%, #047857 100%)", color: "#ffffff", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 12px rgba(5, 150, 105, 0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <CheckCircle2 size={20} color="#a7f3d0" />
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff" }}>
                ✅ Actionable Next Step Checklist
              </h4>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {actionPlan.immediate_next_steps.map((step, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "14px" }}>
                  <span style={{ background: "rgba(255,255,255,0.2)", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0 }}>
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ fontSize: "11px", color: "#64748b", textAlign: "center", marginTop: "4px" }}>
            {actionPlan.disclaimer}
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button 
            onClick={() => window.print()} 
            className="btn btn-secondary"
          >
            <Printer size={16} /> Print / Save PDF
          </button>
          <button 
            onClick={() => setShowActionPlanModal(false)} 
            className="btn btn-primary"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
