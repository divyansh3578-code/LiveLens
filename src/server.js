require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

const connectDB = require("./config/db");

// Keep your existing app import and PORT variable.

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`LiveLens AI running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});