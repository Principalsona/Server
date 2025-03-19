const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config(); // For environment variables

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection (use your actual MongoDB URI here)
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/projectsDB";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Project Schema and Model with type and createdAt fields
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  imgSrc: { type: String, required: true },
  type: { type: String, required: true },
  committeeDetails: { type: String }, // Only used for type4
  createdAt: { type: Date, default: Date.now }, // Add createdAt field
});

const Project = mongoose.model("Project", projectSchema);

// Routes

// POST route to handle the form submission and add a new project
app.post("/projects", async (req, res) => {
  try {
    const { title, description, author, imgSrc, type, committeeDetails } = req.body;

    // Create a new project instance
    const newProject = new Project({
      title,
      description,
      author,
      imgSrc,
      type,
      committeeDetails, // This will be undefined if not provided (e.g., for non-type4)
    });

    // Save the project to the database
    await newProject.save();

    // Send success response
    res.status(201).json({ message: "Project added successfully!" });
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({ message: "Failed to submit the form. Please try again." });
  }
});

// GET route to fetch all projects, sorted by createdAt (newest first)
app.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

// GET route to fetch projects by type
app.get("/projects/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const projects = await Project.find({ type }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch projects by type" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
