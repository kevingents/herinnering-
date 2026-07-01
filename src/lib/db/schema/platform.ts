import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { primaryId, timestamps } from "./columns";
import {
  markerType,
  privacyRequestStatus,
  privacyRequestType,
  subscriptionPlan,
  subscriptionStatus,
} from "./enums";
import { legacies, profiles } from "./identity";

/** Billing (Mollie). One subscription per user. */
export const subscriptions = pgTable("subscriptions", {
  id: primaryId(),
  userId: uuid()
    .notNull()
    .unique()
    .references(() => profiles.id, { onDelete: "cascade" }),
  plan: subscriptionPlan().default("free").notNull(),
  status: subscriptionStatus().default("active").notNull(),
  mollieCustomerId: text(),
  mollieSubscriptionId: text(),
  currentPeriodEnd: timestamp({ withTimezone: true }),
  ...timestamps(),
});

/** Physical QR / NFC markers on a grave that open the memorial (Grafmodus). */
export const graveMarkers = pgTable(
  "grave_markers",
  {
    id: primaryId(),
    legacyId: uuid()
      .notNull()
      .references(() => legacies.id, { onDelete: "cascade" }),
    code: text().notNull().unique(),
    type: markerType().default("qr").notNull(),
    latitude: doublePrecision(),
    longitude: doublePrecision(),
    locationName: text(),
    isActive: boolean().default(true).notNull(),
    scanCount: integer().default(0).notNull(),
    lastScannedAt: timestamp({ withTimezone: true }),
    ...timestamps(),
  },
  (t) => [index("grave_markers_legacy_idx").on(t.legacyId)],
);

/** Admin audit trail. */
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: primaryId(),
    actorId: uuid().references(() => profiles.id, { onDelete: "set null" }),
    action: text().notNull(),
    targetType: text(),
    targetId: uuid(),
    metadata: jsonb(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("audit_logs_actor_idx").on(t.actorId)],
);

/** AVG/GDPR export & deletion requests. */
export const privacyRequests = pgTable(
  "privacy_requests",
  {
    id: primaryId(),
    userId: uuid()
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    legacyId: uuid().references(() => legacies.id, { onDelete: "set null" }),
    type: privacyRequestType().notNull(),
    status: privacyRequestStatus().default("pending").notNull(),
    notes: text(),
    resolvedAt: timestamp({ withTimezone: true }),
    ...timestamps(),
  },
  (t) => [index("privacy_requests_user_idx").on(t.userId)],
);

/** B2B partnership leads from uitvaartondernemers (funeral directors). */
export const partnerLeads = pgTable("partner_leads", {
  id: primaryId(),
  organization: text(),
  name: text().notNull(),
  email: text().notNull(),
  phone: text(),
  message: text(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
