// ──────────────────────────────────────────────────────────────────────────────
// index.js  (place this in the root of your API repository)
// ──────────────────────────────────────────────────────────────────────────────

// 1) Import all the pieces we need. Think of these like “ingredients” for our server recipe.
const express    = require("express");  // Express is a library that helps us create a web server easily.
const cors       = require("cors");     // CORS middleware helps browsers talk to our server from another domain.
const path       = require("path");     // Path helps build file paths that work on any operating system.
const authRoutes = require("./routes/auth");   // This file handles “/api/login” (our login endpoint).
const formRoutes = require("./routes/forms");  // This file handles all other “/api/…” form submissions.

const app  = express();                 // Create an “express” application—this is our server instance.
const PORT = process.env.PORT || 3000;  // Use the environment’s PORT (if provided), otherwise default to 3000.



// ─── 2) CORS (Cross-Origin Resource Sharing) SETUP ─────────────────────────────
// ELI5: “My front-end lives at a different address than my back-end. Browsers block 
// cross-site calls by default. CORS middleware tells the browser: “It’s OK to let my 
// front-end (https://dco-fishing-rods.onrender.com) talk to this back-end.”  

// 2a) Simple “wide-open” approach: let any website talk to this API.
// Just drop this line in, and every request gets a header: Access-Control-Allow-Origin: *
// That means “no restrictions.” Use this first to prove CORS is working. Later, lock it down.
app.use(cors());
app.use(express.json());  
//  ^ “express.json” means “whenever someone sends me JSON, please parse it automatically.”

/*
────────────────────────────── OPTIONAL: Lock CORS to one origin ──────────────────────────────

Once you confirm “wide-open” CORS works (front-end CAN POST to back-end without errors), 
replace the two lines above (app.use(cors()) and app.use(express.json())) with the code block below.
That block will say “only let requests from exactly https://dco-fishing-rods.onrender.com pass.”

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "https://dco-fishing-rods.onrender.com");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   // If the browser asks “OPTIONS” first (preflight), we answer immediately “200 OK”
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });
// app.use(express.json());
*/


// ─── 3) SERVE STATIC FILES (ONLY IF YOU HOST FRONT-END HERE) ──────────────────────
// ELI5: If you want this same server to also send the HTML/CSS/JS for your front-end, 
// you put your front-end files in a folder called “rod-management” and let Express serve them.
// If you host your front-end somewhere else (like a separate Netlify or Render site), 
// you can skip or remove this section entirely.

// Tell Express: “If someone asks for any file that exists inside `rod-management/`, 
// go find it there and give it to them.” This covers *.html, *.css, *.js, images, etc.
app.use(express.static(path.join(__dirname, "rod-management")));

// ─── 4) MOUNT API ROUTES UNDER “/api” ─────────────────────────────────────────────
// ELI5: We want our URLs to look like “https://dco-api.onrender.com/api/…”. So:
//   - Any request that starts with “/api/login” is forwarded into authRoutes
//   - Any request that starts with “/api/defect-entry” (or other form endpoints) goes into formRoutes

app.use("/api", authRoutes);   // “/api/login” will be handled inside ./routes/auth.js
app.use("/api", formRoutes);   // “/api/defect-entry”, “/api/inventory-update”, etc., inside ./routes/forms.js



// ─── 5) PAGE ROUTING (ONLY IF FRONT-END HTML IS HERE) ─────────────────────────────
// ELI5: If you navigate in your browser to “/” (root), send “rod-management/login.html”.
// If you navigate to “/dashboard”, send “rod-management/dashboard.html”.
// If your HTML is hosted somewhere else, remove these two routes.
//
// Example: Someone browses to “https://dco-api.onrender.com/” → we show them the login page.

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "rod-management", "login.html"));
});
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "rod-management", "dashboard.html"));
});



// ─── 6) START THE SERVER ──────────────────────────────────────────────────────────
// ELI5: “Hey computer, start listening on the port (e.g. 3000). Whenever a request comes 
// in, wake up my Express app and let it handle it.”  
app.listen(PORT, () => {
  console.log(`✅ DCO API is running on http://localhost:${PORT}`);
});

