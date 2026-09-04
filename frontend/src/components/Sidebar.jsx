import React from "react";
import { useFarmer } from "../context/FarmerContext";
import {
  LayoutDashboard,
  Building2,
  Landmark,
  BotMessageSquare,
  UserCheck,
  MapPin,
  Calculator,
  Home,
  Scale,
  ClipboardCheck,
  FileText
} from "lucide-react";

export default function Sidebar() {
  const { activeTab, setActiveTab } = useFarmer();

  const navItems = [
    { id: "landing", label: "Overview", icon: Home },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "schemes", label: "Govt Schemes", icon: Landmark },
    { id: "compare", label: "Compare Schemes", icon: Scale },
    { id: "auditor", label: "App Auditor", icon: ClipboardCheck },
    { id: "dpr", label: "DPR Generator", icon: FileText },
    { id: "loan-calculator", label: "Loan Calculator", icon: Calculator },
    { id: "channel-partners", label: "Channel Partners", icon: MapPin },
    { id: "assistant", label: "AI Assistant", icon: BotMessageSquare },
    { id: "profile", label: "My Profile", icon: UserCheck },
  ];

  return (
    <aside className="sidebar" aria-label="Desktop Sidebar Navigation">
      {/* Sidebar Header with Brand */}
      <div className="sidebar-header">
        <div 
          onClick={() => setActiveTab("landing")}
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginBottom: "4px" }}
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
            <Building2 size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "15px", letterSpacing: "-0.02em", color: "#ffffff", lineHeight: 1.1 }}>
              Entre <span style={{ color: "#10b981" }}>Help</span>
            </div>
            <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 500 }}>
              Entre Help — AI Scheme Engine
            </div>
          </div>
        </div>
      </div>

      {/* Nav List */}
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
            </div>
          );
        })}
      </nav>

      {/* Fixed Clean Footer */}
      <div className="sidebar-footer">
        <div style={{ fontSize: "11px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10b981", display: "inline-block", flexShrink: 0 }}></span>
          <span>Entre Help</span>
        </div>
        <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>
          MoSJE Scheme Hub
        </div>
      </div>
    </aside>
  );
}
