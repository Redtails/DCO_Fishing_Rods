// index.js

const express    = require("express");
const cors       = require("cors");
const path       = require("path");
const authRoutes = require("./routes/auth");
const formRoutes = require("./routes/forms");
const inspectionReportRouter = require("./routes/inspection-report");

const app  = express();
const PORT = process.env.PORT || 3000;

// 1) Enable CORS & JSON parsing
app.use(cors());
app.use(express.json());

// 2) Serve static front-end files from rod-management/
app.use(express.static(path.join(__dirname, "rod-management")));

// 3) Mount API routes under /api
app.use("/api", authRoutes);
app.use("/api", formRoutes);
app.use("/api/inspection-report", inspectionReportRouter);

// 4) Optional HTML routes (login/dashboard)
app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "rod-management", "login.html"));
});
app.get("/dashboard", (req, res) => {
res.sendFile(path.join(__dirname, "rod-management", "dashboard.html"));
});

// 5) Start listening
app.listen(PORT, () => {
console.log(✅ DCO API is running on http://localhost:${PORT});
});


