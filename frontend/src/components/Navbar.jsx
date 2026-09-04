import React from "react";
import { useFarmer } from "../context/FarmerContext";
import { 
  Building2, 
  MapPin, 
  Menu
} from "lucide-react";

export default function Navbar() {
  const { 
    profile, 
    activeTab,
    setActiveTab,
    setMobileDrawerOpen
  } = useFarmer();

  return (
    <header className="top-navbar">
      {/* Left Area: Hamburger (Mobile) + Logo & Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="mobile-hamburger-btn"
          aria-label="Open Navigation Menu"
        >
          <Menu size={22} color="#0f172a" />
        </button>

        {/* App Logo */}
        <div 
          onClick={() => setActiveTab("landing")}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px", 
            cursor: "pointer" 
          }}
        >
          <div style={{
            width: "34px",
            height: "34px",
            borderRadius: "9px",
            background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            boxShadow: "0 4px 10px rgba(5, 150, 105, 0.25)",
            flexShrink: 0
          }}>
            <Building2 size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "16px", letterSpacing: "-0.02em", color: "#0f172a", lineHeight: 1.1 }}>
              Entre <span style={{ color: "#059669" }}>Help</span>
            </div>
            <div className="navbar-subtitle-hide" style={{ fontSize: "10px", color: "#64748b", fontWeight: 500 }}>
              AI Platform for Entrepreneurs
            </div>
          </div>
        </div>

        {/* Location Pill (Responsive) */}
        <div 
          onClick={() => setActiveTab("profile")}
          className="navbar-weather-pill"
        >
          <MapPin size={12} color="#059669" />
          <span>{profile.district || profile.state}</span>
          <span style={{ color: "#86efac" }}>•</span>
          <span style={{ fontSize: "11px", color: "#059669" }}>{profile.social_category}</span>
        </div>
      </div>

      {/* Right Area: Actions & Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Active Profile Pill */}
        <div 
          onClick={() => setActiveTab("profile")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "4px 10px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            cursor: "pointer",
            minHeight: "36px"
          }}
        >
          <div style={{
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            background: "#0284c7",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 700,
            flexShrink: 0
          }}>
            {profile.name ? profile.name.charAt(0) : "U"}
          </div>
          <div className="navbar-profile-text" style={{ textAlign: "left", lineHeight: 1.1 }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e293b", whiteSpace: "nowrap" }}>
              {profile.name ? profile.name.split(" ")[0] : "User"}
            </div>
            <div style={{ fontSize: "9px", color: "#64748b" }}>
              {profile.annual_income ? `${(profile.annual_income / 100000).toFixed(1)}L Income` : "Profile"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
