-- Levend Graf — run BEFORE `npm run db:push`.
-- Enables the extensions the schema depends on.

-- gen_random_uuid()
create extension if not exists "pgcrypto";

-- pgvector: the `vector` column type on knowledge_chunks.embedding
create extension if not exists "vector";
