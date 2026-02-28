# Testing AI Learn

## 1. Fix MongoDB Atlas auth (if you see "bad auth")

The server could not log in to Atlas. In [MongoDB Atlas](https://cloud.mongodb.com):

- Go to **Database Access** → select user **snns** (or create one).
- Click **Edit** → **Edit Password**.
- Set the password to match `server/.env` (e.g. `snnssnns`) or copy the new password into `MONGO_URI` in `server/.env`.
- Save.

## 2. Start the server

```powershell
cd "C:\Users\Lee tak hei\OneDrive - HKUST Connect\hackathon trial\ai-learn\server"
node index.js
```

You should see:
- `MongoDB connected: ...`
- `Server running on port 5000`

## 3. Test the API (optional)

In a **new** terminal (server must be running):

```powershell
cd "C:\Users\Lee tak hei\OneDrive - HKUST Connect\hackathon trial\ai-learn"
node server/test-auth.js
```

This checks: health → register → login → get me.

## 4. Start the client

In another terminal:

```powershell
cd "C:\Users\Lee tak hei\OneDrive - HKUST Connect\hackathon trial\ai-learn\client"
npm run dev
```

Open the URL shown (e.g. http://localhost:5173).

## 5. Test in the browser

1. **Register** – Create account (name, email, password).
2. **Dashboard** – You should land there after register.
3. **Log out** → **Sign in** – Use the same email/password.
4. **Submit a topic** – Use the form on the dashboard (will 404 until you add a `/api/topics` backend).

## Files covered by these tests

- **Server:** `index.js`, `config/db.js`, `models/User.js`, `controllers/authController.js`, `routes/authRoutes.js`, `middleware/authMiddleware.js`
- **Client:** `api.js`, `context/AuthContext.jsx`, `pages/Login.jsx`, `pages/Register.jsx`, `pages/Dashboard.jsx`, `components/Header.jsx`, `components/ProtectedRoute.jsx`, `components/TopicSubmit.jsx`, `App.jsx`
