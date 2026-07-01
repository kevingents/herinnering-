CREATE TYPE "public"."capsule_trigger" AS ENUM('date', 'event', 'after_death', 'years_after');--> statement-breakpoint
CREATE TYPE "public"."date_precision" AS ENUM('day', 'month', 'year', 'decade');--> statement-breakpoint
CREATE TYPE "public"."knowledge_source" AS ENUM('memory', 'interview', 'document', 'voice', 'story', 'event');--> statement-breakpoint
CREATE TYPE "public"."legacy_status" AS ENUM('active', 'memorial');--> statement-breakpoint
CREATE TYPE "public"."life_event_category" AS ENUM('birth', 'childhood', 'school', 'love', 'work', 'children', 'travel', 'milestone', 'loss', 'retirement', 'other');--> statement-breakpoint
CREATE TYPE "public"."marker_type" AS ENUM('qr', 'nfc');--> statement-breakpoint
CREATE TYPE "public"."media_kind" AS ENUM('image', 'video', 'audio', 'document');--> statement-breakpoint
CREATE TYPE "public"."member_role" AS ENUM('viewer', 'contributor', 'admin', 'owner');--> statement-breakpoint
CREATE TYPE "public"."member_status" AS ENUM('invited', 'active', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."memory_type" AS ENUM('story', 'photo', 'video', 'audio', 'document', 'note');--> statement-breakpoint
CREATE TYPE "public"."message_role" AS ENUM('user', 'assistant', 'system');--> statement-breakpoint
CREATE TYPE "public"."privacy_request_status" AS ENUM('pending', 'processing', 'completed', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."privacy_request_type" AS ENUM('export', 'delete');--> statement-breakpoint
CREATE TYPE "public"."subscription_plan" AS ENUM('free', 'premium', 'legacy_lifetime');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'past_due', 'canceled', 'trialing', 'incomplete');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('private', 'family', 'public');--> statement-breakpoint
CREATE TYPE "public"."voice_emotion" AS ENUM('blij', 'rustig', 'serieus', 'verdrietig', 'grappig');--> statement-breakpoint
CREATE TABLE "legacies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"full_name" text NOT NULL,
	"display_name" text,
	"birth_date" text,
	"death_date" text,
	"birthplace" text,
	"status" "legacy_status" DEFAULT 'active' NOT NULL,
	"headline" text,
	"biography" text,
	"avatar_url" text,
	"cover_url" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "legacies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "legacy_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_id" uuid NOT NULL,
	"user_id" uuid,
	"invited_email" text,
	"relation" text,
	"role" "member_role" DEFAULT 'viewer' NOT NULL,
	"status" "member_status" DEFAULT 'invited' NOT NULL,
	"can_use_ai" boolean DEFAULT true NOT NULL,
	"invited_by_id" uuid,
	"accepted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text,
	"full_name" text,
	"avatar_url" text,
	"locale" text DEFAULT 'nl' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_memories" (
	"event_id" uuid NOT NULL,
	"memory_id" uuid NOT NULL,
	CONSTRAINT "event_memories_event_id_memory_id_pk" PRIMARY KEY("event_id","memory_id")
);
--> statement-breakpoint
CREATE TABLE "family_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_id" uuid NOT NULL,
	"related_legacy_id" uuid,
	"related_person_id" uuid,
	"relationship_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "life_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_id" uuid NOT NULL,
	"category" "life_event_category" DEFAULT 'other' NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"event_date" text,
	"end_date" text,
	"date_precision" date_precision DEFAULT 'year' NOT NULL,
	"location_name" text,
	"latitude" double precision,
	"longitude" double precision,
	"cover_media_id" uuid,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_id" uuid NOT NULL,
	"kind" "media_kind" NOT NULL,
	"storage_path" text NOT NULL,
	"file_name" text,
	"mime_type" text,
	"size_bytes" bigint,
	"width" integer,
	"height" integer,
	"duration_seconds" integer,
	"caption" text,
	"transcript" text,
	"metadata" jsonb,
	"uploaded_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_id" uuid NOT NULL,
	"author_id" uuid,
	"type" "memory_type" DEFAULT 'story' NOT NULL,
	"title" text,
	"body" text,
	"memory_date" text,
	"date_precision" date_precision DEFAULT 'day' NOT NULL,
	"location_name" text,
	"latitude" double precision,
	"longitude" double precision,
	"cover_media_id" uuid,
	"visibility" "visibility" DEFAULT 'family' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memory_media" (
	"memory_id" uuid NOT NULL,
	"media_id" uuid NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "memory_media_memory_id_media_id_pk" PRIMARY KEY("memory_id","media_id")
);
--> statement-breakpoint
CREATE TABLE "memory_people" (
	"memory_id" uuid NOT NULL,
	"person_id" uuid NOT NULL,
	CONSTRAINT "memory_people_memory_id_person_id_pk" PRIMARY KEY("memory_id","person_id")
);
--> statement-breakpoint
CREATE TABLE "people" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_id" uuid NOT NULL,
	"name" text NOT NULL,
	"relation" text,
	"avatar_media_id" uuid,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interview_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_id" uuid NOT NULL,
	"question_id" uuid,
	"question_text" text NOT NULL,
	"answer_text" text,
	"audio_media_id" uuid,
	"answered_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interview_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" text,
	"text" text NOT NULL,
	"parent_id" uuid,
	"is_seed" boolean DEFAULT false NOT NULL,
	"locale" text DEFAULT 'nl' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "time_capsules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_id" uuid NOT NULL,
	"created_by_id" uuid,
	"title" text NOT NULL,
	"message" text,
	"media_id" uuid,
	"trigger" "capsule_trigger" NOT NULL,
	"unlock_date" text,
	"unlock_condition" text,
	"years_after" integer,
	"recipient_member_id" uuid,
	"recipient_email" text,
	"is_unlocked" boolean DEFAULT false NOT NULL,
	"unlocked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "voice_samples" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_id" uuid NOT NULL,
	"media_id" uuid NOT NULL,
	"emotion" "voice_emotion" NOT NULL,
	"transcript" text,
	"is_training" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_id" uuid NOT NULL,
	"user_id" uuid,
	"title" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_id" uuid NOT NULL,
	"source_type" "knowledge_source" NOT NULL,
	"source_id" uuid,
	"content" text NOT NULL,
	"embedding" vector(1536),
	"token_count" integer,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"role" "message_role" NOT NULL,
	"content" text NOT NULL,
	"citations" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personality_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_id" uuid NOT NULL,
	"summary" text,
	"tone" text,
	"humor" text,
	"values" jsonb,
	"traits" jsonb,
	"favorite_phrases" jsonb,
	"philosophy" text,
	"training_completeness" integer DEFAULT 0 NOT NULL,
	"model_status" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "personality_profiles_legacyId_unique" UNIQUE("legacy_id")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"action" text NOT NULL,
	"target_type" text,
	"target_id" uuid,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grave_markers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_id" uuid NOT NULL,
	"code" text NOT NULL,
	"type" "marker_type" DEFAULT 'qr' NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	"location_name" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"scan_count" integer DEFAULT 0 NOT NULL,
	"last_scanned_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "grave_markers_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "privacy_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"legacy_id" uuid,
	"type" "privacy_request_type" NOT NULL,
	"status" "privacy_request_status" DEFAULT 'pending' NOT NULL,
	"notes" text,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan" "subscription_plan" DEFAULT 'free' NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL,
	"mollie_customer_id" text,
	"mollie_subscription_id" text,
	"current_period_end" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_userId_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "legacies" ADD CONSTRAINT "legacies_owner_id_profiles_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legacy_members" ADD CONSTRAINT "legacy_members_legacy_id_legacies_id_fk" FOREIGN KEY ("legacy_id") REFERENCES "public"."legacies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legacy_members" ADD CONSTRAINT "legacy_members_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legacy_members" ADD CONSTRAINT "legacy_members_invited_by_id_profiles_id_fk" FOREIGN KEY ("invited_by_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_memories" ADD CONSTRAINT "event_memories_event_id_life_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."life_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_memories" ADD CONSTRAINT "event_memories_memory_id_memories_id_fk" FOREIGN KEY ("memory_id") REFERENCES "public"."memories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_links" ADD CONSTRAINT "family_links_legacy_id_legacies_id_fk" FOREIGN KEY ("legacy_id") REFERENCES "public"."legacies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_links" ADD CONSTRAINT "family_links_related_legacy_id_legacies_id_fk" FOREIGN KEY ("related_legacy_id") REFERENCES "public"."legacies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_links" ADD CONSTRAINT "family_links_related_person_id_people_id_fk" FOREIGN KEY ("related_person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "life_events" ADD CONSTRAINT "life_events_legacy_id_legacies_id_fk" FOREIGN KEY ("legacy_id") REFERENCES "public"."legacies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "life_events" ADD CONSTRAINT "life_events_cover_media_id_media_assets_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_legacy_id_legacies_id_fk" FOREIGN KEY ("legacy_id") REFERENCES "public"."legacies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploaded_by_id_profiles_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memories" ADD CONSTRAINT "memories_legacy_id_legacies_id_fk" FOREIGN KEY ("legacy_id") REFERENCES "public"."legacies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memories" ADD CONSTRAINT "memories_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memories" ADD CONSTRAINT "memories_cover_media_id_media_assets_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memory_media" ADD CONSTRAINT "memory_media_memory_id_memories_id_fk" FOREIGN KEY ("memory_id") REFERENCES "public"."memories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memory_media" ADD CONSTRAINT "memory_media_media_id_media_assets_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memory_people" ADD CONSTRAINT "memory_people_memory_id_memories_id_fk" FOREIGN KEY ("memory_id") REFERENCES "public"."memories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memory_people" ADD CONSTRAINT "memory_people_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "people" ADD CONSTRAINT "people_legacy_id_legacies_id_fk" FOREIGN KEY ("legacy_id") REFERENCES "public"."legacies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "people" ADD CONSTRAINT "people_avatar_media_id_media_assets_id_fk" FOREIGN KEY ("avatar_media_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_answers" ADD CONSTRAINT "interview_answers_legacy_id_legacies_id_fk" FOREIGN KEY ("legacy_id") REFERENCES "public"."legacies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_answers" ADD CONSTRAINT "interview_answers_question_id_interview_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."interview_questions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_answers" ADD CONSTRAINT "interview_answers_audio_media_id_media_assets_id_fk" FOREIGN KEY ("audio_media_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_answers" ADD CONSTRAINT "interview_answers_answered_by_id_profiles_id_fk" FOREIGN KEY ("answered_by_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_parent_id_interview_questions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."interview_questions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_capsules" ADD CONSTRAINT "time_capsules_legacy_id_legacies_id_fk" FOREIGN KEY ("legacy_id") REFERENCES "public"."legacies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_capsules" ADD CONSTRAINT "time_capsules_created_by_id_profiles_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_capsules" ADD CONSTRAINT "time_capsules_media_id_media_assets_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_capsules" ADD CONSTRAINT "time_capsules_recipient_member_id_legacy_members_id_fk" FOREIGN KEY ("recipient_member_id") REFERENCES "public"."legacy_members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voice_samples" ADD CONSTRAINT "voice_samples_legacy_id_legacies_id_fk" FOREIGN KEY ("legacy_id") REFERENCES "public"."legacies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voice_samples" ADD CONSTRAINT "voice_samples_media_id_media_assets_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_legacy_id_legacies_id_fk" FOREIGN KEY ("legacy_id") REFERENCES "public"."legacies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_legacy_id_legacies_id_fk" FOREIGN KEY ("legacy_id") REFERENCES "public"."legacies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personality_profiles" ADD CONSTRAINT "personality_profiles_legacy_id_legacies_id_fk" FOREIGN KEY ("legacy_id") REFERENCES "public"."legacies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_profiles_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grave_markers" ADD CONSTRAINT "grave_markers_legacy_id_legacies_id_fk" FOREIGN KEY ("legacy_id") REFERENCES "public"."legacies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "privacy_requests" ADD CONSTRAINT "privacy_requests_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "privacy_requests" ADD CONSTRAINT "privacy_requests_legacy_id_legacies_id_fk" FOREIGN KEY ("legacy_id") REFERENCES "public"."legacies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "legacies_owner_idx" ON "legacies" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "legacy_members_legacy_idx" ON "legacy_members" USING btree ("legacy_id");--> statement-breakpoint
CREATE INDEX "legacy_members_user_idx" ON "legacy_members" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "legacy_members_legacy_user_unique" ON "legacy_members" USING btree ("legacy_id","user_id");--> statement-breakpoint
CREATE INDEX "family_links_legacy_idx" ON "family_links" USING btree ("legacy_id");--> statement-breakpoint
CREATE INDEX "life_events_legacy_idx" ON "life_events" USING btree ("legacy_id");--> statement-breakpoint
CREATE INDEX "media_assets_legacy_idx" ON "media_assets" USING btree ("legacy_id");--> statement-breakpoint
CREATE INDEX "memories_legacy_idx" ON "memories" USING btree ("legacy_id");--> statement-breakpoint
CREATE INDEX "memories_date_idx" ON "memories" USING btree ("memory_date");--> statement-breakpoint
CREATE INDEX "people_legacy_idx" ON "people" USING btree ("legacy_id");--> statement-breakpoint
CREATE INDEX "interview_answers_legacy_idx" ON "interview_answers" USING btree ("legacy_id");--> statement-breakpoint
CREATE INDEX "time_capsules_legacy_idx" ON "time_capsules" USING btree ("legacy_id");--> statement-breakpoint
CREATE INDEX "voice_samples_legacy_idx" ON "voice_samples" USING btree ("legacy_id");--> statement-breakpoint
CREATE INDEX "conversations_legacy_idx" ON "conversations" USING btree ("legacy_id");--> statement-breakpoint
CREATE INDEX "knowledge_chunks_legacy_idx" ON "knowledge_chunks" USING btree ("legacy_id");--> statement-breakpoint
CREATE INDEX "messages_conversation_idx" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "audit_logs_actor_idx" ON "audit_logs" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "grave_markers_legacy_idx" ON "grave_markers" USING btree ("legacy_id");--> statement-breakpoint
CREATE INDEX "privacy_requests_user_idx" ON "privacy_requests" USING btree ("user_id");