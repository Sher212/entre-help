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
    <aside className="sidebar">
      {/* Sidebar Header */}
      <div style={{ padding: "20px 20px 14px", borderBottom: "1px solid #1e293b" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "#64748b", textTransform: "uppercase" }}>
          Platform Navigation
        </div>
      </div>

      {/* Nav List */}
      <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  fontSize: "10px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: 700,
                  background: isActive ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
                  color: isActive ? "#ffffff" : "#94a3b8"
                }}>
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid #1e293b", background: "#0b1329" }}>
        <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", display: "inline-block" }}></span>
          Backend API: Online (8/8)
        </div>
        <div style={{ fontSize: "10px", color: "#64748b" }}>
          5 Kaggle Datasets Integrated
        </div>
      </div>
    </aside>
  );
}
