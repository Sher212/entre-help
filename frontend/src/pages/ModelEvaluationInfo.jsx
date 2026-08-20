import React, { useState, useEffect } from "react";
import { getModelsSummary } from "../services/api";
import {
  Database,
  Award,
  Layers,
  ShieldCheck,
  ExternalLink,
  Table,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from "lucide-react";

export default function ModelEvaluationInfo() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModelsSummary().then(setSummary).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ display: "inline-block", animation: "spin 1s infinite linear" }}>
          <RefreshCw size={32} color="#059669" />
        </div>
        <div style={{ marginTop: "12px", color: "#64748b" }}>Loading model benchmarks and dataset provenance...</div>
      </div>
    );
  }

  const cropAlgos = summary?.crop_recommendation_metrics?.algorithm_comparison || {};
  const yieldAlgos = summary?.crop_yield_metrics?.algorithm_comparison || {};

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span className="badge badge-green">Open Model Transparency & Governance</span>
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
          Datasets Provenance & Model Evaluation
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b" }}>
          Complete documentation of all 5 Kaggle datasets, model architectures, validation metrics, and safety guidelines.
        </p>
      </div>

      {/* 5 Datasets Full Table */}
      <div className="card" style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "16px" }}>
          📚 5 Required Kaggle Datasets Provenance
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {summary?.datasets?.map((d, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "20px",
                background: "#f8fafc"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <span className="badge badge-green" style={{ marginBottom: "4px" }}>{d.name.split("—")[0].trim()}</span>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
                    {d.name.split("—")[1]?.trim() || d.name}
                  </h3>
                </div>

                <a
                  href={d.kaggle_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ padding: "6px 12px", fontSize: "12px" }}
                >
                  <span>Kaggle Dataset Source</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              <p style={{ fontSize: "13px", color: "#334155", margin: "0 0 10px 0", lineHeight: 1.5 }}>
                <strong>Purpose:</strong> {d.purpose}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", fontSize: "12px", color: "#475569", background: "#ffffff", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div>
                  <strong>Records:</strong> {d.records_count}
                </div>
                <div>
                  <strong>Trained Model:</strong> {d.model_trained}
                </div>
                <div>
                  <strong>Performance Metric:</strong> <span style={{ color: "#059669", fontWeight: 700 }}>{d.performance}</span>
                </div>
              </div>

              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "10px" }}>
                <strong>Preprocessing:</strong> {d.preprocessing} • <strong>License:</strong> {d.license}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Benchmark Comparison Tables */}
      <div className="grid-2" style={{ marginBottom: "32px" }}>
        {/* Table 1: Crop Recommendation Classifiers */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
              🌱 Crop Recommendation Classifiers
            </h3>
            <span className="badge badge-green">5-Fold CV</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "10px" }}>Algorithm</th>
                  <th style={{ padding: "10px" }}>Test Accuracy</th>
                  <th style={{ padding: "10px" }}>F1 Score</th>
                  <th style={{ padding: "10px" }}>CV Mean (5-Fold)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(cropAlgos).map(([name, m]) => (
                  <tr key={name} style={{ borderBottom: "1px solid #f1f5f9", background: name === "Random Forest" ? "#f0fdf4" : "#ffffff" }}>
                    <td style={{ padding: "10px", fontWeight: 700, color: name === "Random Forest" ? "#059669" : "#1e293b" }}>
                      {name} {name === "Random Forest" && "🏆 (Selected)"}
                    </td>
                    <td style={{ padding: "10px", fontWeight: 700 }}>{(m.test_accuracy * 100).toFixed(2)}%</td>
                    <td style={{ padding: "10px" }}>{(m.f1_weighted * 100).toFixed(2)}%</td>
                    <td style={{ padding: "10px" }}>{(m.cv_mean_accuracy * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Crop Yield Regressors */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
              📈 Crop Yield Regressors
            </h3>
            <span className="badge badge-amber">R² / MAE / RMSE</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "10px" }}>Algorithm</th>
                  <th style={{ padding: "10px" }}>R² Score</th>
                  <th style={{ padding: "10px" }}>MAE (Tons/Ha)</th>
                  <th style={{ padding: "10px" }}>RMSE</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(yieldAlgos).map(([name, m]) => (
                  <tr key={name} style={{ borderBottom: "1px solid #f1f5f9", background: name.includes("Gradient") ? "#fffbeb" : "#ffffff" }}>
                    <td style={{ padding: "10px", fontWeight: 700, color: name.includes("Gradient") ? "#d97706" : "#1e293b" }}>
                      {name} {name.includes("Gradient") && "🏆 (Selected)"}
                    </td>
                    <td style={{ padding: "10px", fontWeight: 700 }}>{m.R2_Score?.toFixed(4)}</td>
                    <td style={{ padding: "10px" }}>{m.MAE?.toFixed(2)}</td>
                    <td style={{ padding: "10px" }}>{m.RMSE?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AI Safety and Responsibility Guidelines */}
      <div className="card" style={{ background: "#f8fafc", borderLeft: "4px solid #059669" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <ShieldCheck size={20} color="#059669" />
          <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
            Safety, Reliability & Ethical Decision Support
          </h3>
        </div>
        <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.6, margin: "0 0 8px 0" }}>
          1. <strong>Uncertainty Communication:</strong> Every recommendation reports confidence levels and probabilistic ranges. We avoid claiming deterministic guarantee of yield or pest elimination.<br />
          2. <strong>Grounding in Real Agricultural Datasets:</strong> All backend endpoints query real trained models and cleaned datasets (Agmarknet, PlantVillage, ICAR, DA&FW).<br />
          3. <strong>Human Expert Verification:</strong> Farmers are advised to confirm critical high-expenditure chemical spray choices or large-scale crop shifts with local Krishi Vigyan Kendra (KVK) extension officers.
        </p>
      </div>
    </div>
  );
}
