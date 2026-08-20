import React, { useState } from "react";
import { useFarmer } from "../context/FarmerContext";
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Play,
  Sparkles,
  UserCheck,
  Sprout,
  TrendingUp,
  CloudSun,
  Bug,
  Store,
  Landmark,
  BotMessageSquare,
  FileCheck
} from "lucide-react";

export default function DemoTourModal() {
  const { showDemoTour, setShowDemoTour, setActiveTab, refreshActionPlan, setShowActionPlanModal } = useFarmer();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      step: 1,
      title: "Farmer Profile Setup",
      tab: "profile",
      icon: UserCheck,
      desc: "Configure farmer profile with landholding, soil NPK nutrients, pH, location (State, District, Village), and current crop context.",
      actionLabel: "Go to Profile"
    },
    {
      step: 2,
      title: "Soil & Agro-Climatic Analysis",
      tab: "crop-advisor",
      icon: Sprout,
      desc: "Calibrate soil Nitrogen, Phosphorus, Potassium, pH, and local rainfall inputs to evaluate soil nutrient balance.",
      actionLabel: "Go to Crop Advisor"
    },
    {
      step: 3,
      title: "AI Crop Recommendation (Dataset 1)",
      tab: "crop-advisor",
      icon: Sprout,
      desc: "Receive top recommended crops powered by our Random Forest classifier trained on 2,200 Kaggle crop records (98.8% Accuracy).",
      actionLabel: "Evaluate Crops"
    },
    {
      step: 4,
      title: "Crop Yield Prediction (Dataset 3)",
      tab: "yield-predictor",
      icon: TrendingUp,
      desc: "Estimate expected yield (Tons/Ha and Quintals/Acre) using our Gradient Boosting regressor trained on multi-state crop yield data.",
      actionLabel: "Predict Yield"
    },
    {
      step: 5,
      title: "Weather-Aware Agro-Advisory",
      tab: "weather",
      icon: CloudSun,
      desc: "Access 7-day weather forecast with actionable rules: Irrigation timing, spraying condition windows, heat stress, and fungal risk alerts.",
      actionLabel: "Check Weather"
    },
    {
      step: 6,
      title: "Plant Disease Detection (Dataset 2)",
      tab: "disease-detection",
      icon: Bug,
      desc: "Upload leaf photos or select sample leaves to diagnose 27 PlantVillage diseases with organic remedies and chemical schedules.",
      actionLabel: "Diagnose Leaf"
    },
    {
      step: 7,
      title: "India Mandi Intelligence (Dataset 4)",
      tab: "market",
      icon: Store,
      desc: "Explore 57,000+ daily wholesale mandi price trends, volatility metrics, and the 'Where Should I Sell?' smart market ranker.",
      actionLabel: "View Mandi Rates"
    },
    {
      step: 8,
      title: "Government Scheme Discovery (Dataset 5)",
      tab: "schemes",
      icon: Landmark,
      desc: "Discover matching central and state welfare schemes (PM-KISAN, PMKSY, PMFBY, KCC, SMAM) tailored to land size and category.",
      actionLabel: "Find Schemes"
    },
    {
      step: 9,
      title: "Central AI Assistant & Farm Action Plan",
      tab: "assistant",
      icon: BotMessageSquare,
      desc: "Interact with the central tool-augmented AI assistant and generate the consolidated 8-point 'Your Farm Action Plan'.",
      actionLabel: "Chat & Action Plan"
    }
  ];

  if (!showDemoTour) return null;

  const current = steps[currentStep];
  const Icon = current.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowDemoTour(false);
      refreshActionPlan().then(() => {
        setShowActionPlanModal(true);
      });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleJumpToTab = () => {
    setActiveTab(current.tab);
    setShowDemoTour(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setShowDemoTour(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px", padding: "28px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="badge badge-amber" style={{ fontSize: "12px" }}>
              <Play size={12} /> Interactive Hackathon Walkthrough
            </span>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
              Step {current.step} of {steps.length}
            </span>
          </div>

          <button
            onClick={() => setShowDemoTour(false)}
            style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <X size={16} color="#64748b" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div style={{ width: "100%", height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden", marginBottom: "20px" }}>
          <div
            style={{
              height: "100%",
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
              transition: "width 0.3s ease"
            }}
          />
        </div>

        {/* Step Body */}
        <div style={{ textAlign: "center", padding: "12px 10px 20px" }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#059669",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 4px 12px rgba(5, 150, 105, 0.15)"
          }}>
            <Icon size={32} />
          </div>

          <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
            {current.title}
          </h3>

          <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, maxWidth: "480px", margin: "0 auto 20px" }}>
            {current.desc}
          </p>

          <button
            onClick={handleJumpToTab}
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px", fontSize: "14px" }}
          >
            <span>{current.actionLabel}</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Navigation Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0", paddingTop: "16px", marginTop: "10px" }}>
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="btn btn-secondary"
            style={{ opacity: currentStep === 0 ? 0.5 : 1, padding: "8px 16px" }}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div style={{ display: "flex", gap: "6px" }}>
            {steps.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setCurrentStep(idx)}
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: idx === currentStep ? "#059669" : "#cbd5e1",
                  cursor: "pointer"
                }}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="btn btn-amber"
            style={{ padding: "8px 18px" }}
          >
            {currentStep === steps.length - 1 ? (
              <>
                <span>Complete Demo</span>
                <CheckCircle size={16} />
              </>
            ) : (
              <>
                <span>Next Step</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
