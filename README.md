# 🚀 Intern Dashboard

A full-stack Intern Dashboard application built with:

- ⚛️ Frontend: React (Vite)
- 🟢 Backend: Node.js + Express
- 🗄 Database: MongoDB
- 🔐 Authentication: JWT-based authentication
- ☁️ Deployment: Render

---

## 🌐 Live Demo

Frontend + Backend (Deployed):

👉 https://intern-dashboard-nlrr.onrender.com

---

## 📌 Features

### 🔐 Authentication
- User Registration
- User Login
- JWT Token-based authentication
- Protected Routes
- Logout functionality

---

### 📊 Dashboard
After login, users can:

- View all tasks
- Create a new task
- Update task details
- Delete tasks
- Filter tasks (pending/completed)
- Search tasks

---

## 🏗 Tech Stack

### Frontend
- React
- Zustand (State Management)
- React Router
- TailwindCSS
- React Hook Form + Zod

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcryptjs (password hashing)

---

## 📡 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |

---

### 📋 Task Routes

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

---

## 🧪 Postman Collection

You can test APIs using:

- Import endpoints manually
- Or create a collection with above routes
- Use Bearer Token (JWT) for protected routes

Authorization Header:

---

## ⚙️ Local Setup

### 1️⃣ Clone Repo

```bash
git clone <your-repo-link>
cd intern-dashboard

2️⃣ Backend Setup
cd backend
npm install
npm start

Create .env file:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

3️⃣ Frontend Setup
cd ..
npm install
npm run dev

Create .env file:

VITE_API_URL=http://localhost:5000
