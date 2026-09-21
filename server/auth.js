import "./env.js";
import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { getDb } from "./db/index.js";
import * as schema from "./db/schema.js";
export const adminEmail = () =>
  (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
export function createAuth({ bootstrap = false } = {}) {
  if (
    !process.env.BETTER_AUTH_SECRET ||
    !process.env.BETTER_AUTH_URL ||
    !adminEmail()
  )
    throw new Error("Auth environment is incomplete");
  return betterAuth({
    appName: "CLYRDEV Studio",
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(getDb(), { provider: "pg", schema }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: !bootstrap,
      minPasswordLength: 12,
    },
    trustedOrigins: [new URL(process.env.BETTER_AUTH_URL).origin],
    session: { expiresIn: 60 * 60 * 24, updateAge: 60 * 60 },
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 60,
      customRules: { "/sign-in/email": { window: 60, max: 5 } },
    },
    databaseHooks: {
      user: {
        create: {
          before: async (u) => {
            if (u.email.toLowerCase() !== adminEmail())
              throw new Error("Admin only");
            return { data: u };
          },
        },
      },
    },
  });
}
let auth;
export const getAuth = () => (auth ||= createAuth());
