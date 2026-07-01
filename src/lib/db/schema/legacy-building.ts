import {
  type AnyPgColumn,
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { primaryId, timestamps } from "./columns";
import { capsuleTrigger, voiceEmotion } from "./enums";
import { legacies, legacyMembers, profiles } from "./identity";
import { mediaAssets } from "./content";

/** The interview question bank (self-referential for follow-up questions). */
export const interviewQuestions = pgTable("interview_questions", {
  id: primaryId(),
  category: text(),
  text: text().notNull(),
  parentId: uuid().references((): AnyPgColumn => interviewQuestions.id, {
    onDelete: "set null",
  }),
  isSeed: boolean().default(false).notNull(),
  locale: text().default("nl").notNull(),
  ...timestamps(),
});

/** Answers to interview questions — text and/or a voice recording. */
export const interviewAnswers = pgTable(
  "interview_answers",
  {
    id: primaryId(),
    legacyId: uuid()
      .notNull()
      .references(() => legacies.id, { onDelete: "cascade" }),
    questionId: uuid().references(() => interviewQuestions.id, {
      onDelete: "set null",
    }),
    // Denormalised because the AI also asks dynamically-generated questions.
    questionText: text().notNull(),
    answerText: text(),
    audioMediaId: uuid().references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    answeredById: uuid().references(() => profiles.id, { onDelete: "set null" }),
    ...timestamps(),
  },
  (t) => [index("interview_answers_legacy_idx").on(t.legacyId)],
);

/** Voice recordings tagged by emotion, for building a voice model (Stem). */
export const voiceSamples = pgTable(
  "voice_samples",
  {
    id: primaryId(),
    legacyId: uuid()
      .notNull()
      .references(() => legacies.id, { onDelete: "cascade" }),
    mediaId: uuid()
      .notNull()
      .references(() => mediaAssets.id, { onDelete: "cascade" }),
    emotion: voiceEmotion().notNull(),
    transcript: text(),
    isTraining: boolean().default(true).notNull(),
    ...timestamps(),
  },
  (t) => [index("voice_samples_legacy_idx").on(t.legacyId)],
);

/** Messages that unlock at a future date, event or after death (Tijdcapsules). */
export const timeCapsules = pgTable(
  "time_capsules",
  {
    id: primaryId(),
    legacyId: uuid()
      .notNull()
      .references(() => legacies.id, { onDelete: "cascade" }),
    createdById: uuid().references(() => profiles.id, { onDelete: "set null" }),
    title: text().notNull(),
    message: text(),
    mediaId: uuid().references(() => mediaAssets.id, { onDelete: "set null" }),
    trigger: capsuleTrigger().notNull(),
    unlockDate: text(),
    unlockCondition: text(),
    yearsAfter: integer(),
    recipientMemberId: uuid().references(() => legacyMembers.id, {
      onDelete: "set null",
    }),
    recipientEmail: text(),
    isUnlocked: boolean().default(false).notNull(),
    unlockedAt: timestamp({ withTimezone: true }),
    ...timestamps(),
  },
  (t) => [index("time_capsules_legacy_idx").on(t.legacyId)],
);
