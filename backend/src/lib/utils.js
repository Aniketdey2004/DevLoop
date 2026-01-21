import jwt from "jsonwebtoken";
import { ENV } from "./env.js";
import axios from "axios";
import cloudinary from "./cloudinary.js";
import crypto from "crypto";

export const generateWebToken = (userId, res) => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT Secret is required");
  }

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("DevLooptoken", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: ENV.NODE_ENV === "development" ? false : true,
  });

  return token;
};

export const uploadImageToCloudinary = async (imageUrl) => {
  const response = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });

  const base64Image = Buffer.from(response.data).toString("base64");
  const result = await cloudinary.uploader.upload(
    `data:image/jpeg;base64,${base64Image}`,
  );
  return result.secure_url;
};

const ALGORITHM = "aes-256-cbc";
const KEY = Buffer.from(ENV.GITHUB_TOKEN_ENCRYPTION_KEY, "hex");

export const encrypt = (text) => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

export const decrypt = (hash) => {
  const [ivHex, encryptedHex] = hash.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};

export const parseGithubUrl = (repoUrl) => {
  if (repoUrl.startsWith("http")) {
    const { pathname } = new URL(repoUrl);
    const [owner, repo] = pathname.replace(/^\/|\.git$/g, "").split("/");
    return { owner, repo };
  }

  // SSH URLs: git@github.com:owner/repo.git
  if (repoUrl.startsWith("git@")) {
    const match = repoUrl.match(/github\.com:(.+?)\/(.+?)(\.git)?$/);
    if (!match) throw new Error("Invalid GitHub repo URL");
    return { owner: match[1], repo: match[2] };
  }

  throw new Error("Unsupported GitHub repo URL format");
};

export const inviteToRepo = async ({
  repoOwner,
  repoName,
  githubUsername,
  ownerAccessToken,
}) => {
  await axios.put(
    `https://api.github.com/repos/${repoOwner}/${repoName}/collaborators/${githubUsername}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${ownerAccessToken}`,
        Accept: "application/vnd.github+json",
      },
    },
  );
};

export const verifyDeveloperProject = async (token, owner, repo, type) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  };
  try {
    const userRes = await axios.get("https://api.github.com/user", config);
    const currentUsername = userRes.data.login;

    const repoRes = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      config,
    );
    const repoData = repoRes.data;

    if (type === "collaboration") {
      const isDirectOwner =
        currentUsername.toLowerCase() === owner.toLowerCase();
      const isAdmin = repoData.permissions && repoData.permissions.admin;

      if (isDirectOwner || isAdmin) {
        return { success: true };
      }
      return {
        success: false,
        reason: "User is not an Admin/Owner",
        status: 403,
      };
    }

    if (type === "portfolio") {
      if (currentUsername.toLowerCase() === owner.toLowerCase()) {
        return { success: true };
      }

      const commitRes = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/commits?author=${currentUsername}&per_page=1`,
        config,
      );

      if (commitRes.data.length > 0) {
        return { success: true };
      }
      return {
        success: false,
        reason: "No code contributions found",
        status: 403,
      };
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404 || error.response.status === 403) {
        return {
          success: false,
          reason: "Repository not found or Access denied",
          status: error.response.status,
        };
      }
      if (error.response.status === 401) {
        return {
          success: false,
          reason: "Invalid or expired Github Token",
          status: 401,
        };
      }
    }
    return {
      success: false,
      reason: "Network error or Github API is down",
      status: 500,
    };
  }
};
