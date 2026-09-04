import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getEntrepreneurProfile,
  updateEntrepreneurProfile,
  getProfilePresets,
  loadProfilePreset,
} from "../services/api";

const FarmerContext = createContext();

export function FarmerProvider({ children }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profile, setProfile] = useState({
    name: "Priya Kumari",
    social_category: "SC",
    gender: "Female",
    age: 28,
    annual_income: 250000,
    state: "Bihar",
    district: "Patna",
    is_pwd: false,
    is_women: true,
    education_level: "Graduate",
    business_type: "Service",
    project_cost: 500000,
    is_existing_business: false,
    is_shg_member: true,
  });

  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(false);

  // Navigation & Modal States
  const [showDemoTour, setShowDemoTour] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Fetch initial profile and presets
  useEffect(() => {
    async function initData() {
      try {
        const p = await getEntrepreneurProfile();
        setProfile(p);

        const pr = await getProfilePresets();
        setPresets(pr);
      } catch (e) {
        console.error("Context init error:", e);
      }
    }
    initData();
  }, []);

  const saveProfile = async (newProfile) => {
    setLoading(true);
    try {
      const updated = await updateEntrepreneurProfile(newProfile);
      setProfile(updated);
    } catch (e) {
      console.error("Failed to update profile:", e);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = async (presetId) => {
    setLoading(true);
    try {
      const updated = await loadProfilePreset(presetId);
      setProfile(updated);
    } catch (e) {
      console.error("Failed to load preset:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FarmerContext.Provider
      value={{
        activeTab,
        setActiveTab,
        profile,
        setProfile,
        saveProfile,
        presets,
        applyPreset,
        loading,
        showDemoTour,
        setShowDemoTour,
        mobileDrawerOpen,
        setMobileDrawerOpen,
      }}
    >
      {children}
    </FarmerContext.Provider>
  );
}

export function useFarmer() {
  return useContext(FarmerContext);
}
