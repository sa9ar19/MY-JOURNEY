import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  destinations, Destination, InsertDestination,
  InsertUser, users,
  galleryPhotos, GalleryPhoto, InsertGalleryPhoto,
  blogPosts, BlogPost, InsertBlogPost,
  newsletterSignups, InsertNewsletterSignup,
  // socialLinks, SocialLink, InsertSocialLink,
} from "../drizzle/schema";
import { ENV } from './_core/env';



let _db: any = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        // Railway PostgreSQL often requires SSL in production
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      });
      _db = drizzle(pool);
      console.log("[Database] Connected to PostgreSQL successfully");
    } catch (error) {
      console.error("[Database] Failed to connect to PostgreSQL:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    
    // PostgreSQL uses onConflictDoUpdate instead of onDuplicateKeyUpdate
    await db.insert(users).values(values).onConflictDoUpdate({ 
      target: users.openId,
      set: updateSet 
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get user: database not available"); return undefined; }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ── Destinations ────────────────────────────────────────────────────────────

export async function listDestinations(): Promise<Destination[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(destinations).orderBy(destinations.createdAt);
}

export async function getDestinationById(id: number): Promise<Destination | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(destinations).where(eq(destinations.id, id)).limit(1);
  return result[0];
}

export async function createDestination(data: InsertDestination): Promise<Destination> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // PostgreSQL uses .returning() to get the inserted row
  const result = await db.insert(destinations).values(data).returning();
  return result[0];
}

export async function updateDestination(id: number, data: Partial<InsertDestination>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(destinations).set(data).where(eq(destinations.id, id));
}

export async function deleteDestination(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(destinations).where(eq(destinations.id, id));
}

// ── Gallery Photos ──────────────────────────────────────────────────────────

export async function getPhotosByDestination(destinationId: number): Promise<GalleryPhoto[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(galleryPhotos).where(eq(galleryPhotos.destinationId, destinationId)).orderBy(galleryPhotos.order);
}

export async function createPhoto(data: InsertGalleryPhoto): Promise<GalleryPhoto> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(galleryPhotos).values(data).returning();
  return result[0];
}

export async function deletePhoto(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(galleryPhotos).where(eq(galleryPhotos.id, id));
}

// Add this to the bottom of server/db.ts
export async function updatePhoto(id: number, data: { description: string }): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(galleryPhotos).set(data).where(eq(galleryPhotos.id, id));
}

export async function listAllPhotos() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Fetches all photos and orders them randomly for a fresh look every time
  return db.select().from(galleryPhotos).orderBy(`RANDOM()`);
}


// // ── Blog Posts ──────────────────────────────────────────────────────────────
export async function listBlogPosts() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
}

export async function createBlogPost(data: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const finalData = {
    ...data,
    author: "sa9ar"
  }
  const result = await db.insert(blogPosts).values(data).returning();
  return result[0];
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

export async function getBlogPostById(id: number): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result[0];
}

export async function updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
}


// Newsletter signup
export async function createNewsletterSignup(data: InsertNewsletterSignup) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(newsletterSignups).values(data).returning();
  return result[0];
}


// export async function listBlogPosts(): Promise<BlogPost[]> {
//   const db = await getDb();
//   if (!db) throw new Error("Database not available");
//   return db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
// }

// export async function getBlogPostById(id: number): Promise<BlogPost | undefined> {
//   const db = await getDb();
//   if (!db) throw new Error("Database not available");
//   const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
//   return result[0];
// }

// export async function createBlogPost(data: InsertBlogPost): Promise<BlogPost> {
//   const db = await getDb();
//   if (!db) throw new Error("Database not available");
//   const result = await db.insert(blogPosts).values(data).returning();
//   return result[0];
// }

// export async function updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<void> {
//   const db = await getDb();
//   if (!db) throw new Error("Database not available");
//   await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
// }

// export async function deleteBlogPost(id: number): Promise<void> {
//   const db = await getDb();
//   if (!db) throw new Error("Database not available");
//   await db.delete(blogPosts).where(eq(blogPosts.id, id));
// }

// // ── Social Links ────────────────────────────────────────────────────────────

// export async function listSocialLinks(): Promise<SocialLink[]> {
//   const db = await getDb();
//   if (!db) throw new Error("Database not available");
//   return db.select().from(socialLinks).orderBy(socialLinks.order);
// }

// export async function updateSocialLinks(links: InsertSocialLink[]): Promise<void> {
//   const db = await getDb();
//   if (!db) throw new Error("Database not available");
//   await db.delete(socialLinks);
//   if (links.length > 0) {
//     await db.insert(socialLinks).values(links);
//   }
// }
