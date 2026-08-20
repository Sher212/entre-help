import React, { useState, useEffect } from "react";
import { useFarmer } from "../context/FarmerContext";
import {
  diagnoseLeafFile,
  diagnoseSampleLeaf,
  getDiseaseSamples,
  getDiseaseClasses
} from "../services/api";
import {
  Bug,
  UploadCloud,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  FlaskConical,
  Sprout,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Info,
  Camera,
  BotMessageSquare,
  FileText
} from "lucide-react";

export default function DiseaseDetection() {
  const { 
    setShowCameraScanner, 
    askAiAboutDisease, 
    setShowActionPlanModal, 
    refreshActionPlan 
  } = useFarmer();

  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDiseaseSamples().then((data) => {
      setSamples(data);
      if (data && data.length > 0 && !result) {
        handleDiagnoseSample(data[0].filename);
      }
    }).catch(console.error);
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setSelectedSample(null);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
    setLoading(true);

    try {
      const res = await diagnoseLeafFile(file);
      setResult(res);
    } catch (err) {
      setError(err.message || "Failed to process image");
    } finally {
      setLoading(false);
    }
  };

  const handleDiagnoseSample = async (filename) => {
    setSelectedSample(filename);
    setUploadedFile(null);
    setImagePreview(`http://127.0.0.1:8000/static/samples/${filename}`);
    setError(null);
    setLoading(true);

    try {
      const res = await diagnoseSampleLeaf(filename);
      setResult(res);
    } catch (err) {
      setError(err.message || "Failed to diagnose sample");
    } finally {
      setLoading(false);
    }
  };

  const handleAskAi = () => {
    if (result) {
      askAiAboutDisease(result, imagePreview);
    }
  };

  const handleAddToPlan = async () => {
    await refreshActionPlan();
    setShowActionPlanModal(true);
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span className="badge badge-purple">Dataset 2 • PlantVillage</span>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>27 Classes • Vision AI</span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: 0 }}>
            Plant Leaf Disease Detection & Cure
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
            Use phone camera or upload a leaf photograph for instant AI pathogen diagnosis and organic/chemical remedies.
          </p>
        </div>

        {/* Prominent Live Camera Action Button */}
        <button
          onClick={() => setShowCameraScanner(true)}
          className="btn btn-primary"
          style={{ padding: "10px 18px", fontSize: "14px", background: "linear-gradient(135deg, #059669 0%, #047857 100%)", boxShadow: "0 4px 12px rgba(5, 150, 105, 0.25)" }}
        >
          <Camera size={18} />
          <span><strong>📷 Open Camera Scanner</strong></span>
        </button>
      </div>

      <div className="grid-2">
        {/* Left Column: Image Upload & Sample Gallery */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Upload & Camera Dropzone */}
          <div className="card" style={{ textAlign: "center", borderStyle: "dashed", borderWidth: "2px", borderColor: "#059669", padding: "20px 14px" }}>
            <input
              type="file"
              id="leaf-upload"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <UploadCloud size={26} />
              </div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                  Take Photo or Upload Leaf Image
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                  JPG, JPEG, PNG from Camera or Gallery
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={() => setShowCameraScanner(true)}
                  className="btn btn-primary"
                  style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                  <Camera size={15} /> Open Camera
                </button>

                <label
                  htmlFor="leaf-upload"
                  className="btn btn-secondary"
                  style={{ padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}
                >
                  Browse Gallery
                </label>
              </div>
            </div>
          </div>

          {/* Preset Sample Leaf Test Gallery */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                Instant Test Gallery (PlantVillage Samples)
              </h3>
              <span style={{ fontSize: "11px", color: "#64748b" }}>Tap to test</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
              {samples.slice(0, 8).map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => handleDiagnoseSample(s.filename)}
                  style={{
                    border: `2px solid ${selectedSample === s.filename ? "#059669" : "#e2e8f0"}`,
                    borderRadius: "8px",
                    overflow: "hidden",
                    cursor: "pointer",
                    background: "#f8fafc",
                    textAlign: "center",
                    padding: "4px",
                    transition: "all 0.15s ease"
                  }}
                >
                  <img
                    src={`http://127.0.0.1:8000${s.url}`}
                    alt={s.label}
                    style={{ width: "100%", height: "55px", objectFit: "cover", borderRadius: "6px", marginBottom: "2px" }}
                  />
                  <div style={{ fontSize: "9px", fontWeight: 600, color: "#334155", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {s.label.replace("Tomato ", "").replace("Potato ", "").replace("Corn ", "")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Image Input Preview */}
          {imagePreview && (
            <div className="card" style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px" }}>
              <img
                src={imagePreview}
                alt="Leaf Preview"
                style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "10px", border: "1px solid #e2e8f0", flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>Active Image Input</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {uploadedFile ? uploadedFile.name : selectedSample}
                </div>
                <div style={{ fontSize: "12px", color: "#059669", fontWeight: 600, marginTop: "2px" }}>
                  Status: {loading ? "Analyzing leaf image..." : "Diagnosis Ready"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Diagnosis Results & Remedies */}
        <div>
          {loading && (
            <div className="card" style={{ textAlign: "center", padding: "50px 20px" }}>
              <div style={{ display: "inline-block", animation: "spin 1s infinite linear" }}>
                <RefreshCw size={30} color="#059669" />
              </div>
              <div style={{ marginTop: "14px", fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                Extracting Spatial & Chlorophyll Features...
              </div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                Running Multi-Scale Vision Classifier over 27 PlantVillage classes
              </div>
            </div>
          )}

          {error && (
            <div className="card" style={{ background: "#fee2e2", borderColor: "#fecaca", color: "#991b1b" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
                <AlertTriangle size={18} /> Error Processing Image
              </div>
              <div style={{ fontSize: "13px", marginTop: "4px" }}>{error}</div>
            </div>
          )}

          {!loading && result && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Diagnosis Hero Card */}
              <div style={{
                background: result.status === "Healthy" 
                  ? "linear-gradient(135deg, #065f46 0%, #047857 100%)" 
                  : "linear-gradient(135deg, #881337 0%, #be123c 100%)",
                color: "#ffffff",
                borderRadius: "16px",
                padding: "20px 24px",
                boxShadow: "0 8px 16px rgba(0,0,0,0.12)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", fontWeight: 700, textTransform: "uppercase" }}>
                    Detected Crop: {result.detected_crop}
                  </span>
                  <span style={{ background: "rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 700 }}>
                    {result.confidence_percentage} Confidence
                  </span>
                </div>

                <h2 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 6px 0" }}>
                  {result.condition}
                </h2>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px", fontSize: "12px", flexWrap: "wrap" }}>
                  <span className={`badge ${result.status === "Healthy" ? "badge-green" : "badge-red"}`}>
                    {result.status}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.9)" }}>
                    Severity: <strong>{result.severity}</strong> • Pathogen: {result.pathogen}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Ask AI & Scan Another Leaf */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={handleAskAi}
                  className="btn btn-primary"
                  style={{ flex: 1.5, minWidth: "180px", padding: "12px 16px", fontSize: "13px", justifyContent: "center" }}
                >
                  <BotMessageSquare size={16} />
                  <span><strong>💬 Ask AI About This Disease</strong></span>
                </button>

                <button
                  onClick={() => setShowCameraScanner(true)}
                  className="btn btn-secondary"
                  style={{ flex: 1, minWidth: "140px", padding: "12px 14px", fontSize: "13px", justifyContent: "center" }}
                >
                  <Camera size={16} />
                  <span>Scan Another Leaf</span>
                </button>
              </div>

              {/* Symptoms & Immediate Action */}
              <div className="card">
                <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
                  Symptoms & Immediate Action
                </h3>
                <div style={{ fontSize: "13px", color: "#334155", marginBottom: "10px", lineHeight: 1.5 }}>
                  <strong>Symptoms:</strong> {result.symptoms}
                </div>
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", color: "#991b1b" }}>
                  <strong>Immediate Action:</strong> {result.immediate_actions}
                </div>
              </div>

              {/* Treatment Protocols (Organic vs Chemical) */}
              <div className="grid-2">
                <div className="card card-gradient">
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#065f46", fontWeight: 700, fontSize: "13px", marginBottom: "6px" }}>
                    <Sprout size={15} /> Organic / Bio Treatment
                  </div>
                  <div style={{ fontSize: "12px", color: "#1e293b", lineHeight: 1.5 }}>
                    {result.organic_treatment}
                  </div>
                </div>

                <div className="card" style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#9a3412", fontWeight: 700, fontSize: "13px", marginBottom: "6px" }}>
                    <FlaskConical size={15} /> Chemical Spray / Dosage
                  </div>
                  <div style={{ fontSize: "12px", color: "#1e293b", lineHeight: 1.5 }}>
                    {result.chemical_treatment}
                  </div>
                </div>
              </div>

              {/* Prevention & Disclaimer */}
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  <ShieldCheck size={15} color="#059669" /> Preventative Cultural Practices
                </div>
                <div style={{ fontSize: "12px", color: "#475569", lineHeight: 1.5, marginBottom: "8px" }}>
                  {result.prevention_measures}
                </div>
                <div style={{ fontSize: "10px", color: "#94a3b8", borderTop: "1px solid #e2e8f0", paddingTop: "6px" }}>
                  {result.disclaimer}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
