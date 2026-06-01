const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const logger = require("./middleware/logger");
const { notFound, errorHandler } = require("./middleware/errorHandler");

dotenv.config();

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!mongoUri || !process.env.JWT_SECRET) {
  console.error("Missing required environment variables: MONGO_URI or MONGODB_URI and JWT_SECRET");
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.json({ message: "Fitness Challenge Tracker API is running" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "OK" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/challenges", require("./routes/challengeRoutes"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
