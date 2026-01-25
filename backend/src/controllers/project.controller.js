import {
  decrypt,
  parseGithubUrl,
  verifyDeveloperProject,
} from "../lib/utils.js";
import Post from "../models/Post.js";
import Project from "../models/Project.js";


export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({collaborators:req.user._id});
    res.status(200).json(projects);
  } catch (error) {
    console.log("Error in getMyProjects controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createProject = async (req, res) => {
  try {
    if (!req.user.github?.id) {
      return res
        .status(403)
        .json({ message: "Link your github account to create projects" });
    }
    const {
      title,
      description,
      type,
      techStack,
      githubRepo,
      liveUrl,
      rolesNeeded,
    } = req.body;
    if (
      !title?.trim() ||
      !description?.trim() ||
      (type !== "portfolio" && type !== "collaboration") ||
      !githubRepo?.trim() ||
      !Array.isArray(techStack) ||
      !Array.isArray(rolesNeeded)
    ) {
      return res.status(400).json({
        message: "All field of project are required and should be valid",
      });
    }

    if (type === "portfolio" && rolesNeeded.length > 0)
      return res
        .status(400)
        .json({ messsage: "You cannot have open roles for portfolio project" });

    let owner, repo;
    try {
      ({ owner, repo } = parseGithubUrl(githubRepo));
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    const existingProject = await Project.findOne({
      "githubRepo.repoOwner": owner,
      "githubRepo.repoName": repo,
    });

    if (existingProject) {
      return res.status(409).json({
        message: "A project already exists with this github repo ",
      });
    }

    const { success, reason, status } = await verifyDeveloperProject(
      decrypt(req.user.github.accessToken),
      owner,
      repo,
      type,
    );
    if (!success) {
      return res.status(status).json({ message: reason });
    }

    const newProject = new Project({
      title,
      description,
      ownerId: req.user._id,
      type,
      techStack,
      githubRepo: { repoUrl: githubRepo, repoOwner: owner, repoName: repo },
      liveUrl: liveUrl?.trim() || "",
      collaborators: [req.user._id],
      rolesNeeded,
    });

    await newProject.save();

    if (type === "collaboration") {
      const newPost = new Post({
        author: req.user._id,
        content: "Looking for collaborators to build this project 🚀",
        type: "collab",
        project: newProject._id,
      });
      await newPost.save();
    }
    res.status(201).json({ message: "Project created successfully" });
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

    const { title, description, techStack, githubRepo, liveUrl, rolesNeeded } =
      req.body;
    if (
      !title?.trim() ||
      !description?.trim() ||
      !githubRepo.repoUrl?.trim() ||
      !Array.isArray(techStack) ||
      !Array.isArray(rolesNeeded)
    ) {
      return res.status(400).json({
        message: "All field of project are required and should be valid",
      });
    }
    if (project.type === "portfolio" && rolesNeeded.length > 0)
      return res
        .status(400)
        .json({ messsage: "You cannot have open roles for portfolio project" });

    let owner, repo;
    if (project.githubRepo.repoUrl !== githubRepo.repoUrl) {
      try {
        ({ owner, repo } = parseGithubUrl(githubRepo.repoUrl));
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }

      const existingProject = await Project.findOne({
        "githubRepo.repoOwner": owner,
        "githubRepo.repoName": repo,
      });

      if (existingProject) {
        return res.status(409).json({
          message: "A project already exists with this github repo ",
        });
      }

      const { success, reason, status } = await verifyDeveloperProject(
        decrypt(req.user.github.accessToken),
        owner,
        repo,
        project.type,
      );
      if (!success) {
        return res.status(status).json({ message: reason });
      }
    }

    const updatedProject = {
      title,
      description,
      techStack,
      githubRepo:githubRepo.repoUrl===project.githubRepo.repoUrl?project.githubRepo:{repoUrl:githubRepo.repoUrl,repoOwner:owner,repoName:repo},
      liveUrl: liveUrl?.trim() || "",
      rolesNeeded,
    };

    await Project.findByIdAndUpdate(projectId, { $set: updatedProject });
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
      "username profilePic headline")
    .populate("ownerId","username profilePic");
    if (!project) {
      return res.status(404).json({ message: "No such project exists" });
    }
    res.status(200).json(project);
  } catch (error) {
    console.log("Error in getProject controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getUserProjects=async(req,res)=>{
  try {
    const userId=req.params.userId;
    const projects = await Project.find({collaborators:userId});
    res.status(200).json(projects);
  } catch (error) {
    console.log("Error in getUserProjects controller",error);
    res.status(500).json({message:"Internal Server Error"});
  }
}