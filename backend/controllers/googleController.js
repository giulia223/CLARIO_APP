import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

const assertGoogleEnv = () => {
  const required = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  };
  const missing = Object.entries(required)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    throw new Error(`Missing Google OAuth env vars: ${missing.join(', ')}`);
  }
};

export const getAuthUrl = (req, res) => {
  try {
    assertGoogleEnv();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }

  const scopes = ["https://www.googleapis.com/auth/calendar.events"];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [ "https://www.googleapis.com/auth/calendar.events" ],
  });
//  console.log(" CLIENT CONFIG:");
// console.log("ID:", process.env.GOOGLE_CLIENT_ID);
// console.log("SECRET:", process.env.GOOGLE_CLIENT_SECRET);
// console.log("REDIRECT:", process.env.GOOGLE_REDIRECT_URI);
  // If called from a browser, redirect; otherwise return JSON
  const wantsHtml = req.accepts && req.accepts(["html", "json"]) === "html";
  if (wantsHtml || req.query.redirect === "1") {
    return res.redirect(authUrl);
  }
  res.json({ url: authUrl });
};

export const googleCallback = async (req, res) => {
    const code = req.query.code;
    if (!code) {
      console.error("Google OAuth callback missing code. Query:", req.query);
      return res.status(400).json({ error: "Missing authorization code in callback" });
    }
    try{
      assertGoogleEnv();
      const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    
    console.log(" Google tokens:", tokens);

    res.json({ message: "Autentificare Google reușită", tokens });
  } catch (err) {
    console.error("Eroare la autentificare Google:", err);
    res.status(500).json({ error: "Autentificare eșuată" });
  }
  
}; 


export const addEventToGoogleCalendar = async (req, res) => {
  const { token, summary, start, end } = req.body;

  try {
    oauth2Client.setCredentials({ access_token: token });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      summary,
      start: { dateTime: start },
      end: { dateTime: end },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    res.json({
      message: "Eveniment adăugat în Google Calendar!",
      eventLink: response.data.htmlLink,
    });
  } catch (error) {
    console.error("Eroare Calendar:", error);
    res.status(500).json({ error: "Nu s-a putut adăuga evenimentul" });
  }
};

export const startAuthRedirect = (req, res) => {
  try {
    assertGoogleEnv();
  } catch (e) {
    return res.status(500).send(e.message);
  }
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [ "https://www.googleapis.com/auth/calendar.events" ],
  });
  return res.redirect(authUrl);
};
