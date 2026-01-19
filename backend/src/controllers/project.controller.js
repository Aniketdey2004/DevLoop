import Post from "../models/Post.js";
import Project from "../models/Project.js";

export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ collaborators: req.user._id });
    res.status(200).json(projects);
  } catch (error) {
    console.log("Error in getMyProjects controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      techStack,
      githubRepo,
      liveUrl,
      status,
      requireCollaborators,
    } = req.body;
    if (
      !title?.trim() ||
      !description?.trim() ||
      (status !== "active" && status !== "completed") ||
      requireCollaborators === undefined ||
      !githubRepo?.trim() ||
      !Array.isArray(techStack)
    ) {
      return res.status(400).json({
        message: "All field of project are required and should be valid",
      });
    }
    if (requireCollaborators === true && status === "completed") {
      return res.status(400).json({
        message: "You cannot invite collaborators for a completed project",
      });
    }

    const newProject = new Project({
      title,
      description,
      ownerId: req.user._id,
      techStack,
      githubRepo,
      liveUrl: liveUrl?.trim() || "",
      status,
      requireCollaborators,
      collaborators: [req.user._id],
    });

    const createdProject = await newProject.save();
    req.user.projects.push(createdProject._id);
    await req.user.save();

    if (requireCollaborators === true) {
      const newPost = new Post({
        author: req.user._id,
        content: "Looking for collaborators to build this project 🚀",
        type: "collab",
        project: newProject._id,
      });
      await newPost.save();
    }
    res.status(201).json({ message: "Project created" });
  } catch (error) {
    console.log("Error in createProject controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editProject = async (req, res) => {
  const projectId = req.params.id;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ messsage: "Project does not exist" });
    }
    if (project.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    const {
      title,
      description,
      techStack,
      githubRepo,
      liveUrl,
      status,
      requireCollaborators,
    } = req.body;
    if (
      !title?.trim() ||
      !description?.trim() ||
      (status !== "active" && status !== "completed") ||
      requireCollaborators === undefined ||
      !githubRepo?.trim() ||
      !Array.isArray(techStack)
    ) {
      return res.status(400).json({
        message: "All field of project are required and should be valid",
      });
    }
    if (requireCollaborators === true && status === "completed") {
      return res.status(400).json({
        message: "You cannot invite collaborators for a completed project",
      });
    }

    const updatedProject = {
      title,
      description,
      techStack,
      githubRepo,
      liveUrl: liveUrl?.trim() || "",
      status,
      requireCollaborators,
    };

    await Project.findByIdAndUpdate(
      projectId,
      { $set:  updatedProject  },
    );
    res.status(200).json({ message: "Project successfully updated" });
  } catch (error) {
    console.log("Error in editProject Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProject = async (req, res) => {
  const projectId = req.params.id;
  try {
    const project = await Project.findById(projectId).populate(
      "collaborators",
      "name username profilePic headline",
    );
    if (!project) {
      return res.status(404).json({ message: "No such project exists" });
    }
    res.status(200).json(project);
  } catch (error) {
    console.log("Error in getProject controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
