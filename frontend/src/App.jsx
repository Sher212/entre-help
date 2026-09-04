import React from "react";
import { FarmerProvider, useFarmer } from "./context/FarmerContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import MobileDrawer from "./components/MobileDrawer";

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import GovernmentSchemes from "./pages/GovernmentSchemes";
import ChannelPartnerLocator from "./pages/ChannelPartnerLocator";
import LoanCalculator from "./pages/LoanCalculator";
import AIAssistant from "./pages/AIAssistant";
import EntrepreneurProfile from "./pages/FarmerProfile";

function MainApp() {
  const { activeTab } = useFarmer();

  const renderActivePage = () => {
    switch (activeTab) {
      case "landing":
        return <LandingPage />;
      case "dashboard":
        return <Dashboard />;
      case "schemes":
        return <GovernmentSchemes />;
      case "channel-partners":
        return <ChannelPartnerLocator />;
      case "loan-calculator":
        return <LoanCalculator />;
      case "assistant":
        return <AIAssistant />;
      case "profile":
        return <EntrepreneurProfile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="main-viewport">{renderActivePage()}</main>
      </div>
      <BottomNav />
      <MobileDrawer />
    </div>
  );
}

export default function App() {
  return (
    <FarmerProvider>
      <MainApp />
    </FarmerProvider>
  );
}
