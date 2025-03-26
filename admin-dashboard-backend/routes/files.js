const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const File = require("../models/File");

const router = express.Router();

// 🔹 Ensure "uploads" directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🔹 Multer Setup for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// 🔹 Upload File or Link
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { name, type, url } = req.body;

    // ✅ Validate required fields
    if (!name || !type) {
      return res.status(400).json({ message: "⚠️ Name and Type are required" });
    }

    let fileData = { name, type, url, status: "pending" }; // Default status

    if (type === "file") {
      if (!req.file) {
        return res.status(400).json({ message: "⚠️ File is missing" });
      }
      fileData.url = `/uploads/${req.file.filename}`;
    }

    // ✅ Avoid duplicate uploads
    const existingFile = await File.findOne({ name, url });
    if (existingFile) {
      return res.status(400).json({ message: "⚠️ File already exists" });
    }

    const newFile = new File(fileData);
    await newFile.save();

    console.log("✅ File Uploaded:", newFile);
    res.status(201).json({ message: "✅ File uploaded successfully", file: newFile });
  } catch (error) {
    console.error("❌ Upload Error:", error.message);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
});

// 🔹 Get All Uploaded Files
router.get("/", async (req, res) => {
  try {
    const files = await File.find();
    console.log("📂 Files Retrieved:", files);
    res.status(200).json(files);
  } catch (error) {
    console.error("❌ Fetch Files Error:", error.message);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
});

// 🔹 Approve or Reject File
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "⚠️ Invalid status" });
    }

    const file = await File.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!file) return res.status(404).json({ message: "⚠️ File not found" });

    console.log(`✅ File ${status}:`, file);
    res.status(200).json({ message: `✅ File ${status}`, file });
  } catch (error) {
    console.error("❌ Update Status Error:", error.message);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // Find the file in the database
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "⚠️ File not found" });

    // Construct the file path based on the stored URL
    const filePath = path.join(__dirname, "../uploads", file.url.split("/uploads/")[1]);
    console.log("🔹 Deleting file at path:", filePath);

    // Check if the file exists before trying to delete it
    if (fs.existsSync(filePath)) {
      console.log("✅ File exists, deleting...");
      fs.unlinkSync(filePath); // Proceed with deletion
    } else {
      console.error("❌ File not found at path:", filePath);
      return res.status(404).json({ message: "⚠️ File not found on the server" });
    }

    // Delete the file record from the database
    await File.findByIdAndDelete(req.params.id);

    console.log("🗑 File Deleted:", file);
    res.status(200).json({ message: "✅ File deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Error:", error.message);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
});


module.exports = router;
