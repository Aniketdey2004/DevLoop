import "dotenv/config";

export const ENV={
    PORT:process.env.PORT,
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    NODE_ENV:process.env.NODE_ENV,
    MAILTRAP_TOKEN:process.env.MAILTRAP_TOKEN,
    EMAIL_FROM:process.env.EMAIL_FROM,
    EMAIL_NAME:process.env.EMAIL_NAME,
    CLIENT_URL:process.env.CLIENT_URL,
    CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID
};