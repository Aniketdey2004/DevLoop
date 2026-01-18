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
    `data:image/jpeg;base64,${base64Image}`
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
    cipher.final()
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
    decipher.final()
  ]);

  return decrypted.toString("utf8");
};
