import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { primaryId, timestamps } from "./columns";
import { legacyStatus, memberRole, memberStatus } from "./enums";

/**
 * App users. `id` mirrors auth.users.id (Supabase Auth). The foreign key to
 * auth.users and the "new user → profile" trigger are added in the setup SQL
 * migration, since the auth schema is Supabase-managed.
 */
export const profiles = pgTable("profiles", {
  id: uuid().primaryKey(),
  email: text(),
  fullName: text(),
  avatarUrl: text(),
  locale: text().default("nl").notNull(),
  welcomedAt: timestamp({ withTimezone: true }),
  ...timestamps(),
});

/**
 * A "legacy" — the person whose life is captured. NOT necessarily an app user:
 * a descendant can build a legacy for a deceased ancestor. All content hangs
 * off a legacy.
 */
export const legacies = pgTable(
  "legacies",
  {
    id: primaryId(),
    ownerId: uuid()
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    slug: text().notNull().unique(),
    fullName: text().notNull(),
    displayName: text(),
    birthDate: text(), // ISO date; imprecise dates supported via datePrecision on events
    deathDate: text(),
    birthplace: text(),
    status: legacyStatus().default("active").notNull(),
    headline: text(), // life motto
    biography: text(),
    avatarUrl: text(),
    coverUrl: text(),
    isPublic: boolean().default(false).notNull(),
    ...timestamps(),
  },
  (t) => [index("legacies_owner_idx").on(t.ownerId)],
);

/**
 * Access control: which user may reach which legacy, and with what rights.
 * A row with a null userId is a pending invite keyed by email.
 */
export const legacyMembers = pgTable(
  "legacy_members",
  {
    id: primaryId(),
    legacyId: uuid()
      .notNull()
      .references(() => legacies.id, { onDelete: "cascade" }),
    userId: uuid().references(() => profiles.id, { onDelete: "cascade" }),
    invitedEmail: text(),
    relation: text(), // partner / kind / kleinkind / vriend ...
    role: memberRole().default("viewer").notNull(),
    status: memberStatus().default("invited").notNull(),
    canUseAi: boolean().default(true).notNull(),
    invitedById: uuid().references(() => profiles.id, { onDelete: "set null" }),
    acceptedAt: timestamp({ withTimezone: true }),
    ...timestamps(),
  },
  (t) => [
    index("legacy_members_legacy_idx").on(t.legacyId),
    index("legacy_members_user_idx").on(t.userId),
    uniqueIndex("legacy_members_legacy_user_unique").on(t.legacyId, t.userId),
  ],
);
