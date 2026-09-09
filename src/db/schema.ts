import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const quoteRequests = pgTable("quote_requests", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  selectedTab: text("selected_tab").notNull(),
  selectedServices: text("selected_services").notNull(), // JSON string array
  objectives: text("objectives"),
  estimatedTimeline: text("estimated_timeline"),
  status: text("status").default("SCOPING_REQUESTED").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type NewQuoteRequest = typeof quoteRequests.$inferInsert;
