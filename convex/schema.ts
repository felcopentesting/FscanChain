import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Blockchain data
  blocks: defineTable({
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
  })
    .index("by_number", ["number"])
    .index("by_hash", ["hash"])
    .index("by_timestamp", ["timestamp"])
    .index("by_miner", ["miner"]),

  transactions: defineTable({
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
  })
    .index("by_hash", ["hash"])
    .index("by_block", ["blockNumber"])
    .index("by_from", ["from"])
    .index("by_to", ["to"])
    .index("by_timestamp", ["timestamp"])
    .searchIndex("search_hash", {
      searchField: "hash",
      filterFields: ["blockNumber", "from", "to"],
    }),

  addresses: defineTable({
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
  })
    .index("by_address", ["address"])
    .index("by_balance", ["balance"])
    .index("by_transaction_count", ["transactionCount"])
    .searchIndex("search_address", {
      searchField: "address",
      filterFields: ["isContract"],
    }),

  tokens: defineTable({
    address: v.string(),
    name: v.string(),
    symbol: v.string(),
    decimals: v.number(),
    totalSupply: v.string(),
    contractAddress: v.string(),
    type: v.string(), // ERC20, ERC721, ERC1155
    holders: v.number(),
    transfers: v.number(),
    verified: v.boolean(),
    logo: v.optional(v.string()),
    website: v.optional(v.string()),
    description: v.optional(v.string()),
  })
    .index("by_address", ["address"])
    .index("by_symbol", ["symbol"])
    .index("by_type", ["type"])
    .searchIndex("search_tokens", {
      searchField: "name",
      filterFields: ["symbol", "type", "verified"],
    }),

  tokenTransfers: defineTable({
    transactionHash: v.string(),
    blockNumber: v.number(),
    timestamp: v.number(),
    from: v.string(),
    to: v.string(),
    tokenAddress: v.string(),
    value: v.string(),
    tokenId: v.optional(v.string()),
    logIndex: v.number(),
  })
    .index("by_transaction", ["transactionHash"])
    .index("by_token", ["tokenAddress"])
    .index("by_from", ["from"])
    .index("by_to", ["to"])
    .index("by_timestamp", ["timestamp"]),

  // Analytics and monitoring
  networkStats: defineTable({
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
  }).index("by_timestamp", ["timestamp"]),

  alerts: defineTable({
    userId: v.id("users"),
    type: v.string(), // "address", "transaction", "token", "whale"
    target: v.string(),
    condition: v.string(),
    threshold: v.optional(v.string()),
    active: v.boolean(),
    triggered: v.number(),
    lastTriggered: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_type", ["type"])
    .index("by_target", ["target"]),

  // User features
  watchlists: defineTable({
    userId: v.id("users"),
    name: v.string(),
    addresses: v.array(v.string()),
    tokens: v.array(v.string()),
    description: v.optional(v.string()),
    public: v.boolean(),
  }).index("by_user", ["userId"]),

  annotations: defineTable({
    userId: v.id("users"),
    target: v.string(), // address or transaction hash
    type: v.string(), // "address", "transaction"
    note: v.string(),
    tags: v.array(v.string()),
    public: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_target", ["target"]),

  // API usage tracking
  apiKeys: defineTable({
    userId: v.id("users"),
    key: v.string(),
    name: v.string(),
    permissions: v.array(v.string()),
    rateLimit: v.number(),
    usage: v.number(),
    active: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_key", ["key"]),

  apiUsage: defineTable({
    apiKeyId: v.id("apiKeys"),
    endpoint: v.string(),
    timestamp: v.number(),
    responseTime: v.number(),
    success: v.boolean(),
  })
    .index("by_key", ["apiKeyId"])
    .index("by_timestamp", ["timestamp"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
