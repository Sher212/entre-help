import React, { useState, useEffect } from "react";
import { useFarmer } from "../context/FarmerContext";
import { getWeatherAdvisory } from "../services/api";
import {
  CloudSun,
  MapPin,
  Search,
  Droplets,
  Wind,
  Thermometer,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Sun,
  CloudRain
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

export default function WeatherAdvisory() {
  const { profile } = useFarmer();
  const [locationInput, setLocationInput] = useState(profile.district || "Nashik");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (loc) => {
    setLoading(true);
    try {
      const data = await getWeatherAdvisory(loc, profile.current_crop);
      setWeatherData(data);
    } catch (err) {
      console.error("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(locationInput);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (locationInput.trim()) {
      fetchWeather(locationInput.trim());
    }
  };

  const chartData = weatherData && weatherData.forecast ? weatherData.forecast.map((f) => ({
    day: f.day_name.slice(0, 3),
    maxTemp: f.temp_max,
    minTemp: f.temp_min,
    rain: f.rain_sum_mm,
    rainProb: f.precipitation_probability_max
  })) : [];

  return (
    <div className="page-wrapper">
      {/* Header & Location Search */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span className="badge badge-blue">Real-time Weather Service</span>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>Open-Meteo Global Agro-Meteorology</span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
            Agro-Meteorological Advisory
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b" }}>
            Translating live weather forecasts into actionable irrigation, spraying, harvest, and disease-prevention decisions.
          </p>
        </div>

        <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px" }}>
          <div style={{ position: "relative" }}>
            <MapPin size={16} color="#64748b" style={{ position: "absolute", left: "12px", top: "12px" }} />
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Search Indian District (e.g. Pune, Ludhiana)"
              className="form-input"
              style={{ paddingLeft: "36px", width: "260px" }}
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary">
            <Search size={16} /> Search
          </button>
        </form>
      </div>

      {loading && (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ display: "inline-block", animation: "spin 1s infinite linear" }}>
            <RefreshCw size={28} color="#059669" />
          </div>
          <div style={{ marginTop: "10px", fontSize: "14px", color: "#64748b" }}>
            Fetching meteorological data and computing agro-advisories...
          </div>
        </div>
      )}

      {!loading && weatherData && (
        <>
          {/* Current Weather Banner */}
          <div style={{
            background: "linear-gradient(135deg, #0369a1 0%, #0284c7 60%, #38bdf8 100%)",
            color: "#ffffff",
            borderRadius: "20px",
            padding: "28px 32px",
            marginBottom: "28px",
            boxShadow: "0 10px 20px -5px rgba(2, 132, 199, 0.3)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#e0f2fe", fontWeight: 600, marginBottom: "4px" }}>
                <MapPin size={15} /> {weatherData.current.location_name}
              </div>
              <h2 style={{ fontSize: "36px", fontWeight: 800, margin: 0 }}>
                {weatherData.current.temperature.toFixed(1)}°C
              </h2>
              <div style={{ fontSize: "16px", color: "#f0f9ff", fontWeight: 600, marginTop: "2px" }}>
                {weatherData.current.condition_text}
              </div>
            </div>

            <div style={{ display: "flex", gap: "24px", background: "rgba(255,255,255,0.15)", padding: "14px 24px", borderRadius: "14px", backdropFilter: "blur(8px)" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#e0f2fe" }}>
                  <Droplets size={14} /> Humidity
                </div>
                <div style={{ fontSize: "18px", fontWeight: 700 }}>
                  {weatherData.current.humidity.toFixed(0)}%
                </div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#e0f2fe" }}>
                  <Wind size={14} /> Wind Speed
                </div>
                <div style={{ fontSize: "18px", fontWeight: 700 }}>
                  {weatherData.current.wind_speed_kmh.toFixed(1)} km/h
                </div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#e0f2fe" }}>
                  <CloudRain size={14} /> Precip
                </div>
                <div style={{ fontSize: "18px", fontWeight: 700 }}>
                  {weatherData.current.precipitation_mm.toFixed(1)} mm
                </div>
              </div>
            </div>
          </div>

          {/* 5 Agro-Advisory Action Cards Grid */}
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "16px" }}>
            Actionable Agricultural Recommendations
          </h2>

          <div className="grid-3" style={{ marginBottom: "28px" }}>
            {/* 1. Irrigation Advisory */}
            <div className="card" style={{ borderLeft: "4px solid #0284c7" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#0369a1" }}>💧 Irrigation Timing</span>
                <span className="badge badge-blue">{weatherData.advisory.irrigation_advice.status}</span>
              </div>
              <p style={{ fontSize: "13px", color: "#1e293b", margin: "0 0 8px 0" }}>
                {weatherData.advisory.irrigation_advice.summary}
              </p>
              <div style={{ fontSize: "12px", color: "#0284c7", fontWeight: 600 }}>
                {weatherData.advisory.irrigation_advice.action}
              </div>
            </div>

            {/* 2. Spraying Safety Window */}
            <div className="card" style={{ borderLeft: "4px solid #059669" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#065f46" }}>🎯 Spraying Window</span>
                <span className="badge badge-green">{weatherData.advisory.spraying_window.status}</span>
              </div>
              <p style={{ fontSize: "13px", color: "#1e293b", margin: "0 0 8px 0" }}>
                {weatherData.advisory.spraying_window.summary}
              </p>
              <div style={{ fontSize: "12px", color: "#047857", fontWeight: 600 }}>
                {weatherData.advisory.spraying_window.action}
              </div>
            </div>

            {/* 3. Disease & Pest Risk */}
            <div className="card" style={{ borderLeft: "4px solid #e11d48" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#9f1239" }}>🦠 Disease / Pest Risk</span>
                <span className="badge badge-red">{weatherData.advisory.pest_disease_risk.status}</span>
              </div>
              <p style={{ fontSize: "13px", color: "#1e293b", margin: "0 0 8px 0" }}>
                {weatherData.advisory.pest_disease_risk.summary}
              </p>
              <div style={{ fontSize: "12px", color: "#be185d", fontWeight: 600 }}>
                {weatherData.advisory.pest_disease_risk.action}
              </div>
            </div>

            {/* 4. Heat / Cold Stress */}
            <div className="card" style={{ borderLeft: "4px solid #d97706" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#92400e" }}>🌡️ Heat & Frost Risk</span>
                <span className="badge badge-amber">{weatherData.advisory.heat_cold_stress.status}</span>
              </div>
              <p style={{ fontSize: "13px", color: "#1e293b", margin: "0 0 8px 0" }}>
                {weatherData.advisory.heat_cold_stress.summary}
              </p>
              <div style={{ fontSize: "12px", color: "#b45309", fontWeight: 600 }}>
                {weatherData.advisory.heat_cold_stress.action}
              </div>
            </div>

            {/* 5. Harvest Timing */}
            <div className="card" style={{ borderLeft: "4px solid #7c3aed" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#6b21a8" }}>🚜 Harvest Planning</span>
                <span className="badge badge-purple">{weatherData.advisory.harvest_recommendation.status}</span>
              </div>
              <p style={{ fontSize: "13px", color: "#1e293b", margin: "0 0 8px 0" }}>
                {weatherData.advisory.harvest_recommendation.summary}
              </p>
              <div style={{ fontSize: "12px", color: "#7c3aed", fontWeight: 600 }}>
                {weatherData.advisory.harvest_recommendation.action}
              </div>
            </div>

            {/* 6. Overall Farm Alert Banner */}
            <div className="card" style={{ background: "#f8fafc" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "#0f172a", fontWeight: 800, fontSize: "14px" }}>
                <CheckCircle2 size={16} color="#059669" /> Daily Summary
              </div>
              <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5, margin: 0 }}>
                {weatherData.advisory.overall_farm_alert}
              </p>
            </div>
          </div>

          {/* 7-Day Forecast & Temperature/Rainfall Chart */}
          <div className="card" style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
                7-Day Weather Trend & Rainfall Outlook
              </h3>
              <span style={{ fontSize: "12px", color: "#64748b" }}>Daily High/Low Temp (°C) & Rain (mm)</span>
            </div>

            <div style={{ height: "240px", width: "100%", marginBottom: "20px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" orientation="left" domain={[10, 45]} unit="°C" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 50]} unit="mm" tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="right" dataKey="rain" name="Rain (mm)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="left" type="monotone" dataKey="maxTemp" name="Max Temp (°C)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                  <Line yAxisId="left" type="monotone" dataKey="minTemp" name="Min Temp (°C)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* 7-Day Forecast Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px" }}>
              {weatherData.forecast.map((f, i) => (
                <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 6px", textAlign: "center" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e293b", marginBottom: "4px" }}>
                    {f.day_name.slice(0, 3)}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>
                    {f.condition_text.split(" ")[0]}
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a" }}>
                    {f.temp_max.toFixed(0)}° / {f.temp_min.toFixed(0)}°
                  </div>
                  {f.rain_sum_mm > 0 && (
                    <div style={{ fontSize: "11px", color: "#0284c7", fontWeight: 600, marginTop: "4px" }}>
                      {f.rain_sum_mm.toFixed(1)} mm
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
