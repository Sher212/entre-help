import React from "react";
import { useFarmer } from "../context/FarmerContext";
import {
  X, LayoutDashboard, Landmark, MapPin, Calculator, BotMessageSquare, UserCircle, Map
} from "lucide-react";

export default function MobileDrawer() {
  const {
    activeTab,
    setActiveTab,
    profile,
    mobileDrawerOpen,
    setMobileDrawerOpen,
  } = useFarmer();

  if (!mobileDrawerOpen) return null;

  const handleNav = (tabId) => {
    setActiveTab(tabId);
    setMobileDrawerOpen(false);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "schemes", label: "Find Schemes", icon: Landmark },
    { id: "compare", label: "Compare Schemes", icon: Map },
    { id: "auditor", label: "App Auditor", icon: Landmark },
    { id: "dpr", label: "DPR Generator", icon: Calculator },
    { id: "channel-partners", label: "Channel Partners", icon: MapPin },
    { id: "loan-calculator", label: "Loan Calculator", icon: Calculator },
    { id: "assistant", label: "AI Assistant", icon: BotMessageSquare },
    { id: "profile", label: "My Profile", icon: UserCircle },
  ];

  return (
    <div className="mobile-drawer-overlay" onClick={() => setMobileDrawerOpen(false)}>
      <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="mobile-drawer-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="mobile-drawer-avatar" style={{ background: "linear-gradient(135deg, #059669, #047857)", color: "#fff" }}>
              {profile.name ? profile.name[0] : "E"}
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
                {profile.name}
              </div>
              <div style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                <MapPin size={12} /> {profile.district}, {profile.state}
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="mobile-drawer-close"
            aria-label="Close Navigation Menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <div className="mobile-drawer-body">
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", padding: "10px 16px 4px 16px" }}>
            Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`mobile-drawer-item ${isActive ? "active" : ""}`}
              >
                <Icon size={18} className="mobile-drawer-icon" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
