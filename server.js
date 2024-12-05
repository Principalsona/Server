const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // For environment variables

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Blog Schema and Model

// Project Schema and Model with createdAt field
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  author: String,
  imgSrc: String,
  createdAt: { type: Date, default: Date.now }, // Add createdAt field
});

const Project = mongoose.model("Projects", projectSchema);

// Routes

// POST route to add a new project
app.post("/projects", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ message: "Project added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save project data" });
  }
});

// GET route to fetch all projects, sorted by createdAt (newest first)
app.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }); // Sort by createdAt descending
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});
  
const PORT = process.env.PORT || 5545;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
