import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  vector,
} from "drizzle-orm/pg-core";
import { primaryId, timestamps } from "./columns";
import { knowledgeSource, messageRole } from "./enums";
import { legacies, profiles } from "./identity";

/** The analysed digital personality (Digitale Persoonlijkheid). One per legacy. */
export const personalityProfiles = pgTable("personality_profiles", {
  id: primaryId(),
  legacyId: uuid()
    .notNull()
    .unique()
    .references(() => legacies.id, { onDelete: "cascade" }),
  summary: text(),
  tone: text(),
  humor: text(),
  values: jsonb(),
  traits: jsonb(),
  favoritePhrases: jsonb(),
  philosophy: text(),
  trainingCompleteness: integer().default(0).notNull(), // 0–100
  modelStatus: text(),
  ...timestamps(),
});

/**
 * RAG store: embedded chunks of everything the person recorded, used to ground
 * AI answers strictly in real, vastgelegde information. The HNSW vector index is
 * created in the setup SQL (needs the pgvector operator class).
 */
export const knowledgeChunks = pgTable(
  "knowledge_chunks",
  {
    id: primaryId(),
    legacyId: uuid()
      .notNull()
      .references(() => legacies.id, { onDelete: "cascade" }),
    sourceType: knowledgeSource().notNull(),
    sourceId: uuid(),
    content: text().notNull(),
    embedding: vector({ dimensions: 1536 }),
    tokenCount: integer(),
    metadata: jsonb(),
    ...timestamps(),
  },
  (t) => [index("knowledge_chunks_legacy_idx").on(t.legacyId)],
);

/** AI chat sessions with a legacy (AI Chat — "praat met opa"). */
export const conversations = pgTable(
  "conversations",
  {
    id: primaryId(),
    legacyId: uuid()
      .notNull()
      .references(() => legacies.id, { onDelete: "cascade" }),
    userId: uuid().references(() => profiles.id, { onDelete: "set null" }),
    title: text(),
    ...timestamps(),
  },
  (t) => [index("conversations_legacy_idx").on(t.legacyId)],
);

export const messages = pgTable(
  "messages",
  {
    id: primaryId(),
    conversationId: uuid()
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    role: messageRole().notNull(),
    content: text().notNull(),
    // Which memories/sources the answer cited: [{ sourceType, sourceId, snippet }]
    citations: jsonb(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("messages_conversation_idx").on(t.conversationId)],
);
