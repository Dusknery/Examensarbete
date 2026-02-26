import { app, connectDB } from "./app.js";

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connect failed:", err.message);
    process.exit(1);
  });