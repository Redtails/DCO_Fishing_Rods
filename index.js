// index.js  (in your API project root)
const express    = require("express");
const cors       = require("cors");
const path       = require("path");
const authRoutes = require("./routes/auth");   // your /api/login route
const formRoutes = require("./routes/forms");  // your various /api/... routes
const app        = express();
const PORT       = process.env.PORT || 3000;

// ─── CORS MIDDLEWARE ───────────────────────────────────────────────────────────
// We want to allow calls from the exact domain where your HTML is hosted:
// (e.g. https://dco-fishing-rods.onrender.com).  If you ever need to test
// locally, you can also add "http://localhost:3000" in the array below.
app.use(cors({
  origin: [
    "https://dco-fishing-rods.onrender.com", 
    // "http://localhost:3000"      // ← uncomment if you ever test from local HTTP
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// If you want to be extra‐sure OPTIONS requests are handled automatically:
app.options("*", cors({
  origin: [
    "https://dco-fishing-rods.onrender.com",
    // "http://localhost:3000"
  ]
}));

// ─── JSON PARSER ────────────────────────────────────────────────────────────────
app.use(express.json());

// ─── SERVE STATIC FILES ─────────────────────────────────────────────────────────
// (Only needed if you also host your HTML/CSS/JS from the same project.)
// If your front‐end is purely hosted on a different Render service, you can remove this:
app.use(express.static(path.join(__dirname, "rod-management")));

// ─── API ROUTES ─────────────────────────────────────────────────────────────────
// Always mount login/auth first, then all form routes:
app.use("/api", authRoutes);
app.use("/api", formRoutes);

// ─── ROUTE FOR DASHBOARD (if you serve your HTML from this same repo) ────────────
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "rod-management", "login.html"));
});
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "rod-management", "dashboard.html"));
});

// ─── START SERVER ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ DCO API is running on http://localhost:${PORT}`);
});
