import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createNonAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Admin Procedures - Authorization", () => {
  it("admin can create destination", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.destinations.create({
      name: "Test Destination",
      description: "A test destination",
    });

    expect(result).toBeDefined();
    expect(result.name).toBe("Test Destination");
    expect(result.description).toBe("A test destination");
  });

  it("non-admin cannot create destination", async () => {
    const ctx = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.admin.destinations.create({
        name: "Test Destination",
        description: "A test destination",
      });
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
      expect(error.message).toContain("Admin access required");
    }
  });

  it("admin can create blog post", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.blog.create({
      title: "Test Blog Post",
      content: "This is a test blog post content",
      excerpt: "Test excerpt",
    });

    expect(result).toBeDefined();
    expect(result.title).toBe("Test Blog Post");
    expect(result.content).toBe("This is a test blog post content");
  });

  it("non-admin cannot create blog post", async () => {
    const ctx = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.admin.blog.create({
        title: "Test Blog Post",
        content: "This is a test blog post content",
      });
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
      expect(error.message).toContain("Admin access required");
    }
  });

  it("admin can delete destination", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create a destination first
    const created = await caller.admin.destinations.create({
      name: "Destination to Delete",
    });

    // Delete it
    await caller.admin.destinations.delete({ id: created.id });

    // Verify it's deleted
    const retrieved = await caller.destinations.getById({ id: created.id });
    expect(retrieved).toBeUndefined();
  });

  it("non-admin cannot delete destination", async () => {
    const ctx = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.admin.destinations.delete({ id: 999 });
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });
});

describe("Public Procedures", () => {
  it("public can list destinations", async () => {
    const ctx = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.destinations.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("public can list blog posts", async () => {
    const ctx = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("public can list social links", async () => {
    const ctx = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.social.list();
    expect(Array.isArray(result)).toBe(true);
  });
});
