import "dotenv/config";

export const ENV={
    PORT:process.env.PORT,
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    NODE_ENV:process.env.NODE_ENV,
    MAILTRAP_TOKEN:process.env.MAILTRAP_TOKEN,
    EMAIL_FROM:process.env.EMAIL_FROM,
    EMAIL_NAME:process.env.EMAIL_NAME,
    CLIENT_URL:process.env.CLIENT_URL
};