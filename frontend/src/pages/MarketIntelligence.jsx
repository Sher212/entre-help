import React, { useState, useEffect } from "react";
import { useFarmer } from "../context/FarmerContext";
import {
  getMarketFilters,
  getMarketTrends,
  getWhereToSell
} from "../services/api";
import {
  Store,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Sparkles,
  Search,
  Award,
  ShieldCheck,
  RefreshCw,
  BarChart3,
  Scale
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

export default function MarketIntelligence() {
  const { profile } = useFarmer();
  const [filters, setFilters] = useState(null);
  const [selectedCommodity, setSelectedCommodity] = useState(profile.current_crop || "Soybean");
  const [selectedState, setSelectedState] = useState(profile.state || "Maharashtra");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedMandi, setSelectedMandi] = useState("All");

  const [trends, setTrends] = useState(null);
  const [whereToSell, setWhereToSell] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMarketFilters().then((f) => {
      setFilters(f);
      if (f.commodities.includes(selectedCommodity)) {
        loadMarketData(selectedCommodity, selectedState, "All", "All");
      } else if (f.commodities.length > 0) {
        setSelectedCommodity(f.commodities[0]);
        loadMarketData(f.commodities[0], selectedState, "All", "All");
      }
    }).catch(console.error);
  }, []);

  const loadMarketData = async (comm, st, dist, mnd) => {
    setLoading(true);
    try {
      const tData = await getMarketTrends(comm, st, dist, mnd);
      setTrends(tData);

      const wData = await getWhereToSell(comm, st);
      setWhereToSell(wData);
    } catch (err) {
      console.error("Market data error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    loadMarketData(selectedCommodity, selectedState, selectedDistrict, selectedMandi);
  };

  const chartData = trends && trends.price_history ? trends.price_history.map((p) => ({
    date: p.date.slice(5),
    modal: p.modal_price,
    min: p.min_price,
    max: p.max_price
  })) : [];

  const districts = filters && filters.districts_by_state[selectedState] ? filters.districts_by_state[selectedState] : [];
  const mandis = (filters && selectedDistrict !== "All" && filters.mandis_by_district[`${selectedState}__${selectedDistrict}`])
    ? filters.mandis_by_district[`${selectedState}__${selectedDistrict}`]
    : [];

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span className="badge badge-blue">Dataset 4 • 57,330 Records</span>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>Agmarknet India Mandi Wholesale Prices</span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
            India Mandi Market Intelligence
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b" }}>
            Analyze historical wholesale price movements, price spreads, and compare top-performing APMC mandis.
          </p>
        </div>
      </div>

      {/* Cascading Filter Bar */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <form onSubmit={handleApplyFilters} style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", alignItems: "flex-end" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Commodity / Crop</label>
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="form-select"
            >
              {filters && filters.commodities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">State</label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict("All");
                setSelectedMandi("All");
              }}
              className="form-select"
            >
              {filters && filters.states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedMandi("All");
              }}
              className="form-select"
            >
              <option value="All">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Mandi / APMC</label>
            <select
              value={selectedMandi}
              onChange={(e) => setSelectedMandi(e.target.value)}
              className="form-select"
            >
              <option value="All">All Mandis</option>
              {mandis.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ height: "42px" }}
          >
            <Search size={16} /> Filter Market Data
          </button>
        </form>
      </div>

      {loading && (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ display: "inline-block", animation: "spin 1s infinite linear" }}>
            <RefreshCw size={28} color="#059669" />
          </div>
          <div style={{ marginTop: "10px", fontSize: "14px", color: "#64748b" }}>
            Aggregating historical wholesale prices and price spreads...
          </div>
        </div>
      )}

      {!loading && trends && (
        <>
          {/* Market KPIs */}
          <div className="grid-4" style={{ marginBottom: "24px" }}>
            <div className="card card-blue-gradient">
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#0369a1", textTransform: "uppercase" }}>
                Latest Modal Price
              </div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#0369a1", margin: "4px 0" }}>
                ₹{trends.latest_modal_price}
              </div>
              <div style={{ fontSize: "12px", color: "#0284c7" }}>
                per Quintal (100 kg)
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                Price Trend Movement
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "4px 0" }}>
                <span style={{ fontSize: "22px", fontWeight: 800, color: trends.trend_direction.includes("Rising") ? "#059669" : trends.trend_direction.includes("Falling") ? "#dc2626" : "#64748b" }}>
                  {trends.price_change_percentage > 0 ? `+${trends.price_change_percentage}%` : `${trends.price_change_percentage}%`}
                </span>
                {trends.trend_direction.includes("Rising") ? <TrendingUp size={20} color="#059669" /> : <TrendingDown size={20} color="#dc2626" />}
              </div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                {trends.trend_direction}
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                Price Range (Min - Max)
              </div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: "4px 0" }}>
                ₹{trends.min_price} - ₹{trends.max_price}
              </div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                Avg: ₹{trends.average_price} / Qtl
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                Price Volatility
              </div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: "4px 0" }}>
                {trends.volatility_rating}
              </div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                Historical standard deviation
              </div>
            </div>
          </div>

          {/* Historical Price Chart */}
          <div className="card" style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
                  Historical Wholesale Price Trend — {selectedCommodity} ({selectedState})
                </h3>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  Modal Price vs Min/Max Band (INR per Quintal)
                </span>
              </div>
              <span className="badge badge-green">Historical Data</span>
            </div>

            <div style={{ height: "260px", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={['auto', 'auto']} unit="₹" tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val) => [`₹${val}`, ""]} />
                  <Legend />
                  <Area type="monotone" dataKey="max" name="Max Price" fill="#e0f2fe" stroke="#7dd3fc" strokeDasharray="3 3" />
                  <Area type="monotone" dataKey="min" name="Min Price" fill="#f8fafc" stroke="#cbd5e1" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="modal" name="Modal Price" stroke="#0284c7" strokeWidth={3} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* "Where Should I Sell?" Market Ranking Table */}
          {whereToSell && (
            <div className="card" style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <Award size={18} color="#d97706" />
                    <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a" }}>
                      Where Should I Sell? — Top Mandi Realizations in {selectedState}
                    </h3>
                  </div>
                  <p style={{ fontSize: "13px", color: "#475569", margin: 0 }}>
                    {whereToSell.price_spread_analysis}
                  </p>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                      <th style={{ padding: "12px 14px", fontWeight: 700, color: "#334155" }}>Rank</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700, color: "#334155" }}>Mandi / APMC</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700, color: "#334155" }}>District</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700, color: "#334155" }}>Avg Modal Price</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700, color: "#334155" }}>Peak Price</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700, color: "#334155" }}>Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {whereToSell.best_mandis.map((m) => (
                      <tr key={m.rank} style={{ borderBottom: "1px solid #f1f5f9", background: m.rank === 1 ? "#f0fdf4" : "#ffffff" }}>
                        <td style={{ padding: "12px 14px", fontWeight: 700, color: m.rank === 1 ? "#059669" : "#64748b" }}>
                          #{m.rank}
                        </td>
                        <td style={{ padding: "12px 14px", fontWeight: 700, color: "#0f172a" }}>
                          {m.market}
                        </td>
                        <td style={{ padding: "12px 14px", color: "#475569" }}>
                          {m.district}
                        </td>
                        <td style={{ padding: "12px 14px", fontWeight: 800, color: "#059669" }}>
                          ₹{m.avg_modal_price} / Qtl
                        </td>
                        <td style={{ padding: "12px 14px", color: "#64748b" }}>
                          ₹{m.max_price_recorded}
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span className={`badge ${m.rank === 1 ? "badge-green" : "badge-amber"}`}>
                            {m.recommendation_badge}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: "14px", background: "#f8fafc", padding: "12px 16px", borderRadius: "10px", fontSize: "12px", color: "#475569" }}>
                💡 <strong>Selling Advice:</strong> {whereToSell.market_advice}
              </div>
            </div>
          )}

          {/* Historical Data Notice */}
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "12px", padding: "14px 18px", fontSize: "12px", color: "#92400e" }}>
            📌 <strong>Dataset Notice:</strong> {trends.data_attribution}
          </div>
        </>
      )}
    </div>
  );
}
