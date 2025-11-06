# Quick Start Guide

## How to Run the App

You need **TWO terminal windows** - one for backend, one for frontend.

---

## Terminal 1: Backend

```bash
cd backend
npm install
npm start
```

**Important**: Make sure you have a `.env` file in the `backend` folder with:
```env
MONGO_URI=your_mongodb_uri
PORT=4000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_google_redirect_uri
```

You should see: `Server running on port 4000`

---

## Terminal 2: Frontend

```bash
cd frontend
npm install
npm start
```

Then choose:
- Press `i` for iOS simulator
- Press `a` for Android emulator  
- Press `w` for web browser

---

## That's it!

Your app should now be running and connected to the backend!


