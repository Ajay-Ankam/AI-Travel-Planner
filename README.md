# AI Travel Planner 🌍✈️

AI Travel Planner is a **full-stack AI-powered web application** that generates **personalized travel itineraries in seconds**.

Using **Google Gemini 3 Flash**, the system converts user preferences such as **destination, budget, group size, and travel interests** into a structured multi-day itinerary including **flight suggestions, hotel recommendations, daily activities, and budget breakdowns**.

The application uses a **modern full-stack architecture** with **Next.js frontend** and **Node.js + Express backend**, deployed on **Vercel**.

---

# 🚀 Live Demo

**Deployed Application**  
https://ai-travel-planner-usqa.vercel.app

**Backend API**  
https://ai-travel-planner-opal-nine.vercel.app

**GitHub Repository**  
https://github.com/Ajay-Ankam/AI-Travel-Planner

---

# 📥 Clone the Project

```bash
git clone https://github.com/Ajay-Ankam/AI-Travel-Planner.git
cd AI-Travel-Planner
```

---

# ✨ Features

## 🤖 AI Generated Travel Itineraries
Generate structured **multi-day travel plans** based on user preferences including destination, duration, and interests.

Each itinerary includes:
- Morning activities
- Afternoon activities
- Evening activities

---


## 💰 Budget Breakdown
Displays estimated expenses across:

- Flights
- Accommodation
- Food
- Activities

The frontend visualizes this using an **interactive budget bar**.

---

## 🔄 Trip Refinement
Users can **regenerate specific days of the itinerary** without losing the entire trip plan.

This allows quick improvements to the itinerary.

---

## 📱 Responsive UI
Fully **mobile responsive interface** built using **Tailwind CSS** and modern UI components.

---

# 🛠️ Tech Stack

## Frontend

- **Next.js (App Router)**
- **Tailwind CSS**
- **Lucide React**
- **Axios**
- **React Hooks**

---

## Backend

- **Node.js**
- **Express.js**
- **Google Gemini 3 Flash**
- **Vercel Serverless Deployment**

---

# 🧠 Technical Highlights

## JSON Strict Prompt Engineering

Large Language Models often return inconsistent formats.  
To solve this, the backend enforces **strict JSON responses**.

Strategies used:

- Fixed JSON schema
- Forced non-zero numeric values
- Structured itinerary output
- Strict JSON only responses

---

## Media Integration

The AI dynamically returns:

- **Unsplash hotel images**
- **Google booking search links**

This enables the frontend to automatically display **rich travel cards**.

---

## Error Handling and Rate Limiting

Since the **Gemini Free Tier has request limits**, the backend includes:

- Graceful error handling
- Detection of **429 quota errors**
- User-friendly error responses

---

## Decoupled Architecture

The project separates **frontend and backend** allowing independent deployment and scaling.

Project structure:

```
AI-Travel-Planner
│
├── client      # Next.js frontend
│
└── server      # Express backend
```

---

# ⚙️ Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/Ajay-Ankam/AI-Travel-Planner.git
cd AI-Travel-Planner
```

---

# 🔧 Backend Setup

Navigate to the backend folder:

```bash
cd server
npm install
```

Create a `.env` file inside the **server folder**:

```
GEMINI_API_KEY=your_google_gemini_api_key
PORT=5000
```

Run the backend server:

```bash
npm start
```

---

# 💻 Frontend Setup

Navigate to the frontend folder:

```bash
cd ../client
npm install
```

Create a `.env.local` file inside the **client folder**:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

---

# 🌐 Deployment

The project is deployed using **Vercel**.

Frontend: Next.js deployment  
Backend: Express serverless functions

Live Application:  
https://ai-travel-planner-usqa.vercel.app

---

# 📄 License

This project is distributed under the **MIT License**.

---

# 👨‍💻 Author

**Ajay Ankam**

GitHub  
https://github.com/Ajay-Ankam