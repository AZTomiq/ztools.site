/**
 * zTools Statistics API (Proxy for Supabase)
 * 
 * GET  - Fetch all tool usage stats
 * POST - Increment usage for a specific tool
 */

export default async function handler(req, res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: "Supabase configuration missing" });
  }

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // --- POST: Increment Stats ---
    if (req.method === 'POST') {
      const { tool_id } = req.body;
      if (!tool_id) return res.status(400).json({ error: "tool_id is required" });

      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_tool_usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ t_id: tool_id })
      });

      if (!response.ok) throw new Error("Supabase RPC failed");
      return res.status(200).json({ success: true });
    }

    // --- GET: Fetch All Stats ---
    if (req.method === 'GET') {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/usage_stats?select=tool_id,total_views`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });

      if (!response.ok) throw new Error("Supabase Fetch failed");
      const data = await response.json();
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("API Stats Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
