import React from "react";
import { useFarmer } from "../context/FarmerContext";
import {
  LayoutDashboard,
  Sprout,
  TrendingUp,
  Bug,
  CloudSun,
  Store,
  Landmark,
  BotMessageSquare,
  UserCheck,
  Database,
  Home
} from "lucide-react";

export default function Sidebar() {
  const { activeTab, setActiveTab } = useFarmer();

  const navItems = [
    { id: "landing", label: "Product Overview", icon: Home, badge: null },
    { id: "dashboard", label: "Farmer Dashboard", icon: LayoutDashboard, badge: "Live" },
    { id: "crop-advisor", label: "AI Crop Advisor", icon: Sprout, badge: "Dataset 1" },
    { id: "yield-predictor", label: "Yield Prediction", icon: TrendingUp, badge: "Dataset 3" },
    { id: "disease-detection", label: "Disease Detection", icon: Bug, badge: "Dataset 2" },
    { id: "weather", label: "Weather & Advisory", icon: CloudSun, badge: "Real-time" },
    { id: "market", label: "Market Intelligence", icon: Store, badge: "Dataset 4" },
    { id: "schemes", label: "Govt Schemes", icon: Landmark, badge: "Dataset 5" },
    { id: "assistant", label: "AI Farmer Assistant", icon: BotMessageSquare, badge: "GenAI" },
    { id: "profile", label: "Farmer Profile", icon: UserCheck, badge: null },
    { id: "models-info", label: "Datasets & Models", icon: Database, badge: "5 Datasets" },
  ];

  return (
    <aside className="sidebar" aria-label="Desktop Sidebar Navigation">
      {/* Sidebar Header with Brand */}
      <div className="sidebar-header">
        <div 
          onClick={() => setActiveTab("landing")}
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginBottom: "6px" }}
        >
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            boxShadow: "0 4px 10px rgba(5, 150, 105, 0.3)",
            flexShrink: 0
          }}>
            <Sprout size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "15px", letterSpacing: "-0.02em", color: "#ffffff", lineHeight: 1.1 }}>
              KrishiKalyan <span style={{ color: "#10b981" }}>AI</span>
            </div>
            <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 500 }}>
              Kisan AI Sahayata Desk
            </div>
          </div>
        </div>
      </div>

      {/* Nav List (Independently Scrollable if items exceed viewport) */}
      <nav className="sidebar-nav">
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", color: "#64748b", textTransform: "uppercase", padding: "4px 16px 8px" }}>
          Platform Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {item.label}
              </span>
              {item.badge && (
                <span style={{
                  fontSize: "9px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: 700,
                  background: isActive ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
                  color: isActive ? "#ffffff" : "#94a3b8",
                  flexShrink: 0
                }}>
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Fixed Status Footer */}
      <div className="sidebar-footer">
        <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10b981", display: "inline-block", flexShrink: 0 }}></span>
          <span>Backend API: Online (8/8)</span>
        </div>
        <div style={{ fontSize: "10px", color: "#64748b" }}>
          5 Kaggle Datasets Integrated
        </div>
      </div>
    </aside>
  );
}
