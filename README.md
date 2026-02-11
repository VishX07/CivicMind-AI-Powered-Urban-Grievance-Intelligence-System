# Smart Urban Grievance & Service Response System

AI-powered grievance management platform built using MERN Stack and Python FastAPI.

Citizens submit complaints with image and location.  
AI automatically assigns category and priority.  
Admin monitors, filters and manages complaints in real time with live updates.

---

# 🧱 Tech Stack

## Frontend

- React
- Tailwind CSS
- Axios
- React Router
- Socket.IO Client

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Cloudinary
- Socket.IO

## AI Service

- Python
- FastAPI
- Uvicorn
- Pydantic

---

# 🛠 System Requirements

- Node.js v18+
- MongoDB Atlas Access
- Python 3.10 or 3.11

⚠ Do NOT use Python 3.14

---

# 🔐 Application Flow

1. Register as Citizen
2. Submit complaint with image and location
3. AI assigns category and priority
4. Login as Admin
5. View, filter and update complaints
6. New complaints appear instantly via Socket.IO

---

# 🚀 Installation & Run Instructions

## Clone Repository

```bash
git clone <repo-url>
```

---

## 1️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev

```

Backend runs on:

```
http://localhost:5000

```

---

## 2️⃣ AI Service Setup

Check Python version:

```bash
python --version
```

It must be 3.10 or 3.11.

Create virtual environment:

```bash
cd ai-service
python -m venv venv
```

Activate environment:

Windows:

```bash
venv\Scripts\activate
```

Mac/Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run AI service:

```bash
uvicorn main:app --reload --port 8000
```

AI Service runs on:

```
http://localhost:8000
```

---

## 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm install socket.io-client
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🧪 Test Endpoint

Health Check:

```
GET http://localhost:5000/api/health
```

---

# ▶ Run Order (Important)

Start services in this order:

1. Backend
2. AI Service
3. Frontend

---

Project ready to use.
