# Cogniva Docs 📚 - AI-Powered Multi-PDF Chat Agent

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![License](https://img.shields.io/badge/License-MIT-yellow)


## 🚀 Project Overview

**Cogniva Docs** is a powerful AI-driven application that allows users to chat with multiple PDF documents simultaneously. By leveraging advanced Large Language Models (LLMs) and Vector Databases, the system extracts, chunks, and retrieves relevant information from uploaded PDFs to provide accurate, context-aware responses.

This project enables real-time document analysis, making it easier to extract insights from research papers, legal contracts, textbooks, and technical manuals without reading them manually.

![App Screenshot](frontend/src/assets/robot-mascot.png)

## 🏗️ Architecture & Technologies


The project is built using a modern **Frontend-Backend architecture**:

### **1. Frontend (React + Vite + TypeScript)**
- **Framework:** React 18 with Vite for ultra-fast performance.
- **Language:** TypeScript for type safety and scalability.
- **Styling:** Tailwind CSS with a custom design system (gradients, glassmorphism).
- **UI Components:** Lucide React icons, Sonner for toast notifications.
- **Markdown Rendering:** `react-markdown` & `remark-gfm` for beautiful chat responses (supports bullet points, code blocks).
- **State Management:** React Hooks (`useState`, `useEffect`).

### **2. Backend (FastAPI + Python)**
- **Framework:** FastAPI for high-performance Async API handling.
- **PDF Processing:** `PyPDF2` for text extraction.
- **Text Chunking:** `LangChain` (RecursiveCharacterTextSplitter) for splitting large documents.
- **Embeddings:** OpenAI `text-embedding-ada-002` (via OpenRouter) for semantic search.
- **Vector Database:** `FAISS` (Facebook AI Similarity Search) for efficient storage and retrieval of document chunks.
- **LLM Integration:** OpenAI GPT-3.5-turbo (via OpenRouter) for generating natural language answers.

---

## ⚙️ How It Works (Workflow)

1. **Upload**: User uploads one or multiple PDF files via the frontend sidebar.
2. **Process**: The backend reads the PDFs, extracts text, breaks it into overlapping chunks, and converts them into vector embeddings.
3. **Store**: These embeddings are stored locally in a FAISS vector index.
4. **Chat**: When the user asks a question:
   - The query is converted into an embedding.
   - The system searches the FAISS index for the most relevant text chunks.
   - The retrieved chunks + the user question are sent to the LLM (GPT-3.5).
   - The LLM generates a detailed, formatted answer based **only** on the document context.
5. **Response**: The answer is streamed back to the frontend and displayed with rich formatting.

---

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js (v18+)
- Python (v3.10+)
- OpenRouter API Key (or OpenAI Key)

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/Cogniva-Docs.git
cd Cogniva-Docs
```

### **2. Backend Setup**
```bash
# Navigate to root directory
# Create virtual environment
python -m venv multpdf_env
source multpdf_env/bin/activate  # On Windows: multpdf_env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "OPENROUTER_API_KEY=your_api_key_here" > .env

# Run Server
python api.py
```
*Backend runs on: `http://localhost:8000`*

### **3. Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install

# Run Development Server
npm run dev
```
*Frontend runs on: `http://localhost:8080`*

---

## 🎯 Key Features
- **Multi-PDF Support**: Chat with dozens of files at once.
- **Source-Based Answers**: The AI cites whether information is from the PDF or general knowledge.
- **Rich Text Support**: Answers include bold headers, bullet points, and code blocks.
- **Fast & Responsive**: Powered by FAISS for millisecond-level search speeds.
- **Modern UI**: Clean, aesthetic interface with a responsive sidebar and chat area.

---

## 🤝 Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License
MIT License. Created by **Thamizhvendhan**.
