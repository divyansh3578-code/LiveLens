const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "20kb" }));

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "LiveLens AI backend is running"
  });
});


const chatRoutes = require("./routes/chat.routes");

app.use("/api/chat", chatRoutes);

app.use((err, req, res, next) => {
  console.error("Backend error:", err);

  res.status(500).json({
    success: false,
    error: err.message || "Something went wrong"
  });
});
module.exports = app;