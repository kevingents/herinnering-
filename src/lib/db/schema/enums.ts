import { pgEnum } from "drizzle-orm/pg-core";

export const legacyStatus = pgEnum("legacy_status", ["active", "memorial"]);

export const memberRole = pgEnum("member_role", [
  "viewer",
  "contributor",
  "admin",
  "owner",
]);

export const memberStatus = pgEnum("member_status", [
  "invited",
  "active",
  "revoked",
]);

export const visibility = pgEnum("visibility", ["private", "family", "public"]);

export const memoryType = pgEnum("memory_type", [
  "story",
  "photo",
  "video",
  "audio",
  "document",
  "note",
]);

export const mediaKind = pgEnum("media_kind", [
  "image",
  "video",
  "audio",
  "document",
]);

export const datePrecision = pgEnum("date_precision", [
  "day",
  "month",
  "year",
  "decade",
]);

export const lifeEventCategory = pgEnum("life_event_category", [
  "birth",
  "childhood",
  "school",
  "love",
  "work",
  "children",
  "travel",
  "milestone",
  "loss",
  "retirement",
  "other",
]);

export const voiceEmotion = pgEnum("voice_emotion", [
  "blij",
  "rustig",
  "serieus",
  "verdrietig",
  "grappig",
]);

export const capsuleTrigger = pgEnum("capsule_trigger", [
  "date",
  "event",
  "after_death",
  "years_after",
]);

export const messageRole = pgEnum("message_role", [
  "user",
  "assistant",
  "system",
]);

export const subscriptionPlan = pgEnum("subscription_plan", [
  "free",
  "premium",
  "legacy_lifetime",
]);

export const subscriptionStatus = pgEnum("subscription_status", [
  "active",
  "past_due",
  "canceled",
  "trialing",
  "incomplete",
]);

export const markerType = pgEnum("marker_type", ["qr", "nfc"]);

export const privacyRequestType = pgEnum("privacy_request_type", [
  "export",
  "delete",
]);

export const privacyRequestStatus = pgEnum("privacy_request_status", [
  "pending",
  "processing",
  "completed",
  "rejected",
]);

export const knowledgeSource = pgEnum("knowledge_source", [
  "memory",
  "interview",
  "document",
  "voice",
  "story",
  "event",
]);
