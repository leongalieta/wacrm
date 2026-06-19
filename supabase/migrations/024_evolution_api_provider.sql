-- 024_evolution_api_provider.sql
-- Adds Evolution API as an alternative WhatsApp provider

ALTER TABLE whatsapp_config
ADD COLUMN IF NOT EXISTS provider TEXT NOT NULL DEFAULT 'meta'
    CHECK (provider IN ('meta', 'evolution'));

ALTER TABLE whatsapp_config
ADD COLUMN IF NOT EXISTS evolution_url TEXT;

ALTER TABLE whatsapp_config
ADD COLUMN IF NOT EXISTS evolution_api_key TEXT;

ALTER TABLE whatsapp_config
ADD COLUMN IF NOT EXISTS evolution_instance TEXT;
