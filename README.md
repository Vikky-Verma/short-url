# SHRTNR — URL Shortener

A full-stack URL shortener with user authentication, click analytics, and an admin dashboard.

🔗 **Live Demo:** [short-url-alpha-sage.vercel.app](https://short-url-alpha-sage.vercel.app)  
⚙️ **Backend API:** [short-url-by2x.onrender.com](https://short-url-by2x.onrender.com)

---

## Features

- 🔐 User signup and login with JWT authentication
- ✂️ Shorten any long URL instantly
- 📊 Click analytics with full click history per link
- 🗑️ Delete your own shortened URLs
- 👑 Admin dashboard — view all users' links and stats
- 🔒 Protected routes — only logged-in users can create links

---

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios
- Tailwind CSS
- Vite

### Backend
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT (JSON Web Tokens)
- bcrypt (password hashing)
- nanoid (short ID generation)

---

## Project Structure

```
short-url/
├── backend/
│   ├── controllers/
│   │   ├── url.js
│   │   └── user.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── models/
│   │   ├── url.js
│   │   └── user.js
│   ├── routes/
│   │   ├── url.js
│   │   ├── user.js
│   │   └── staticRouter.js
│   ├── service/
│   │   └── auth.js
│   ├── connect.js
│   └── index.js
└── frontend/
    └── src/
        ├── components/
        │   ├── CreateUrlForm.jsx
        │   ├── Navbar.jsx
        │   └── UrlCard.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── Analytics.jsx
        │   ├── Dashboard.jsx
        │   ├── Login.jsx
        │   └── Signup.jsx
        └── App.jsx
```

---

## Getting Started Locally

### 1. Clone the repo

```bash
git clone https://github.com/Vikky-Verma/short-url.git
cd short-url
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```
PORT=8001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key
```

Start the backend:

```bash
npm start
```

Backend runs at **http://localhost:8001**

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```
VITE_API_URL=http://localhost:8001
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## Deployment

### Backend — Render

1. Push code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set **Root Directory** to `backend`
4. Set **Start Command** to `npm start`
5. Add environment variables in Render dashboard:

| Key | Value |
|-----|-------|
| `MONGO_URI` | your MongoDB Atlas connection string |
| `JWT_SECRET` | your strong secret key |

### Frontend — Vercel

1. Import the repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add environment variable in Vercel dashboard:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://short-url-by2x.onrender.com` |

4. Deploy

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/user` | Register new user | No |
| POST | `/user/login` | Login | No |
| POST | `/url` | Create short URL | Yes |
| GET | `/url` | Get your URLs | Yes |
| GET | `/url/analytics/:shortId` | Get click analytics | Yes |
| DELETE | `/url/:shortId` | Delete a URL | Yes |
| GET | `/url/admin/all` | Get all users' URLs | Admin only |
| GET | `/url/admin/stats` | Get per-user stats | Admin only |
| GET | `/:shortId` | Redirect to original URL | No |

---

## Environment Variables

### Backend `.env`

```
PORT=8001
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/short-url
JWT_SECRET=your_secret_key
```

### Frontend `.env`

```
VITE_API_URL=http://localhost:8001
```

> For production, set `VITE_API_URL=https://short-url-by2x.onrender.com` in Vercel environment variables.

---

## Author

**Vikky Verma** — [github.com/Vikky-Verma](https://github.com/Vikky-Verma)
