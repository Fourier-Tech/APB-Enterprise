import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { parse } from "pg-connection-string";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

if (typeof window === "undefined") {
  // We are on server side (Next.js Node environment)
  const connectionString = process.env.DATABASE_URL;
  const config = parse(connectionString || "");
  const pool = new Pool(config as any);
  const adapter = new PrismaPg(pool);

  prismaInstance =
    globalForPrisma.prisma ??
    new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
  }
} else {
  // Client side fallback (should not be called, but prevents compile crashes)
  prismaInstance = new PrismaClient();
}

export const prisma = prismaInstance;
export default prisma;
