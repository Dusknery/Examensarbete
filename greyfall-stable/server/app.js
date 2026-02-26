// ...existing code...
// ...existing code...
const isTest = process.env.NODE_ENV === "test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import multer from "multer";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

export const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

/* uploads */
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

/* ================================
   HELPERS (ID GENERATION)
================================ */
function slugify(str = "") {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function generateUniqueHorseId(name) {
  const base = slugify(name) || "horse";

  // försök 50 gånger med random suffix (extremt låg risk för krock)
  for (let i = 0; i < 50; i++) {
    const suffix = crypto.randomBytes(3).toString("hex"); // 6 tecken
    const candidate = `${base}-${suffix}`;
    const exists = await Horse.findOne({ id: candidate }).lean();
    if (!exists) return candidate;
  }

  // fallback
  return `${base}-${crypto.randomUUID()}`;
}

/* ================================
   MODELS
================================ */
const NewsSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    linkUrl: { type: String, default: "" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const HorseSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },

    nickname: String,
    breed: String,
    year: String,
    ageText: String,
    sex: String,
    color: String,
    isStud: { type: Boolean, default: false },

    pedigree: {
      e: String, // far namn
      eId: String, // far id (matchar horse.id)
      u: String, // mor namn
      uId: String, // mor id
      ue: String, // morfar namn
    },

    focus: [String],
    levels: { type: mongoose.Schema.Types.Mixed, default: {} },

    other: {
      mkh: String,
      country: String,
    },

    genetics: String,
    description: String,

    imageUrl: String,
    images: {
      headshot: String,
      bodyshot: String,
      pedigree: String,
    },
  },
  { timestamps: true }
);

export const News = mongoose.model("News", NewsSchema);
export const Horse = mongoose.model("Horse", HorseSchema);

/* ================================
   AUTH
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

app.get("/", (_req, res) => res.send("Greyfall Stable API is running"));

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
   HORSES – PUBLIC
================================ */
app.get("/api/horses", async (_req, res) => {
  try {
    const horses = await Horse.find().sort({ createdAt: -1 });
    res.json(horses);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not fetch horses" });
  }
});

app.get("/api/horses/:id", async (req, res) => {
  try {
    const horse = await Horse.findOne({ id: req.params.id });
    if (!horse) return res.status(404).json({ error: "Not found" });
    res.json(horse);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not fetch horse" });
  }
});

/* ================================
   HORSES – ADMIN
================================ */
app.post("/api/horses", authMiddleware, async (req, res) => {
  try {
    const horse = req.body;

    if (!horse?.name || typeof horse.name !== "string") {
      return res.status(400).json({ error: "name required" });
    }

    // om id saknas -> generera automatiskt
    if (!horse.id) {
      horse.id = await generateUniqueHorseId(horse.name);
    }

    if (typeof horse.id !== "string") {
      return res.status(400).json({ error: "id must be string" });
    }

    const exists = await Horse.findOne({ id: horse.id });
    if (exists) return res.status(409).json({ error: "id already exists" });

    const created = await Horse.create(horse);
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not create horse" });
  }
});

// UPDATE (PATCH) horse (admin)
app.patch("/api/horses/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Horse.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not update horse" });
  }
});

// DELETE horse (admin)
app.delete("/api/horses/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Horse.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not delete horse" });
  }
});

// Generera id för alla hästar som saknar id (admin)
app.post("/api/horses/generate-ids", authMiddleware, async (_req, res) => {
  try {
    const horses = await Horse.find({
      $or: [{ id: { $exists: false } }, { id: "" }, { id: null }],
    });

    let updatedCount = 0;

    for (const h of horses) {
      const newId = await generateUniqueHorseId(h.name);
      h.id = newId;
      await h.save();
      updatedCount++;
    }

    res.json({ ok: true, updatedCount });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not generate ids" });
  }
});

/* ================================
   UPLOAD – ADMIN
================================ */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

app.post("/api/upload", authMiddleware, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const PORT = process.env.PORT || 4000;
  const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.status(201).json({ imageUrl });
});

/* ================================
   DB CONNECT (export)
================================ */
export async function connectDB(uri) {
  const connUri = uri || process.env.MONGODB_URI;
  if (!connUri) throw new Error("MONGODB_URI saknas");
  await mongoose.connect(connUri);
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
}

/* ================================
   NEWS – PUBLIC
================================ */
app.get("/api/news", async (_req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not fetch news" });
  }
});