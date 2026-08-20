import React from "react";
import { useFarmer } from "../context/FarmerContext";
import { 
  Sprout, 
  CloudSun, 
  MapPin, 
  User, 
  Sparkles, 
  FileText,
  PlayCircle
} from "lucide-react";

export default function Navbar() {
  const { 
    profile, 
    weather, 
    setShowDemoTour, 
    setShowActionPlanModal, 
    refreshActionPlan,
    activeTab,
    setActiveTab 
  } = useFarmer();

  const handleOpenActionPlan = async () => {
    await refreshActionPlan();
    setShowActionPlanModal(true);
  };

  return (
    <header className="top-navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div 
          onClick={() => setActiveTab("landing")}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "10px", 
            cursor: "pointer" 
          }}
        >
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            boxShadow: "0 4px 10px rgba(5, 150, 105, 0.3)"
          }}>
            <Sprout size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "17px", letterSpacing: "-0.02em", color: "#0f172a" }}>
              KrishiKalyan <span style={{ color: "#059669" }}>AI</span>
            </div>
            <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 500 }}>
              AI Platform for Indian Farmers
            </div>
          </div>
        </div>

        {/* Location & Weather Pill */}
        {weather && (
          <div 
            onClick={() => setActiveTab("weather")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              padding: "6px 14px",
              borderRadius: "9999px",
              fontSize: "12px",
              color: "#166534",
              fontWeight: 600,
              cursor: "pointer",
              marginLeft: "12px"
            }}
          >
            <MapPin size={13} color="#059669" />
            <span>{profile.district || profile.state}</span>
            <span style={{ color: "#86efac" }}>•</span>
            <CloudSun size={14} color="#059669" />
            <span>{weather.current.temperature.toFixed(1)}°C {weather.current.condition_text.split(" ")[0]}</span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Hackathon Demo Tour Button */}
        <button 
          onClick={() => setShowDemoTour(true)}
          className="btn btn-secondary"
          style={{ padding: "7px 14px", fontSize: "13px" }}
        >
          <PlayCircle size={15} color="#059669" />
          <span>Interactive Demo Flow</span>
        </button>

        {/* View Action Plan Button */}
        <button 
          onClick={handleOpenActionPlan}
          className="btn btn-amber"
          style={{ padding: "7px 16px", fontSize: "13px" }}
        >
          <FileText size={15} />
          <span>Farm Action Plan</span>
        </button>

        {/* Active Profile Pill */}
        <div 
          onClick={() => setActiveTab("profile")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "5px 12px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          <div style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "#0284c7",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: 700
          }}>
            {profile.name.charAt(0)}
          </div>
          <div style={{ textAlign: "left", lineHeight: 1.2 }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e293b" }}>
              {profile.name}
            </div>
            <div style={{ fontSize: "10px", color: "#64748b" }}>
              {profile.land_size_acres} Acres • {profile.current_crop || "Farmer"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
