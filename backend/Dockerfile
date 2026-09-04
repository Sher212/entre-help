# ---- SmartAgri AI Backend - Google Cloud Run Dockerfile ----
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies for ML libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install CPU-only PyTorch first (smaller image, no CUDA needed for inference)
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend application
COPY . .

# Run data processing and model training scripts during build
# This bakes the trained models and database INTO the image
RUN python scripts/download_and_process_data.py && \
    python scripts/seed_sqlite_db.py && \
    python scripts/train_crop_recommendation.py && \
    python scripts/train_yield_prediction.py && \
    python scripts/setup_disease_model.py

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Start the FastAPI server on port 8080
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
