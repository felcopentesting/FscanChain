import { query, mutation, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

// Block queries
export const getLatestBlocks = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blocks")
      .withIndex("by_number")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getBlockByNumber = query({
  args: { blockNumber: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blocks")
      .withIndex("by_number", (q) => q.eq("number", args.blockNumber))
      .unique();
  },
});

export const getBlockByHash = query({
  args: { hash: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blocks")
      .withIndex("by_hash", (q) => q.eq("hash", args.hash))
      .unique();
  },
});

// Transaction queries
export const getLatestTransactions = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .withIndex("by_timestamp")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getTransactionByHash = query({
  args: { hash: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .withIndex("by_hash", (q) => q.eq("hash", args.hash))
      .unique();
  },
});

export const getTransactionsByBlock = query({
  args: { blockNumber: v.number(), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .withIndex("by_block", (q) => q.eq("blockNumber", args.blockNumber))
      .order("asc")
      .paginate(args.paginationOpts);
  },
});

export const getTransactionsByAddress = query({
  args: { 
    address: v.string(), 
    type: v.optional(v.string()), // "from", "to", or undefined for both
    paginationOpts: paginationOptsValidator 
  },
  handler: async (ctx, args) => {
    if (args.type === "from") {
      return await ctx.db
        .query("transactions")
        .withIndex("by_from", (q) => q.eq("from", args.address))
        .order("desc")
        .paginate(args.paginationOpts);
    } else if (args.type === "to") {
      return await ctx.db
        .query("transactions")
        .withIndex("by_to", (q) => q.eq("to", args.address))
        .order("desc")
        .paginate(args.paginationOpts);
    } else {
      // Get both from and to transactions
      const fromTxs = await ctx.db
        .query("transactions")
        .withIndex("by_from", (q) => q.eq("from", args.address))
        .order("desc")
        .take(50);
      
      const toTxs = await ctx.db
        .query("transactions")
        .withIndex("by_to", (q) => q.eq("to", args.address))
        .order("desc")
        .take(50);
      
      // Combine and sort by timestamp
      const allTxs = [...fromTxs, ...toTxs]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, args.paginationOpts.numItems);
      
      return {
        page: allTxs,
        isDone: allTxs.length < args.paginationOpts.numItems,
        continueCursor: null,
      };
    }
  },
});

// Address queries
export const getAddressInfo = query({
  args: { address: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("addresses")
      .withIndex("by_address", (q) => q.eq("address", args.address))
      .unique();
  },
});

export const getTopAddresses = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("addresses")
      .withIndex("by_balance")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

// Token queries
export const getTokenInfo = query({
  args: { address: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tokens")
      .withIndex("by_address", (q) => q.eq("address", args.address))
      .unique();
  },
});

export const getTopTokens = query({
  args: { type: v.optional(v.string()), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    if (args.type) {
      return await ctx.db
        .query("tokens")
        .withIndex("by_type", (q) => q.eq("type", args.type!))
        .order("desc")
        .paginate(args.paginationOpts);
    }
    return await ctx.db
      .query("tokens")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getTokenTransfers = query({
  args: { 
    tokenAddress: v.string(), 
    paginationOpts: paginationOptsValidator 
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tokenTransfers")
      .withIndex("by_token", (q) => q.eq("tokenAddress", args.tokenAddress))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

// Search functionality
export const searchTransactions = query({
  args: { 
    query: v.string(), 
    paginationOpts: paginationOptsValidator 
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .withSearchIndex("search_hash", (q) => q.search("hash", args.query))
      .paginate(args.paginationOpts);
  },
});

export const searchAddresses = query({
  args: { 
    query: v.string(), 
    contractsOnly: v.optional(v.boolean()),
    paginationOpts: paginationOptsValidator 
  },
  handler: async (ctx, args) => {
    if (args.contractsOnly) {
      return await ctx.db
        .query("addresses")
        .withSearchIndex("search_address", (q) => 
          q.search("address", args.query).eq("isContract", true)
        )
        .paginate(args.paginationOpts);
    }
    
    return await ctx.db
      .query("addresses")
      .withSearchIndex("search_address", (q) => q.search("address", args.query))
      .paginate(args.paginationOpts);
  },
});

export const searchTokens = query({
  args: { 
    query: v.string(), 
    type: v.optional(v.string()),
    verifiedOnly: v.optional(v.boolean()),
    paginationOpts: paginationOptsValidator 
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tokens")
      .withSearchIndex("search_tokens", (q) => q.search("name", args.query))
      .paginate(args.paginationOpts);
  },
});

// Network statistics
export const getNetworkStats = query({
  args: {},
  handler: async (ctx) => {
    const latest = await ctx.db
      .query("networkStats")
      .withIndex("by_timestamp")
      .order("desc")
      .first();
    
    return latest;
  },
});

export const getNetworkStatsHistory = query({
  args: { 
    hours: v.number(), 
    paginationOpts: paginationOptsValidator 
  },
  handler: async (ctx, args) => {
    const cutoff = Date.now() - (args.hours * 60 * 60 * 1000);
    
    return await ctx.db
      .query("networkStats")
      .withIndex("by_timestamp", (q) => q.gte("timestamp", cutoff))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

// Analytics queries
export const getGasPriceHistory = query({
  args: { hours: v.number() },
  handler: async (ctx, args) => {
    const cutoff = Date.now() - (args.hours * 60 * 60 * 1000);
    
    return await ctx.db
      .query("networkStats")
      .withIndex("by_timestamp", (q) => q.gte("timestamp", cutoff))
      .order("asc")
      .take(1000);
  },
});

export const getTransactionVolumeHistory = query({
  args: { hours: v.number() },
  handler: async (ctx, args) => {
    const cutoff = Date.now() - (args.hours * 60 * 60 * 1000);
    
    const blocks = await ctx.db
      .query("blocks")
      .withIndex("by_timestamp", (q) => q.gte("timestamp", cutoff))
      .order("asc")
      .take(1000);
    
    return blocks.map(block => ({
      timestamp: block.timestamp,
      transactionCount: block.transactionCount,
      gasUsed: block.gasUsed,
    }));
  },
});

// Internal mutations for data ingestion
export const insertBlock = internalMutation({
  args: {
    number: v.number(),
    hash: v.string(),
    parentHash: v.string(),
    timestamp: v.number(),
    gasUsed: v.string(),
    gasLimit: v.string(),
    difficulty: v.string(),
    totalDifficulty: v.string(),
    size: v.number(),
    transactionCount: v.number(),
    miner: v.string(),
    reward: v.string(),
    extraData: v.optional(v.string()),
    nonce: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("blocks", args);
  },
});

export const insertTransaction = internalMutation({
  args: {
    hash: v.string(),
    blockNumber: v.number(),
    blockHash: v.string(),
    transactionIndex: v.number(),
    from: v.string(),
    to: v.optional(v.string()),
    value: v.string(),
    gas: v.string(),
    gasPrice: v.string(),
    gasUsed: v.optional(v.string()),
    status: v.optional(v.number()),
    timestamp: v.number(),
    input: v.optional(v.string()),
    logs: v.optional(v.array(v.any())),
    contractAddress: v.optional(v.string()),
    cumulativeGasUsed: v.optional(v.string()),
    effectiveGasPrice: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("transactions", args);
  },
});

export const upsertAddress = internalMutation({
  args: {
    address: v.string(),
    balance: v.string(),
    transactionCount: v.number(),
    firstSeen: v.number(),
    lastSeen: v.number(),
    isContract: v.boolean(),
    contractName: v.optional(v.string()),
    contractSource: v.optional(v.string()),
    contractAbi: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    label: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("addresses")
      .withIndex("by_address", (q) => q.eq("address", args.address))
      .unique();
    
    if (existing) {
      return await ctx.db.patch(existing._id, {
        balance: args.balance,
        transactionCount: args.transactionCount,
        lastSeen: args.lastSeen,
      });
    } else {
      return await ctx.db.insert("addresses", args);
    }
  },
});

export const insertNetworkStats = internalMutation({
  args: {
    timestamp: v.number(),
    blockNumber: v.number(),
    hashRate: v.string(),
    difficulty: v.string(),
    gasPrice: v.string(),
    pendingTransactions: v.number(),
    activeAddresses: v.number(),
    totalTransactions: v.number(),
    marketCap: v.optional(v.string()),
    price: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("networkStats", args);
  },
});
