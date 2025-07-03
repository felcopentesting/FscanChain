import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";

const http = httpRouter();

// Public API endpoints
http.route({
  path: "/api/v1/block/:number",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const number = parseInt(url.pathname.split('/').pop() || '0');
    
    const block = await ctx.runQuery(api.blockchain.getBlockByNumber, { blockNumber: number });
    
    if (!block) {
      return new Response(JSON.stringify({ error: "Block not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    return new Response(JSON.stringify(block), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

http.route({
  path: "/api/v1/tx/:hash",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const hash = url.pathname.split('/').pop() || '';
    
    const transaction = await ctx.runQuery(api.blockchain.getTransactionByHash, { hash });
    
    if (!transaction) {
      return new Response(JSON.stringify({ error: "Transaction not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    return new Response(JSON.stringify(transaction), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

http.route({
  path: "/api/v1/address/:address",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const address = url.pathname.split('/').pop() || '';
    
    const addressInfo = await ctx.runQuery(api.blockchain.getAddressInfo, { address });
    
    if (!addressInfo) {
      return new Response(JSON.stringify({ error: "Address not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    return new Response(JSON.stringify(addressInfo), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

http.route({
  path: "/api/v1/address/:address/txs",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const address = url.pathname.split('/')[4] || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
    
    const transactions = await ctx.runQuery(api.blockchain.getTransactionsByAddress, {
      address,
      paginationOpts: { numItems: limit, cursor: null },
    });
    
    return new Response(JSON.stringify(transactions), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

http.route({
  path: "/api/v1/token/:address",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const address = url.pathname.split('/').pop() || '';
    
    const token = await ctx.runQuery(api.blockchain.getTokenInfo, { address });
    
    if (!token) {
      return new Response(JSON.stringify({ error: "Token not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    return new Response(JSON.stringify(token), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

http.route({
  path: "/api/v1/stats",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const stats = await ctx.runQuery(api.blockchain.getNetworkStats);
    
    return new Response(JSON.stringify(stats), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

http.route({
  path: "/api/v1/search",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    const type = url.searchParams.get('type') || 'all';
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50);
    
    const results: any = {};
    
    if (type === 'all' || type === 'transactions') {
      results.transactions = await ctx.runQuery(api.blockchain.searchTransactions, {
        query,
        paginationOpts: { numItems: limit, cursor: null },
      });
    }
    
    if (type === 'all' || type === 'addresses') {
      results.addresses = await ctx.runQuery(api.blockchain.searchAddresses, {
        query,
        paginationOpts: { numItems: limit, cursor: null },
      });
    }
    
    if (type === 'all' || type === 'tokens') {
      results.tokens = await ctx.runQuery(api.blockchain.searchTokens, {
        query,
        paginationOpts: { numItems: limit, cursor: null },
      });
    }
    
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// Webhook endpoint for blockchain data ingestion
http.route({
  path: "/webhook/block",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    
    // Validate webhook signature here in production
    
    await ctx.runMutation(internal.blockchain.insertBlock, body);
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
