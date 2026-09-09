CREATE TABLE "quote_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" text NOT NULL,
	"contact_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"contact_phone" text,
	"selected_tab" text NOT NULL,
	"selected_services" text NOT NULL,
	"objectives" text,
	"estimated_timeline" text,
	"status" text DEFAULT 'SCOPING_REQUESTED' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
