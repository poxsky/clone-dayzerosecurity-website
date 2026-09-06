import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const quoteRequests = pgTable("quote_requests", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  selectedTab: text("selected_tab").notNull(),
  selectedServices: text("selected_services").notNull(), // JSON string array
  objectives: text("objectives"),
  easterEggDiscount: boolean("easter_egg_discount").default(false),
  estimatedTimeline: text("estimated_timeline"),
  status: text("status").default("SCOPING_REQUESTED").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const researchEpisodes = pgTable("research_episodes", {
  id: serial("id").primaryKey(),
  episodeNumber: text("episode_number").notNull(),
  title: text("title").notNull(),
  track: text("track").notNull(), // 'Web & Cloud Bug Bounty' | 'Binary Exploitation'
  publishedAt: text("published_at").notNull(),
  duration: text("duration").notNull(),
  cveTags: text("cve_tags").notNull(), // JSON string array
  summary: text("summary").notNull(),
  timestamps: text("timestamps").notNull(), // JSON string array of { time, label }
  audioUrl: text("audio_url").notNull(),
});

export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type NewQuoteRequest = typeof quoteRequests.$inferInsert;
export type ResearchEpisode = typeof researchEpisodes.$inferSelect;
