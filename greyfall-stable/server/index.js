import { app, connectDB } from "./app.js";

console.log("ENV CHECK:", {
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  ADMIN_PASSWORD_SET: Boolean(process.env.ADMIN_PASSWORD),
  JWT_SECRET_SET: Boolean(process.env.JWT_SECRET),
  PORT: process.env.PORT,
  MONGODB_URI_SET: Boolean(process.env.MONGODB_URI),
});

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" MongoDB connect failed:", err.message);
    process.exit(1);
  });