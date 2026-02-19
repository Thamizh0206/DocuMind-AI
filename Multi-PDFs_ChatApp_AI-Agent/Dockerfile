# Build Frontend
FROM node:18-alpine as build-frontend
WORKDIR /app/frontend
# Copy package files
COPY frontend/package*.json ./
RUN npm ci
# Copy source
COPY frontend/ .
# Build with relative paths (VITE_API_URL empty)
RUN VITE_API_URL="" npm run build

# Build Backend
FROM python:3.10-slim

WORKDIR /app

# Create a non-root user for Hugging Face Spaces
RUN useradd -m -u 1000 user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Copy built frontend from previous stage
COPY --from=build-frontend /app/frontend/dist /app/frontend/dist

# Fix ownership
RUN chown -R user:user /app

# Switch to non-root user
USER user

# Pre-download the model (Removed as we are using key-based embeddings)
# RUN python -c "from langchain_community.embeddings import HuggingFaceEmbeddings; HuggingFaceEmbeddings(model_name='all-MiniLM-L6-v2')"

# Expose port 7860 for Hugging Face Spaces
EXPOSE 7860

# Run commands
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "7860"]
