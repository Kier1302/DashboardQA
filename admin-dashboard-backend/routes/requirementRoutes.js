// routes/requirementRoutes.js
const express = require('express');
const Requirement = require('../models/Requirement');
const router = express.Router();

// GET route to fetch all requirements
router.get('/', async (req, res) => {
  try {
    const requirements = await Requirement.find({});
    return res.status(200).json(requirements);
  } catch (error) {
    console.error("Error fetching requirements:", error);
    return res.status(500).json({ message: 'Failed to fetch requirements' });
  }
});

// POST route to save multiple requirements
router.post('/', async (req, res) => {
  try {
    const { requirements } = req.body;

    // Validate if all requirements have a valid name
    if (!requirements || !Array.isArray(requirements)) {
      return res.status(400).json({ message: 'Requirements must be an array.' });
    }

    const savedRequirements = [];
    for (let req of requirements) {
      if (!req.name.trim()) {
        return res.status(400).json({ message: 'Requirement name cannot be empty.' });
      }
      const newRequirement = new Requirement({ 
        name: req.name,
        description: req.description || "",
        type: req.type || "file"
      });
      const saved = await newRequirement.save();
      savedRequirements.push(saved);
    }

    return res.status(200).json({ message: 'Requirements saved successfully!', data: savedRequirements });
  } catch (error) {
    console.error("Error saving requirements:", error);
    return res.status(500).json({ message: 'Failed to save requirements' });
  }
});

module.exports = router;
