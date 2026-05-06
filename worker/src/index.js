// Bangkok Laptop Hunt — Cloudflare Worker
// Serves cached scraper shortlist data as a JSON API.
// Re-run: node -e "gen data-payload.js from shortlist JSON" then wrangler deploy

import { DATA } from './data-payload.js';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Health check
    if (path === '/api/health' || path === '/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        project: 'bangkok-laptop-hunt',
        shortlist_date: DATA.scraped_at,
        total_picks: DATA.total_picks,
        platform: 'cloudflare-workers',
        timestamp: new Date().toISOString(),
      }), { status: 200, headers: corsHeaders });
    }

    // Full shortlist (root or /api/shortlist)
    if (path === '/api/shortlist' || path === '/shortlist' || path === '/') {
      return new Response(JSON.stringify({
        ...DATA,
        _meta: {
          source_file: 'shortlist-2026-04-25.json',
          api_version: '1.0.0',
          project: 'bangkok-laptop-hunt',
          platform: 'cloudflare-workers',
        },
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Cache-Control': 'public, max-age=3600' },
      });
    }

    // 404
    return new Response(JSON.stringify({
      error: 'Not found',
      endpoints: ['/api/shortlist', '/api/health'],
    }), { status: 404, headers: corsHeaders });
  },
};
