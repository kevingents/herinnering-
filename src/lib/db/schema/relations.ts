import { relations } from "drizzle-orm";
import { legacies, legacyMembers, profiles } from "./identity";
import {
  eventMemories,
  lifeEvents,
  mediaAssets,
  memories,
  memoryMedia,
  memoryPeople,
  people,
} from "./content";
import {
  conversations,
  knowledgeChunks,
  messages,
  personalityProfiles,
} from "./ai";
import { graveMarkers, subscriptions } from "./platform";

export const profilesRelations = relations(profiles, ({ many, one }) => ({
  ownedLegacies: many(legacies),
  memberships: many(legacyMembers),
  subscription: one(subscriptions),
}));

export const legaciesRelations = relations(legacies, ({ one, many }) => ({
  owner: one(profiles, {
    fields: [legacies.ownerId],
    references: [profiles.id],
  }),
  members: many(legacyMembers),
  media: many(mediaAssets),
  memories: many(memories),
  events: many(lifeEvents),
  people: many(people),
  personality: one(personalityProfiles),
  knowledge: many(knowledgeChunks),
  conversations: many(conversations),
  markers: many(graveMarkers),
}));

export const legacyMembersRelations = relations(legacyMembers, ({ one }) => ({
  legacy: one(legacies, {
    fields: [legacyMembers.legacyId],
    references: [legacies.id],
  }),
  user: one(profiles, {
    fields: [legacyMembers.userId],
    references: [profiles.id],
  }),
}));

export const mediaAssetsRelations = relations(mediaAssets, ({ one, many }) => ({
  legacy: one(legacies, {
    fields: [mediaAssets.legacyId],
    references: [legacies.id],
  }),
  memories: many(memoryMedia),
}));

export const memoriesRelations = relations(memories, ({ one, many }) => ({
  legacy: one(legacies, {
    fields: [memories.legacyId],
    references: [legacies.id],
  }),
  author: one(profiles, {
    fields: [memories.authorId],
    references: [profiles.id],
  }),
  cover: one(mediaAssets, {
    fields: [memories.coverMediaId],
    references: [mediaAssets.id],
  }),
  media: many(memoryMedia),
  people: many(memoryPeople),
  events: many(eventMemories),
}));

export const lifeEventsRelations = relations(lifeEvents, ({ one, many }) => ({
  legacy: one(legacies, {
    fields: [lifeEvents.legacyId],
    references: [legacies.id],
  }),
  memories: many(eventMemories),
}));

export const peopleRelations = relations(people, ({ one, many }) => ({
  legacy: one(legacies, { fields: [people.legacyId], references: [legacies.id] }),
  memories: many(memoryPeople),
}));

export const memoryMediaRelations = relations(memoryMedia, ({ one }) => ({
  memory: one(memories, {
    fields: [memoryMedia.memoryId],
    references: [memories.id],
  }),
  media: one(mediaAssets, {
    fields: [memoryMedia.mediaId],
    references: [mediaAssets.id],
  }),
}));

export const memoryPeopleRelations = relations(memoryPeople, ({ one }) => ({
  memory: one(memories, {
    fields: [memoryPeople.memoryId],
    references: [memories.id],
  }),
  person: one(people, {
    fields: [memoryPeople.personId],
    references: [people.id],
  }),
}));

export const eventMemoriesRelations = relations(eventMemories, ({ one }) => ({
  event: one(lifeEvents, {
    fields: [eventMemories.eventId],
    references: [lifeEvents.id],
  }),
  memory: one(memories, {
    fields: [eventMemories.memoryId],
    references: [memories.id],
  }),
}));

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    legacy: one(legacies, {
      fields: [conversations.legacyId],
      references: [legacies.id],
    }),
    user: one(profiles, {
      fields: [conversations.userId],
      references: [profiles.id],
    }),
    messages: many(messages),
  }),
);

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export const personalityProfilesRelations = relations(
  personalityProfiles,
  ({ one }) => ({
    legacy: one(legacies, {
      fields: [personalityProfiles.legacyId],
      references: [legacies.id],
    }),
  }),
);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(profiles, {
    fields: [subscriptions.userId],
    references: [profiles.id],
  }),
}));
