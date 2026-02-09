# Smart Urban Grievance & Service Response System

A centralized AI-powered grievance management platform built using MERN Stack and Python FastAPI.

This system allows citizens to submit complaints with images and location, and automatically categorizes and prioritizes them using an AI service. Admins can monitor, filter, and update complaint statuses in real time.

---

## 🚀 Tech Stack

### Frontend
- React
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cloudinary

### AI Service
- Python
- FastAPI
- Uvicorn

---


## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd your-project-folder
```

---

## 🖥 Backend Setup

```bash
cd backend
npm install
```

Create `.env` inside backend:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
AI_SERVICE_URL=http://localhost:8000/predict
AI_SERVICE_TIMEOUT=10000
```

Run backend:

```bash
npm run dev
```

Backend runs on:  
http://localhost:5000

---

## 🤖 AI Service Setup

```bash
cd ai-service
python -m venv venv
```

Activate virtual environment:

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

Run service:

```bash
uvicorn main:app --reload --port 8000
```

AI Service runs on:  
http://localhost:8000

---

## 🌐 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:  
http://localhost:5173

---


## ✨ Features

### Citizen
- Register and Login
- Submit complaint with image and location
- Automatic AI-based category and priority detection
- Track complaint status
- View personal complaints

### Admin
- View all complaints
- Filter by category and status
- Update complaint status
- Override category and priority
- Analytics dashboard

### AI
- Text-based classification
- Priority scoring system
- Fallback handling on failure

---

## 📂 Project Structure

```
root/
├── backend/
├── frontend/
└── ai-service/
```

---


## 🔌 API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/login
```

### Complaints
```
POST /api/complaints
GET /api/complaints/my
GET /api/complaints/:id
```

### Admin
```
GET /api/admin/complaints
PATCH /api/admin/complaints/:id
```

---

## 🛠 Environment Requirements

- Node.js v18+
- Python 3.9+
- MongoDB Atlas or Local MongoDB
- Cloudinary Account

---

## 🎯 Demo Flow

1. Register as citizen  
2. Submit complaint with image and location  
3. AI automatically assigns category and priority  
4. Login as admin  
5. View, filter and update complaints  

---

## 🔮 Future Improvements

- Image-based AI classification
- Real-time updates with WebSockets
- Map integration
- Pagination and search
- Docker-based deployment

---

## 📜 License

Developed for educational and hackathon purposes.
