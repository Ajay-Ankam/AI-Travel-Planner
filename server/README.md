# AI Travel Planner - Backend API ✈️

This is the **backend server** for the **AI Travel Planner** application, built with **Node.js, Express, and MongoDB**.  
It utilizes the **Gemini 3 Flash model** to generate **structured, personalized travel itineraries** based on user preferences.

---

# 🚀 Features

## 🔐 Secure Authentication
- JWT-based signup and login
- Password hashing for secure storage
- Protected API routes using authentication middleware

## 🤖 AI Travel Agent
- Multi-step conversational trip planning
- Powered by the Gemini SDK
- Generates structured responses for frontend integration

## 📊 Structured Data
- Enforces strict JSON responses
- Seamless integration with frontend Generative UI

## 🧳 Trip Management
- Full CRUD functionality for user itineraries
- Users can store and manage multiple trips

## 🔄 Dynamic Edits
- Ability to regenerate a specific day of a trip using AI

## 💰 Budget Logic
- Automated group price multipliers
- Hotel tier recommendations based on budget

---

# 📂 Project Structure

```
server/
├── config/             # Database & AI SDK configurations
├── controllers/        # Business logic for Auth, Trips, and AI
├── middleware/         # Auth protection and global error handling
├── models/             # Mongoose schemas (User, Trip)
├── routes/             # API endpoint definitions
├── utils/              # Prompt templates and helper functions
├── .env                # Environment variables (Private)
└── app.js              # Entry point
```

---

# 🛠️ Setup & Installation

## 1. Clone the Repository

```bash
git clone https://github.com/Ajay-Ankam/AI-Travel-Planner.git
cd server
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file inside the **/server** folder.

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_ai_studio_key
NODE_ENV=development
```

## 4. Start the Server

### Production

```bash
npm start
```

### Development (with nodemon)

```bash
npm run dev
```

---

# 📡 API Endpoints

## 1. Authentication

Base route:

```
/api/auth
```

| Method | Endpoint | Description | Auth Required |
|------|------|------|------|
| POST | /register | Register a new user | No |
| POST | /login | Login and receive JWT | No |

---

## 2. AI Travel Agent

Base route:

```
/api/ai
```

| Method | Endpoint | Description | Auth Required |
|------|------|------|------|
| POST | /plan | Chat with the AI to build a trip | Yes |

---

## 3. Trip Management

Base route:

```
/api/trips
```

| Method | Endpoint | Description | Auth Required |
|------|------|------|------|
| POST | / | Save a generated trip to database | Yes |
| GET | / | Get all trips for logged-in user | Yes |
| PUT | /:id | Update trip details | Yes |
| DELETE | /:id | Delete a specific trip | Yes |
| POST | /:id/regenerate-day | Use AI to rewrite one specific day | Yes |

---

# 🧪 Testing with Postman

All protected routes require the following header:

```
Authorization: Bearer <your_jwt_token>
```

Example:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

# 🛡️ Error Handling

The API uses a **global error handler**.

Errors are returned in the following format:

```json
{
  "message": "Error message here",
  "stack": "Stack trace (Development mode only)"
}
```

In **production mode**, the stack trace is hidden for security.

---

# ⚙️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Google Gemini AI

---

# 📄 License

This project is licensed under the **MIT License**.