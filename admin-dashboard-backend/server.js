require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const fileRoutes = require("./routes/files"); // Added File Management Routes
const requirementRoutes = require('./routes/requirementRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/files", require("./routes/files"));
app.use('/api/requirements', requirementRoutes); // Add this line

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Stop server if DB connection fails
  });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
