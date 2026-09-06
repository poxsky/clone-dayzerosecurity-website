import { NextResponse } from "next/server";
import { db } from "@/db";
import { quoteRequests } from "@/db/schema";
import { desc } from "drizzle-orm";

// Seed default sample quote requests if table is empty
async function seedInitialQuotesIfNeeded() {
  try {
    const existing = await db.select().from(quoteRequests).limit(1);
    if (existing.length === 0) {
      await db.insert(quoteRequests).values([
        {
          companyName: "Aethelgard Financial Systems",
          contactName: "Elena Vance (CISO)",
          contactEmail: "evance@aethelgard-sec.com",
          contactPhone: "+61 412 890 112",
          selectedTab: "Red Teaming · One-time Assessment",
          selectedServices: JSON.stringify([
            "Real-World Adversary Simulation",
            "Phishing Simulation",
            "Compromise Assessment",
          ]),
          objectives:
            "Full-frontal covert red team simulation targeting Active Directory tier-0 assets & executive physical entry points. Mentioning the discount from the website HTML comment or something.",
          easterEggDiscount: true,
          estimatedTimeline: "4-6 Weeks",
          status: "SCOPING_APPROVED",
        },
        {
          companyName: "Nexus Cloud Logistics",
          contactName: "Marcus Sterling",
          contactEmail: "msterling@nexuscloud.io",
          contactPhone: "+61 488 331 094",
          selectedTab: "AppSec · Periodic Retainer",
          selectedServices: JSON.stringify([
            "Cloud Security Assessments",
            "Source Code Review",
          ]),
          objectives:
            "Gap analysis of multi-region AWS IAM roles, EKS cluster isolation, and cross-account trust policies.",
          easterEggDiscount: false,
          estimatedTimeline: "2-3 Weeks",
          status: "SCOPING_REQUESTED",
        },
      ]);
    }
  } catch (err) {
    console.error("Error seeding initial quote requests:", err);
  }
}

export async function GET() {
  try {
    await seedInitialQuotesIfNeeded();
    const quotes = await db
      .select()
      .from(quoteRequests)
      .orderBy(desc(quoteRequests.createdAt));
    return NextResponse.json({ quotes });
  } catch (error) {
    console.error("GET /api/quotes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quote requests", quotes: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      companyName,
      contactName,
      contactEmail,
      contactPhone,
      selectedTab,
      selectedServices,
      objectives,
      easterEggDiscount,
      estimatedTimeline,
    } = body;

    if (!companyName || !contactName || !contactEmail) {
      return NextResponse.json(
        { error: "Company name, contact name, and email are required." },
        { status: 400 }
      );
    }

    // Check if objectives or discount field mentions the HTML comment easter egg
    const objectivesLower = (objectives || "").toLowerCase();
    const detectedEasterEgg =
      Boolean(easterEggDiscount) ||
      objectivesLower.includes("html comment") ||
      objectivesLower.includes("discount from the website") ||
      objectivesLower.includes("spaghetti html") ||
      objectivesLower.includes("chris s.");

    const [created] = await db
      .insert(quoteRequests)
      .values({
        companyName,
        contactName,
        contactEmail,
        contactPhone: contactPhone || "",
        selectedTab: selectedTab || "Penetration Testing",
        selectedServices: JSON.stringify(
          Array.isArray(selectedServices) ? selectedServices : ["Web Application Penetration Testing"]
        ),
        objectives: objectives || "Standard offensive security engagement scoping request.",
        easterEggDiscount: detectedEasterEgg,
        estimatedTimeline: estimatedTimeline || "2-4 Weeks",
        status: "SCOPING_REQUESTED",
      })
      .returning();

    return NextResponse.json({
      quote: created,
      discountApplied: detectedEasterEgg,
      message: detectedEasterEgg
        ? "Quote submitted! 5% HTML Comment Technical Client Discount applied."
        : "Quote request submitted successfully. Our offensive security leads will contact you within 24 hours.",
    });
  } catch (error) {
    console.error("POST /api/quotes error:", error);
    return NextResponse.json(
      { error: "Failed to submit quote request." },
      { status: 500 }
    );
  }
}
