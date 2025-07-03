import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// User watchlists
export const getUserWatchlists = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    return await ctx.db
      .query("watchlists")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const createWatchlist = mutation({
  args: {
    name: v.string(),
    addresses: v.array(v.string()),
    tokens: v.array(v.string()),
    description: v.optional(v.string()),
    public: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    return await ctx.db.insert("watchlists", {
      userId,
      ...args,
    });
  },
});

export const updateWatchlist = mutation({
  args: {
    watchlistId: v.id("watchlists"),
    name: v.optional(v.string()),
    addresses: v.optional(v.array(v.string())),
    tokens: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
    public: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const watchlist = await ctx.db.get(args.watchlistId);
    if (!watchlist || watchlist.userId !== userId) {
      throw new Error("Watchlist not found or access denied");
    }
    
    const { watchlistId, ...updates } = args;
    return await ctx.db.patch(watchlistId, updates);
  },
});

// User alerts
export const getUserAlerts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    return await ctx.db
      .query("alerts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const createAlert = mutation({
  args: {
    type: v.string(),
    target: v.string(),
    condition: v.string(),
    threshold: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    return await ctx.db.insert("alerts", {
      userId,
      active: true,
      triggered: 0,
      ...args,
    });
  },
});

export const toggleAlert = mutation({
  args: {
    alertId: v.id("alerts"),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const alert = await ctx.db.get(args.alertId);
    if (!alert || alert.userId !== userId) {
      throw new Error("Alert not found or access denied");
    }
    
    return await ctx.db.patch(args.alertId, { active: args.active });
  },
});

// User annotations
export const getUserAnnotations = query({
  args: { target: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    if (args.target) {
      return await ctx.db
        .query("annotations")
        .withIndex("by_target", (q) => q.eq("target", args.target!))
        .collect();
    }
    
    return await ctx.db
      .query("annotations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const createAnnotation = mutation({
  args: {
    target: v.string(),
    type: v.string(),
    note: v.string(),
    tags: v.array(v.string()),
    public: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    return await ctx.db.insert("annotations", {
      userId,
      ...args,
    });
  },
});

// API key management
export const getUserApiKeys = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    return await ctx.db
      .query("apiKeys")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const createApiKey = mutation({
  args: {
    name: v.string(),
    permissions: v.array(v.string()),
    rateLimit: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    // Generate a random API key
    const key = `fscan_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    return await ctx.db.insert("apiKeys", {
      userId,
      key,
      usage: 0,
      active: true,
      ...args,
    });
  },
});

export const toggleApiKey = mutation({
  args: {
    keyId: v.id("apiKeys"),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const apiKey = await ctx.db.get(args.keyId);
    if (!apiKey || apiKey.userId !== userId) {
      throw new Error("API key not found or access denied");
    }
    
    return await ctx.db.patch(args.keyId, { active: args.active });
  },
});
