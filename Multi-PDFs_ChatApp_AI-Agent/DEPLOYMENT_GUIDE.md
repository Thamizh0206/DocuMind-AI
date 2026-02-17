# 🚀 Deployment Guide for Cogniva Docs

This guide covers two common methods to deploy your application:
1.  **Render.com** (Recommended for easiest free/cheap hosting)
2.  **Docker** (For containerized deployment)

---

## Option 1: Deploy to Render.com (Easiest)

Render is excellent for this project because it supports both Python (FastAPI) and Node (React) easily.

### Phase 1: Deploy Backend (FastAPI)

1.  **Push your code to GitHub/GitLab**.
2.  **Sign up/Login** to [Render.com](https://render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your repository.
5.  Configure the service:
    *   **Name**: `cogniva-backend` (or unique name)
    *   **Root Directory**: `.` (leave empty to use project root)
    *   **Runtime**: **Python 3**
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn api:app --host 0.0.0.0 --port $PORT`
6.  **Environment Variables** (Scroll down to "Advanced"):
    *   Key: `OPENROUTER_API_KEY`
    *   Value: `your_actual_api_key_starting_with_sk-...`
    *   Key: `PYTHON_VERSION`
    *   Value: `3.10.12` (Optional, helps avoid version mismatch)
7.  Click **Create Web Service**.
8.  **Wait for deployment**. Once live, copy your backend URL (e.g., `https://cogniva-backend.onrender.com`).

### Phase 2: Deploy Frontend (React + Vite)

1.  On Render dashboard, Click **New +** -> **Static Site**.
2.  Connect the **same repository**.
3.  Configure the service:
    *   **Name**: `cogniva-frontend`
    *   **Root Directory**: `frontend`
    *   **Build Command**: `npm install && npm run build`
    *   **Publish Directory**: `dist`
4.  **Environment Variables**:
    *   Key: `VITE_API_URL`
    *   Value: `https://cogniva-backend.onrender.com` (Paste URL from Phase 1)
        *   *Note: Remove trailing slash if present, though app usually handles it.*
5.  **Redirects/Rewrites** (Crucial for React Router):
    *   Go to **Settings** -> **Redirects/Rewrites**.
    *   Add a new rule:
        *   **Source**: `/*`
        *   **Destination**: `/index.html`
        *   **Action**: `Rewrite`
6.  Click **Create Static Site**.

---

## Option 2: Docker Deployment

Use this if you want to run the entire stack in containers (e.g., on a VPS, AWS EC2, or locally).

### 1. Create `Dockerfile` (Backend)

Create a file named `Dockerfile` in the project root:

```dockerfile
# /Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies (needed for some python packages)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Expose port
EXPOSE 8000

# Run commands
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Create `Dockerfile` (Frontend)

Create `frontend/Dockerfile`:

```dockerfile
# /frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Set the backend URL for build time
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

(You will also need a simple `nginx.conf` in frontend folder for React routing)

### 3. Docker Compose (Run both)

Create `docker-compose.yml` in root:

```yaml
version: '3.8'

services:
  backend:
    build: 
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
```

### 4. Run it
```bash
docker-compose up --build
```
