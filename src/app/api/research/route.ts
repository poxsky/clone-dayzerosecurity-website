import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { researchEpisodes } from "@/db/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function ensureResearchEpisodesTable(db: ReturnType<typeof getDb>) {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS research_episodes (
      id serial PRIMARY KEY,
      episode_number text NOT NULL,
      title text NOT NULL,
      track text NOT NULL,
      published_at text NOT NULL,
      duration text NOT NULL,
      cve_tags text NOT NULL,
      summary text NOT NULL,
      timestamps text NOT NULL,
      audio_url text NOT NULL
    )
  `);
}

async function seedResearchEpisodesIfNeeded(db: ReturnType<typeof getDb>) {
  try {
    const existing = await db.select().from(researchEpisodes).limit(1);
    if (existing.length === 0) {
      await db.insert(researchEpisodes).values([
        {
          episodeNumber: "EP #234",
          title: "VMware ESXi Heap Overflow, vCenter Auth Bypass & Cloud IAM Escalation",
          track: "Binary Exploitation",
          publishedAt: "2026-02-18",
          duration: "54:12",
          cveTags: JSON.stringify(["CVE-2025-22224", "CVE-2025-22225", "ESXi Heap", "vCenter RCE"]),
          summary:
            "Deep dive into VMware ESXi TOCTOU out-of-bounds write vulnerabilities allowing VM escape to hypervisor kernel, followed by AWS IAM cross-account role chaining techniques observed in enterprise red team engagements.",
          timestamps: JSON.stringify([
            { time: "00:00", label: "Intro & Hypervisor Threat Landscape" },
            { time: "08:42", label: "CVE-2025-22224 ESXi Heap Overflow Breakdown" },
            { time: "24:15", label: "Exploiting VMCI Shared Memory Descriptors" },
            { time: "41:30", label: "Defensive Telemetry & Detection in ESXi" },
          ]),
          audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_b81e282908.mp3",
        },
        {
          episodeNumber: "EP #233",
          title: "Next.js Server Actions Deserialization, GraphQL Batching & OAuth Smuggling",
          track: "Web & Cloud Bug Bounty",
          publishedAt: "2026-02-11",
          duration: "48:35",
          cveTags: JSON.stringify(["CVE-2025-29927", "OAuth 2.0", "SSRF", "GraphQL DoS"]),
          summary:
            "Analysis of modern web application attack vectors discovered during Day 0 Security penetration testing engagements: middleware header spoofing, OAuth redirect state race conditions, and internal metadata SSRF.",
          timestamps: JSON.stringify([
            { time: "00:00", label: "Modern Web App Pentesting Trends" },
            { time: "11:20", label: "Middleware Header Injection & Auth Bypass" },
            { time: "27:50", label: "OAuth 2.0 PKCE Downgrade & Token Smuggling" },
            { time: "39:10", label: "Cloud Metadata SSRF to AWS IMDSv2 Bypass" },
          ]),
          audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3",
        },
        {
          episodeNumber: "EP #232",
          title: "Active Directory Tier-0 Compromise: ADCS ESC8 to Domain Admin in 14 Minutes",
          track: "Red Team Research",
          publishedAt: "2026-02-04",
          duration: "61:08",
          cveTags: JSON.stringify(["ADCS ESC8", "Kerberos Relay", "LSA Protection", "EDR Evasion"]),
          summary:
            "Case study from a covert full-frontal Red Team operation: abusing NTLM relay to Active Directory Certificate Services HTTP endpoints, bypassing Protected Process Light (PPL), and maintaining stealth persistence.",
          timestamps: JSON.stringify([
            { time: "00:00", label: "Initial Foothold via Spear-Phishing Payload" },
            { time: "14:05", label: "Internal Network Reconnaissance & BloodHound" },
            { time: "31:40", label: "Coercing Domain Controller Auth via PetitPotam" },
            { time: "48:22", label: "Certificate Forgery & Post-Exploitation OPSEC" },
          ]),
          audioUrl: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_946f4f0e81.mp3",
        },
      ]);
    }
  } catch (err) {
    console.error("Error seeding research episodes:", err);
  }
}

export async function GET() {
  try {
    const db = getDb();
    await ensureResearchEpisodesTable(db);
    await seedResearchEpisodesIfNeeded(db);
    const episodes = await db.select().from(researchEpisodes);
    return NextResponse.json({ episodes });
  } catch (error) {
    console.error("GET /api/research error:", error);
    return NextResponse.json({ episodes: [] }, { status: 500 });
  }
}
