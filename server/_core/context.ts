import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { verifyAdminToken } from "./adminAuth";
import { COOKIE_NAME } from "@shared/const";
import { parse } from "cookie";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};


export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // 1. Check for your custom Admin Cookie FIRST
    const cookies = parse(opts.req.headers.cookie || "");
    const token = cookies[COOKIE_NAME];
    
    if (token) {
      const payload = await verifyAdminToken(token);
      if (payload && payload.openId && payload.role) {
        // Build a user object directly from the token
        user = {
          id: 0,
          openId: payload.openId,
          name: payload.openId,
          email: null,
          loginMethod: "local",
          role: payload.role as "admin" | "user",
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        };
      }
    }

    // 2. If no admin user found, try the Manus SDK
    if (!user) {
      user = await sdk.authenticateRequest(opts.req);
    }
  } catch (error) {
    // Silently fail and return null user
    user = null;
  }

  return { req: opts.req, res: opts.res, user };
}


// export async function createContext(
//   opts: CreateExpressContextOptions
// ): Promise<TrpcContext> {
//   let user: User | null = null;

//   try {
//     user = await sdk.authenticateRequest(opts.req);
//   } catch {
//     try {
//       const cookies = parse(opts.req.headers.cookie || "");
//       const token = cookies[COOKIE_NAME];
//       if (token) {
//         const payload = await verifyAdminToken(token);
//         if (payload) {
//           // Build a user object directly from the token — no DB lookup needed
//           user = {
//             id: 0,
//             openId: payload.openId,
//             name: payload.openId,
//             email: null,
//             loginMethod: "local",
//             role: payload.role as "admin" | "user",
//             createdAt: new Date(),
//             updatedAt: new Date(),
//             lastSignedIn: new Date(),
//           };
//         }
//       }
//     } catch {
//       user = null;
//     }
//   }

//   return { req: opts.req, res: opts.res, user };
// }