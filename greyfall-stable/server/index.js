import multer from "multer";
import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import crypto from "crypto";

dotenv.config({
  path: new URL("./.env", import.meta.url),
});

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Gör uploads-mappen publik så bilder kan visas i webben
app.use("/uploads", express.static("uploads"));

/* ================================
   DEBUG – visar om .env laddas
================================ */
console.log("ENV CHECK:", {
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  ADMIN_PASSWORD_SET: Boolean(process.env.ADMIN_PASSWORD),
  JWT_SECRET_SET: Boolean(process.env.JWT_SECRET),
  PORT: process.env.PORT,
});

/* ================================
   IN-MEMORY DATA
================================ */
let news = [
  {
    id: "n1",
    title: "Välkommen till Greyfall Stable",
    body: "Här kommer nyheter visas.",
    imageUrl: "",
    linkUrl: "",
    date: new Date().toISOString(),
  },
];

let horses = [];

/* ================================
   AUTH MIDDLEWARE
================================ */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

/* ================================
   ROOT
================================ */
app.get("/", (req, res) => {
  res.send("Greyfall Stable API is running");
});

/* ================================
   AUTH
================================ */
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body || {};

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    return res.json({ token });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

/* ================================
   NEWS – PUBLIC (GET)
================================ */
app.get("/api/news", (req, res) => {
  res.json(news.sort((a, b) => (a.date < b.date ? 1 : -1)));
});

/* ================================
   NEWS – ADMIN (POST/DELETE)
================================ */
app.post("/api/news", authMiddleware, (req, res) => {
  const { title, body, imageUrl, linkUrl } = req.body || {};
  if (!title || !body) return res.status(400).json({ error: "Missing fields" });

  const item = {
    id: crypto.randomUUID(),
    title,
    body,
    imageUrl: imageUrl || "",
    linkUrl: linkUrl || "",
    date: new Date().toISOString(),
  };

  news.push(item);
  res.status(201).json(item);
});

app.delete("/api/news/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const before = news.length;
  news = news.filter((n) => n.id !== id);
  if (news.length === before) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
});

/* ================================
   UPLOAD – ADMIN
================================ */
// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safe = `${crypto.randomUUID()}${ext}`;
    cb(null, safe);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

app.post("/api/upload", authMiddleware, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const PORT = process.env.PORT || 4000;
  const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.status(201).json({ imageUrl });
});

/* ================================
   HORSES – PUBLIC
================================ */
app.get("/api/horses", (req, res) => {
  res.json(horses);
});

/* ================================
   HORSES – ADMIN
================================ */
app.post("/api/horses", authMiddleware, (req, res) => {
  const horse = req.body;

  if (!horse?.id || !horse?.name) {
    return res.status(400).json({ error: "id + name required" });
  }

  if (horses.some((h) => h.id === horse.id)) {
    return res.status(409).json({ error: "id already exists" });
  }

  horses.push(horse);
  res.status(201).json(horse);
});

app.put("/api/horses/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const i = horses.findIndex((h) => h.id === id);

  if (i === -1) return res.status(404).json({ error: "Not found" });

  horses[i] = { ...horses[i], ...req.body, id }; // lås id
  res.json(horses[i]);
});

app.delete("/api/horses/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const before = horses.length;

  horses = horses.filter((h) => h.id !== id);

  if (horses.length === before) return res.status(404).json({ error: "Not found" });

  res.status(204).send();
});

/* ================================
   START SERVER
================================ */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});