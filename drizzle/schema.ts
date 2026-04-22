import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  varchar,
  pgEnum,
  PgSerial,
  PgText,
} from "drizzle-orm/pg-core";

// 1. Define the User Role Enum (PostgreSQL specific)
export const roleEnum = pgEnum("role", ["user", "admin"]);

// 2. Users Table (Required for Auth)
export const users = pgTable("users", {
  // We use openId as the primary key because that's what your auth system expects
  openId: varchar("openId", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// 3. Destinations Table (Your main table)
export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  destinationName: text("destinationName").notNull(),
  destinationDetail: text("destinationDetail").notNull(),
  coverUrl: text("coverUrl").notNull(),
  imagesId: text("imagesId"),
  imagesUrl: text("imagesUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// 4. Gallery
export const galleryPhotos = pgTable("gallery_photos", {
  id: serial("id").primaryKey(),
  destinationId: integer("destinationId")
    .references(() => destinations.id, { onDelete: "cascade" })
    .notNull(),
  imageUrl: text("imageUrl").notNull(),
  description: text("description"),
  order: integer("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// 5. blogPosts table definition
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  coverUrl: text("coverUrl"),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  author: text("author").default("sa9ar").notNull(),
});

// 6. Signup for newsletter
export const newsletterSignups = pgTable("newsletter_signups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  contact: text("contact"),
  message: text("message"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// 7. Photo Likes/Reactions Table
export const photoLikes = pgTable("photo_likes", {
  id: serial("id").primaryKey(),
  photoId: integer("photoId")
    .references(() => galleryPhotos.id, { onDelete: "cascade" })
    .notNull(),
  userId: varchar("userId", { length: 64 })
    .references(() => users.openId, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});



// 9. Blog Likes Table
export const blogLikes = pgTable("blog_likes", {
  id: serial("id").primaryKey(),
  blogId: integer("blogId")
    .references(() => blogPosts.id, { onDelete: "cascade" })
    .notNull(),
  userId: varchar("userId", { length: 64 })
    .references(() => users.openId, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// 10. Blog Comments Table
export const blogComments = pgTable("blog_comments", {
  id: serial("id").primaryKey(),
  blogId: integer("blogId")
    .references(() => blogPosts.id, { onDelete: "cascade" })
    .notNull(),
  userId: varchar("userId", { length: 64 })
    .references(() => users.openId, { onDelete: "cascade" })
    .notNull(),
  userName: text("userName").notNull(),
  userEmail: text("userEmail"),
  comment: text("comment").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});


// Types for your code to use
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = typeof destinations.$inferInsert;

export type GalleryPhoto = typeof galleryPhotos.$inferSelect;
export type InsertGalleryPhoto = typeof galleryPhotos.$inferInsert;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

export type NewsletterSignup = typeof newsletterSignups.$inferSelect;
export type InsertNewsletterSignup = typeof newsletterSignups.$inferInsert;

export type PhotoLike = typeof photoLikes.$inferSelect;
export type InsertPhotoLike = typeof photoLikes.$inferInsert;
export type BlogLike = typeof blogLikes.$inferSelect;
export type InsertBlogLike = typeof blogLikes.$inferInsert;
export type BlogComment = typeof blogComments.$inferSelect;
export type InsertBlogComment = typeof blogComments.$inferInsert;