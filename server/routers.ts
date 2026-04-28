import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { uploadImageToCloudinary } from "./cloudinary";
import { sendWelcomeEmail } from "./email";
import { sdk } from "./_core/sdk";
import {
  listDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
  getPhotosByDestination,
  createPhoto,
  deletePhoto,
  updatePhoto,
  listAllPhotos,
  listBlogPosts,
  createBlogPost,
  deleteBlogPost,
  getBlogPostById,
  updateBlogPost,
  createNewsletterSignup,
  getStats,
  togglePhotoLike,
  getPhotoLikes,
  hasUserLikedPhoto,
  toggleBlogLike,
  getBlogLikes,
  hasUserLikedBlog,
  createBlogComment,
  getBlogComments,
  deleteBlogComment,
  getUserByEmail,
  getUserByOpenId,
  upsertUser,
  listUsers,
  listNewsletterSignups,
} from "./db";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),

    loginWithEmail: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input, ctx }) => {
        // Check if user exists in database
        const user = await getUserByEmail(input.email);

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Email not registered. Please sign up first.",
          });
        }

        // // Create session for the user
        // const { sdk } = await import("./_core/auth");
        // const token = await signToken({ openId: user.openId });

// ... inside loginWithEmail mutation ...
const token = await sdk.createSessionToken(user.openId, { name: user.name || "" });


        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, cookieOptions);

        // Update last signed in
        await upsertUser({
          openId: user.openId,
          lastSignedIn: new Date(),
        });

        return { success: true, user };
      }),
  }),

  destinations: router({
    // Public Routes
    list: publicProcedure.query(() => listDestinations()),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getDestinationById(input.id)),

    getPhotos: publicProcedure
      .input(z.object({ destinationId: z.number() }))
      .query(({ input }) => getPhotosByDestination(input.destinationId)),

    // Admin Routes
    create: adminProcedure
      .input(
        z.object({
          destinationName: z.string().min(1),
          destinationDetail: z.string(),
          coverImageBase64: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        let coverUrl = "";
        if (input.coverImageBase64) {
          coverUrl = await uploadImageToCloudinary(
            input.coverImageBase64,
            "destinations"
          );
        }
        return createDestination({
          destinationName: input.destinationName,
          destinationDetail: input.destinationDetail,
          coverUrl: coverUrl,
        });
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          destinationName: z.string().optional(),
          destinationDetail: z.string().optional(),
          coverUrl: z.string().optional(),
          coverImageBase64: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, coverImageBase64, ...data } = input;

        if (coverImageBase64) {
          const coverUrl = await uploadImageToCloudinary(
            coverImageBase64,
            "destinations"
          );
          data.coverUrl = coverUrl;
        }

        return updateDestination(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteDestination(input.id)),

    addPhoto: adminProcedure
      .input(
        z.object({
          destinationId: z.number(),
          imageBase64: z.string(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const imageUrl = await uploadImageToCloudinary(
          input.imageBase64,
          "gallery"
        );
        return createPhoto({
          destinationId: input.destinationId,
          imageUrl: imageUrl,
          description: input.description || "",
        });
      }),

    updatePhoto: adminProcedure
      .input(
        z.object({
          id: z.number(),
          description: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updatePhoto(id, data); // Now it matches the style of your other routes!
      }),

    listAllPhotos: publicProcedure.query(() => listAllPhotos()),

    deletePhoto: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deletePhoto(input.id)),
  }),

  // Add after the destinations router (around line 142)
  photos: router({
    // Toggle like on a photo
    toggleLike: protectedProcedure
      .input(z.object({ photoId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        return togglePhotoLike(input.photoId, ctx.user!.openId);
      }),

    // Get likes count and user's like status
    getLikeInfo: publicProcedure
      .input(z.object({ photoId: z.number() }))
      .query(async ({ input, ctx }) => {
        const count = await getPhotoLikes(input.photoId);
        const hasLiked = await hasUserLikedPhoto(
          input.photoId,
          ctx.user?.openId
        );
        return { count, hasLiked };
      }),
  }),

  // Blogs
  blogs: router({
    list: publicProcedure.query(() => listBlogPosts()),

    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          content: z.string().min(1),
          coverImageBase64: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        let coverUrl = "";
        if (input.coverImageBase64) {
          coverUrl = await uploadImageToCloudinary(
            input.coverImageBase64,
            "blogs"
          );
        }
        return createBlogPost({
          title: input.title,
          content: input.content,
          coverUrl: coverUrl,
          author: "sa9ar",
        });
      }),

    // In server/routers.ts, inside the blogs: router({ ... })
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getBlogPostById(input.id)),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          content: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updateBlogPost(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteBlogPost(input.id)),

    toggleLike: protectedProcedure
      .input(z.object({ blogId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        return toggleBlogLike(input.blogId, ctx.user!.openId);
      }),

    getLikeInfo: publicProcedure
      .input(z.object({ blogId: z.number() }))
      .query(async ({ input, ctx }) => {
        const count = await getBlogLikes(input.blogId);
        const hasLiked = await hasUserLikedBlog(input.blogId, ctx.user?.openId);
        return { count, hasLiked };
      }),

    addComment: protectedProcedure
      .input(
        z.object({
          blogId: z.number(),
          comment: z.string().min(1).max(1000),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return createBlogComment({
          blogId: input.blogId,
          userId: ctx.user!.openId,
          userName: ctx.user!.name || "Anonymous",
          userEmail: ctx.user!.email || undefined,
          comment: input.comment,
        });
      }),

    getComments: publicProcedure
      .input(z.object({ blogId: z.number() }))
      .query(({ input }) => getBlogComments(input.blogId)),

    deleteComment: protectedProcedure
      .input(z.object({ commentId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        return deleteBlogComment(input.commentId, ctx.user!.openId);
      }),
  }),

  // Newsletter

  newsletter: router({
    signup: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          contact: z.string().optional(),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Save to database
        const signup = await createNewsletterSignup(input);

        const { nanoid } = await import("nanoid");
        const openId = `email_${nanoid(20)}`;

        try {
          await upsertUser({
            openId: openId,
            name: input.name,
            email: input.email,
            loginMethod: "email",
            role: "user",
          });
        } catch (error) {
          console.error("[Newsletter] Failed to create user account:", error);
          // Continue even if user creation fails
        }

        // Send welcome email (import sendWelcomeEmail at top)
        try {
          await sendWelcomeEmail(input.email, input.name);
        } catch (error) {
          console.error("[Newsletter] Email failed but signup saved:", error);
          // Don't throw - signup is still successful even if email fails
        }

        return signup;
      }),
  }),

  stats: router({
    get: publicProcedure.query(() => getStats()),
  }),

  admin: router({
    listUsers: adminProcedure.query(() => listUsers()),
    listMessages: adminProcedure.query(() => listNewsletterSignups()),
  }),
});

export type AppRouter = typeof appRouter;