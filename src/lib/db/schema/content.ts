import {
  bigint,
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { primaryId, timestamps } from "./columns";
import {
  datePrecision,
  lifeEventCategory,
  mediaKind,
  memoryType,
  visibility,
} from "./enums";
import { legacies, profiles } from "./identity";

/** Uploaded files: photos, videos, audio, documents. */
export const mediaAssets = pgTable(
  "media_assets",
  {
    id: primaryId(),
    legacyId: uuid()
      .notNull()
      .references(() => legacies.id, { onDelete: "cascade" }),
    kind: mediaKind().notNull(),
    storagePath: text().notNull(),
    fileName: text(),
    mimeType: text(),
    sizeBytes: bigint({ mode: "number" }),
    width: integer(),
    height: integer(),
    durationSeconds: integer(),
    caption: text(),
    transcript: text(),
    metadata: jsonb(),
    uploadedById: uuid().references(() => profiles.id, { onDelete: "set null" }),
    ...timestamps(),
  },
  (t) => [index("media_assets_legacy_idx").on(t.legacyId)],
);

/** People appearing in a life (not app users): family, friends, characters. */
export const people = pgTable(
  "people",
  {
    id: primaryId(),
    legacyId: uuid()
      .notNull()
      .references(() => legacies.id, { onDelete: "cascade" }),
    name: text().notNull(),
    relation: text(),
    avatarMediaId: uuid().references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    notes: text(),
    ...timestamps(),
  },
  (t) => [index("people_legacy_idx").on(t.legacyId)],
);

/** The core content unit: a story, photo set, letter, note, etc. */
export const memories = pgTable(
  "memories",
  {
    id: primaryId(),
    legacyId: uuid()
      .notNull()
      .references(() => legacies.id, { onDelete: "cascade" }),
    authorId: uuid().references(() => profiles.id, { onDelete: "set null" }),
    type: memoryType().default("story").notNull(),
    title: text(),
    body: text(),
    memoryDate: text(),
    datePrecision: datePrecision().default("day").notNull(),
    locationName: text(),
    latitude: doublePrecision(),
    longitude: doublePrecision(),
    coverMediaId: uuid().references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    visibility: visibility().default("family").notNull(),
    isFeatured: boolean().default(false).notNull(),
    ...timestamps(),
  },
  (t) => [
    index("memories_legacy_idx").on(t.legacyId),
    index("memories_date_idx").on(t.memoryDate),
  ],
);

/** Timeline milestones (Levenslijn). Memories can be attached to events. */
export const lifeEvents = pgTable(
  "life_events",
  {
    id: primaryId(),
    legacyId: uuid()
      .notNull()
      .references(() => legacies.id, { onDelete: "cascade" }),
    category: lifeEventCategory().default("other").notNull(),
    title: text().notNull(),
    description: text(),
    eventDate: text(),
    endDate: text(),
    datePrecision: datePrecision().default("year").notNull(),
    locationName: text(),
    latitude: doublePrecision(),
    longitude: doublePrecision(),
    coverMediaId: uuid().references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    position: integer().default(0).notNull(),
    ...timestamps(),
  },
  (t) => [index("life_events_legacy_idx").on(t.legacyId)],
);

/* ── Join tables ──────────────────────────────────────────────────────── */

export const memoryMedia = pgTable(
  "memory_media",
  {
    memoryId: uuid()
      .notNull()
      .references(() => memories.id, { onDelete: "cascade" }),
    mediaId: uuid()
      .notNull()
      .references(() => mediaAssets.id, { onDelete: "cascade" }),
    position: integer().default(0).notNull(),
  },
  (t) => [primaryKey({ columns: [t.memoryId, t.mediaId] })],
);

export const memoryPeople = pgTable(
  "memory_people",
  {
    memoryId: uuid()
      .notNull()
      .references(() => memories.id, { onDelete: "cascade" }),
    personId: uuid()
      .notNull()
      .references(() => people.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.memoryId, t.personId] })],
);

export const eventMemories = pgTable(
  "event_memories",
  {
    eventId: uuid()
      .notNull()
      .references(() => lifeEvents.id, { onDelete: "cascade" }),
    memoryId: uuid()
      .notNull()
      .references(() => memories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.eventId, t.memoryId] })],
);

/** Family tree links (Familieboom): connect legacies and people into a tree. */
export const familyLinks = pgTable(
  "family_links",
  {
    id: primaryId(),
    legacyId: uuid()
      .notNull()
      .references(() => legacies.id, { onDelete: "cascade" }),
    relatedLegacyId: uuid().references(() => legacies.id, {
      onDelete: "set null",
    }),
    relatedPersonId: uuid().references(() => people.id, {
      onDelete: "set null",
    }),
    relationshipType: text().notNull(), // parent / child / spouse / sibling ...
    ...timestamps(),
  },
  (t) => [index("family_links_legacy_idx").on(t.legacyId)],
);
