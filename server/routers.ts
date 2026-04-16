import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { uploadImageToCloudinary } from "./cloudinary";
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
        })
      )
      .mutation(({ input }) => {
        const { id, ...data } = input;
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
      .mutation(({ input }) => {
        return createNewsletterSignup(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
