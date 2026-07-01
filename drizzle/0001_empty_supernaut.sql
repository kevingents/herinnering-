CREATE TABLE "partner_leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization" text,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
