// Environment variables validation
// This file ensures that all required environment variables are set at build time.

const checkEnv = () => {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error("❌ Missing required environment variable: DATABASE_URL");
  }

  return {
    DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV || "development",
  };
};

export const env = checkEnv();
