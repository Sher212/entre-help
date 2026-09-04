import React from "react";
import { useFarmer } from "../context/FarmerContext";
import { LayoutDashboard, Landmark, MapPin, Calculator, BotMessageSquare } from "lucide-react";

export default function BottomNav() {
  const { activeTab, setActiveTab } = useFarmer();

  const items = [
    { id: "dashboard", label: "Home", icon: LayoutDashboard },
    { id: "schemes", label: "Schemes", icon: Landmark },
    { id: "channel-partners", label: "Partners", icon: MapPin },
    { id: "loan-calculator", label: "Loan", icon: Calculator },
    { id: "assistant", label: "Chat", icon: BotMessageSquare },
  ];

  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`bottom-nav-item ${isActive ? "active" : ""}`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
