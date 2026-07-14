-- Extend custom domains with instance-wide and explicit user access.
-- Kept separate from 159_custom_domains.sql because that migration is already
-- applied in production and must remain immutable.

ALTER TABLE custom_domains
    ADD COLUMN IF NOT EXISTS all_users BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS custom_domains_all_users_idx
    ON custom_domains (all_users)
    WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS custom_domain_users (
    custom_domain_id BIGINT NOT NULL REFERENCES custom_domains(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (custom_domain_id, user_id)
);

CREATE INDEX IF NOT EXISTS custom_domain_users_user_id_idx
    ON custom_domain_users (user_id);

INSERT INTO custom_domain_users (custom_domain_id, user_id)
SELECT id, user_id
FROM custom_domains
WHERE deleted_at IS NULL
ON CONFLICT DO NOTHING;
