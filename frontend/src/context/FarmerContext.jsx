import React, { createContext, useContext, useState, useEffect } from "react";
import { getFarmerProfile, updateFarmerProfile, getProfilePresets, loadProfilePreset, getWeatherAdvisory, getFarmActionPlan } from "../services/api";

const FarmerContext = createContext();

export function FarmerProvider({ children }) {
  const [activeTab, setActiveTab] = useState("landing");
  const [profile, setProfile] = useState({
    name: "Ramesh Patil",
    state: "Maharashtra",
    district: "Nashik",
    village: "Niphad",
    land_size_acres: 3.5,
    soil_type: "Black Soil (Regur)",
    soil_ph: 6.8,
    nitrogen: 75.0,
    phosphorus: 45.0,
    potassium: 40.0,
    current_crop: "Soybean",
    farming_season: "Kharif",
    irrigation_source: "Drip Irrigation & Well",
    farmer_category: "Small (1-2 ha)",
  });
  
  const [presets, setPresets] = useState([]);
  const [weather, setWeather] = useState(null);
  const [actionPlan, setActionPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDemoTour, setShowDemoTour] = useState(false);
  const [showActionPlanModal, setShowActionPlanModal] = useState(false);

  // Fetch initial profile, presets, weather, action plan
  useEffect(() => {
    async function initData() {
      try {
        const p = await getFarmerProfile();
        setProfile(p);
        
        const pr = await getProfilePresets();
        setPresets(pr);
        
        const w = await getWeatherAdvisory(p.district || p.state, p.current_crop);
        setWeather(w);
      } catch (e) {
        console.error("Context init error:", e);
      }
    }
    initData();
  }, []);

  const saveProfile = async (newProfile) => {
    setLoading(true);
    try {
      const updated = await updateFarmerProfile(newProfile);
      setProfile(updated);
      const w = await getWeatherAdvisory(updated.district || updated.state, updated.current_crop);
      setWeather(w);
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
      const w = await getWeatherAdvisory(updated.district || updated.state, updated.current_crop);
      setWeather(w);
    } catch (e) {
      console.error("Failed to load preset:", e);
    } finally {
      setLoading(false);
    }
  };

  const refreshActionPlan = async () => {
    try {
      const plan = await getFarmActionPlan();
      setActionPlan(plan);
      return plan;
    } catch (e) {
      console.error("Failed to refresh action plan:", e);
      return null;
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
        weather,
        actionPlan,
        refreshActionPlan,
        loading,
        showDemoTour,
        setShowDemoTour,
        showActionPlanModal,
        setShowActionPlanModal,
      }}
    >
      {children}
    </FarmerContext.Provider>
  );
}

export function useFarmer() {
  return useContext(FarmerContext);
}
