-- =====================================================
-- ZTools Usage Stats Seed Script
-- =====================================================
-- Run this in Supabase SQL Editor to populate initial data
-- Based on realistic usage patterns for Vietnamese market

-- Ensure table exists (run setup first if needed)
CREATE TABLE IF NOT EXISTS usage_stats (
    tool_id TEXT PRIMARY KEY,
    total_views BIGINT DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE usage_stats ENABLE ROW LEVEL SECURITY;

-- Public read policy
DROP POLICY IF EXISTS "Public Read" ON usage_stats;
CREATE POLICY "Public Read" ON usage_stats FOR SELECT USING (true);

-- RPC function for safe increment
CREATE OR REPLACE FUNCTION increment_tool_usage(t_id TEXT)
RETURNS void AS $$
BEGIN
    INSERT INTO usage_stats (tool_id, total_views, last_updated)
    VALUES (t_id, 1, NOW())
    ON CONFLICT (tool_id)
    DO UPDATE SET 
        total_views = usage_stats.total_views + 1,
        last_updated = EXCLUDED.last_updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Seed Data (Realistic Vietnamese market usage)
-- =====================================================

INSERT INTO usage_stats (tool_id, total_views, last_updated) VALUES
  -- Tier 1: Premium Subdomain Tools (High traffic)
  ('tax', 18750, NOW() - INTERVAL '2 hours'),
  ('json-toolkit', 14200, NOW() - INTERVAL '1 hour'),
  ('compound-interest', 9800, NOW() - INTERVAL '3 hours'),
  ('web-playground', 8500, NOW() - INTERVAL '4 hours'),
  ('lunar-calendar', 7300, NOW() - INTERVAL '5 hours'),
  
  -- Tier 2: Popular Utilities
  ('bmi', 6100, NOW() - INTERVAL '6 hours'),
  ('word-counter', 5400, NOW() - INTERVAL '7 hours'),
  ('business-tax', 4700, NOW() - INTERVAL '8 hours'),
  ('loan-calculator', 3900, NOW() - INTERVAL '9 hours'),
  ('password-generator', 3200, NOW() - INTERVAL '10 hours'),
  
  -- Tier 3: Regular Tools
  ('uuid-generator', 2500, NOW() - INTERVAL '12 hours'),
  ('savings-interest', 2100, NOW() - INTERVAL '14 hours'),
  ('social-insurance', 1800, NOW() - INTERVAL '16 hours'),
  ('percentage-calculator', 1400, NOW() - INTERVAL '18 hours'),
  ('text-formatter', 1100, NOW() - INTERVAL '20 hours'),
  ('lorem-ipsum', 850, NOW() - INTERVAL '22 hours'),
  ('ot-calculator', 720, NOW() - INTERVAL '1 day'),
  ('inflation-calculator', 580, NOW() - INTERVAL '1 day'),
  ('dev-memes', 420, NOW() - INTERVAL '2 days')
  
ON CONFLICT (tool_id) DO UPDATE SET
  total_views = EXCLUDED.total_views,
  last_updated = EXCLUDED.last_updated;

-- Verify data
SELECT tool_id, total_views, last_updated 
FROM usage_stats 
ORDER BY total_views DESC;
