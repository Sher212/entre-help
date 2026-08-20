import React from "react";
import { useFarmer } from "../context/FarmerContext";
import {
  LayoutDashboard,
  Sprout,
  Camera,
  Store,
  BotMessageSquare
} from "lucide-react";

export default function BottomNav() {
  const { activeTab, setActiveTab, setShowCameraScanner } = useFarmer();

  const navItems = [
    { id: "dashboard", label: "Home", icon: LayoutDashboard },
    { id: "crop-advisor", label: "Advisor", icon: Sprout },
    { id: "scan-action", label: "Scan Plant", icon: Camera, isPrimary: true },
    { id: "market", label: "Market", icon: Store },
    { id: "assistant", label: "Assistant", icon: BotMessageSquare }
  ];

  const handleNavClick = (item) => {
    if (item.id === "scan-action") {
      setShowCameraScanner(true);
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <nav className="bottom-nav-container" aria-label="Mobile Navigation">
      <div className="bottom-nav-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className="bottom-nav-scan-button"
                aria-label="Scan Plant Disease"
              >
                <div className="scan-button-circle">
                  <Camera size={24} color="#ffffff" />
                </div>
                <span className="bottom-nav-label" style={{ color: "#047857", fontWeight: 700 }}>
                  Scan Plant
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`bottom-nav-item ${isActive ? "active" : ""}`}
              aria-label={item.label}
            >
              <div className="bottom-nav-icon-wrapper">
                <Icon size={20} />
                {isActive && <div className="bottom-nav-active-pill" />}
              </div>
              <span className="bottom-nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
