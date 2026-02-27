-- Munich Watch Fair Dashboard - Supabase Migration
-- Run this in the Supabase SQL Editor (https://urrugwhywrkrodsuzgyu.supabase.co)

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('messe', 'logistik', 'admin')),
  title TEXT NOT NULL,
  assigned_to TEXT NOT NULL CHECK (assigned_to IN ('Max', 'Anna', 'Beide')),
  completed BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table (key-value store)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read/write (dashboard is shared between Max & Anna)
CREATE POLICY "Allow anonymous access to tasks"
  ON tasks FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous access to settings"
  ON settings FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable Realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE settings;

-- Insert default messe date
INSERT INTO settings (key, value)
VALUES ('messe_date', '2026-02-22T07:00:00+01:00')
ON CONFLICT (key) DO NOTHING;

-- Seed default tasks
INSERT INTO tasks (category, title, assigned_to, sort_order) VALUES
  -- Messe-Vorbereitung
  ('messe', 'Stand-Buchung bestätigen', 'Max', 1),
  ('messe', 'Ausstellerliste finalisieren', 'Max', 2),
  ('messe', 'Marketing-Material drucken', 'Anna', 3),
  ('messe', 'Uhren-Auswahl zusammenstellen', 'Max', 4),
  ('messe', 'Social Media Kampagne planen', 'Anna', 5),
  ('messe', 'Preisschilder erstellen', 'Beide', 6),
  -- Logistik
  ('logistik', 'Transport organisieren', 'Max', 1),
  ('logistik', 'Aufbau-Team briefen', 'Beide', 2),
  ('logistik', 'Hotel buchen', 'Anna', 3),
  ('logistik', 'Equipment-Liste prüfen', 'Max', 4),
  ('logistik', 'Vitrinen & Displays bestellen', 'Max', 5),
  -- Admin
  ('admin', 'Rechnungen vorbereiten', 'Anna', 1),
  ('admin', 'Versicherung abschließen', 'Anna', 2),
  ('admin', 'Steuerunterlagen sammeln', 'Anna', 3),
  ('admin', 'Verträge prüfen', 'Beide', 4);
