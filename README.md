# CivicMind – AI-Powered Urban Grievance Intelligence System

CivicMind is a smart urban grievance management platform that uses **AI (NLP, ML, LLM-ready)** to automatically classify, prioritize, and summarize citizen complaints for faster municipal response and better governance transparency.

This project is being built for a hackathon and focuses on **end-to-end AI + system integration**, not just models.

---

## 🚀 Problem Statement
Municipal corporations receive thousands of complaints daily related to:
- waste management
- water supply
- road damage
- streetlights
- sanitation

These complaints are often:
- manually processed
- poorly prioritized
- slow to resolve
- hard to track

CivicMind solves this using **AI-driven automation + dashboards**.

---

## 🧠 Core Features (Planned & In Progress)

### ✅ AI Features
- NLP-based complaint categorization (working)
- AI-based priority assignment (working)
- Confidence-based fallback logic
- Modular AI pipeline (working)
- LLM-ready complaint summarization (next)

### 🖥️ System Features
- Citizen complaint submission (in progress)
- Officer dashboard (in progress)
- Admin analytics dashboard (in progress)
- Real-time status tracking
- Map-based visualization (planned)

---

## 🏗️ Current Project Status
**AI pipeline is completed and stable**

✔ Dataset created  
✔ Model trained (96% accuracy)  
✔ Model saved and versioned  
✔ Inference module ready  
✔ Pipeline ready for backend integration  

Backend & frontend development is currently ongoing.

---

## 📁 Project Structure

CivicMind/
│
├── ai/
│ ├── data/ # complaint dataset
│ ├── models/ # trained models (ignored in git)
│ ├── training/ # training scripts
│ ├── inference/ # inference logic
│ └── pipeline.py # AI pipeline orchestrator
│
├── backend/ # FastAPI backend (WIP)
├── frontend/ # React frontend (WIP)
├── README.md
└── .gitignore



---

## 🧪 AI Pipeline (Implemented)

Complaint Text
↓
NLP Classifier
↓
Priority Scoring
↓
Fallback Logic
↓
Structured Output → Backend


---

## 🛠️ Tech Stack

### AI / ML
- Python
- scikit-learn
- TF-IDF + Logistic Regression
- Joblib

### Backend (in progress)
- FastAPI
- PostgreSQL

### Frontend (in progress)
- React
- Leaflet (maps)

---

## 👥 Team Roles
- **Team Lead & AI Lead:** Dev Patmase
- Backend Developer: (assigned)
- Frontend Developer: (assigned)
- Integration & Deployment: (assigned)

---

## 📌 Notes
- Models are not pushed to GitHub (by design)
- This repo tracks clean code only
- AI pipeline is stable and frozen
- Focus now is integration & demo

---

## 📅 Next Steps
- Integrate AI pipeline with backend
- Complete dashboards
- Final demo flow
- Deployment
- Presentation prep

---

## 🏁 Goal
Deliver a **working AI-powered system**, not just a prototype.

This project is built with production mindset, not academic mindset.
