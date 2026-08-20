import os
import json
import joblib
import numpy as np
from PIL import Image
from io import BytesIO
from app.core.config import MODELS_DIR, DATA_PROCESSED
from app.schemas import DiseaseDiagnosisResponse

def extract_image_features(image_bytes_or_pil):
    if isinstance(image_bytes_or_pil, bytes):
        img = Image.open(BytesIO(image_bytes_or_pil)).convert("RGB")
    elif isinstance(image_bytes_or_pil, Image.Image):
        img = image_bytes_or_pil.convert("RGB")
    else:
        img = Image.open(image_bytes_or_pil).convert("RGB")
        
    img_resized = img.resize((128, 128))
    arr = np.array(img_resized, dtype=np.float32) / 255.0
    
    means = arr.mean(axis=(0, 1))
    stds = arr.std(axis=(0, 1))
    
    r_hist, _ = np.histogram(arr[:, :, 0], bins=16, range=(0, 1), density=True)
    g_hist, _ = np.histogram(arr[:, :, 1], bins=16, range=(0, 1), density=True)
    b_hist, _ = np.histogram(arr[:, :, 2], bins=16, range=(0, 1), density=True)
    
    grid_features = []
    h_step, w_step = 32, 32
    for r in range(4):
        for c in range(4):
            sub = arr[r*h_step:(r+1)*h_step, c*w_step:(c+1)*w_step, :]
            grid_features.extend(sub.mean(axis=(0, 1)))
            grid_features.extend(sub.std(axis=(0, 1)))
            
    exg = 2 * arr[:, :, 1] - arr[:, :, 0] - arr[:, :, 2]
    exg_mean = float(exg.mean())
    exg_std = float(exg.std())
    
    features = np.concatenate([
        means, stds, r_hist, g_hist, b_hist, np.array(grid_features), np.array([exg_mean, exg_std])
    ])
    return features

class DiseaseDetectionService:
    def __init__(self):
        model_file = os.path.join(MODELS_DIR, "plant_disease_model.joblib")
        if os.path.exists(model_file):
            self.artifact = joblib.load(model_file)
            self.model = self.artifact["model"]
            self.classes = self.artifact["classes"]
        else:
            self.model = None
            self.classes = []
            
        remedies_file = os.path.join(DATA_PROCESSED, "disease_remedies.json")
        if os.path.exists(remedies_file):
            with open(remedies_file, "r", encoding="utf-8") as f:
                self.remedies = json.load(f)
        else:
            self.remedies = {}

    def diagnose(self, image_data) -> DiseaseDiagnosisResponse:
        feat = extract_image_features(image_data)
        X = np.array([feat])
        
        probs = self.model.predict_proba(X)[0]
        top_indices = np.argsort(probs)[::-1][:3]
        
        top_predictions = []
        for idx in top_indices:
            cls_name = self.classes[idx]
            conf = float(probs[idx])
            rem_info = self.remedies.get(cls_name, {})
            top_predictions.append({
                "class_id": cls_name,
                "crop": rem_info.get("crop", cls_name.split("___")[0]),
                "condition": rem_info.get("condition", cls_name.split("___")[-1]),
                "status": rem_info.get("status", "Healthy" if "healthy" in cls_name.lower() else "Diseased"),
                "confidence": round(conf, 4),
                "confidence_percentage": f"{conf * 100:.1f}%"
            })
            
        best_cls = self.classes[top_indices[0]]
        best_conf = float(probs[top_indices[0]])
        rem = self.remedies.get(best_cls, {})
        
        crop_name = rem.get("crop", best_cls.split("___")[0])
        condition_name = rem.get("condition", best_cls.split("___")[-1].replace("_", " "))
        status = rem.get("status", "Healthy" if "healthy" in best_cls.lower() else "Diseased")
        severity = rem.get("severity", "None" if status == "Healthy" else "Moderate")
        pathogen = rem.get("pathogen", "N/A (Healthy Crop)")
        symptoms = rem.get("symptoms", "Healthy leaf structure with uniform pigmentation.")
        immediate_actions = rem.get("immediate_action", "Maintain regular field hygiene and standard nutrition.")
        organic_treatment = rem.get("organic_treatment", "Apply bio-fertilizer or vermicompost tea.")
        chemical_treatment = rem.get("chemical_treatment", "No chemical intervention needed.")
        prevention_measures = rem.get("prevention", "Maintain optimal crop spacing and drip irrigation.")
        
        return DiseaseDiagnosisResponse(
            detected_crop=crop_name,
            condition=condition_name,
            status=status,
            severity=severity,
            confidence=round(best_conf, 4),
            confidence_percentage=f"{best_conf * 100:.1f}%",
            pathogen=pathogen,
            symptoms=symptoms,
            immediate_actions=immediate_actions,
            organic_treatment=organic_treatment,
            chemical_treatment=chemical_treatment,
            prevention_measures=prevention_measures,
            top_predictions=top_predictions,
            disclaimer="AI-assisted image diagnosis. Symptoms should be verified by a plant pathologist or local Krishi Vigyan Kendra (KVK) expert before applying regulated chemical fungicides."
        )

disease_service = DiseaseDetectionService()
