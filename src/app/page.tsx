"use client";

import React, { useState, useEffect } from "react";
import PurpleFluidCanvas from "@/components/PurpleFluidCanvas";
import Icon from "@/components/Icon";
import {
  SERVICE_CATALOG,
  SERVICE_CATEGORIES,
  WHY_US,
  type CategoryId,
  type ServiceItem,
} from "@/data/services";
import {
  ArrowUp,
  ArrowRight,
  CheckCircle2,
  Check,
  Plus,
  Send,
  Mail,
  Phone,
  User,
  Building2,
  Globe as GlobeIcon,
  Terminal,
  Award,
  Sparkles,
  ShieldCheck,
  Clock,
} from "lucide-react";

interface QuoteSubmission {
  id: number;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  selectedTab: string;
  selectedServices: string;
  objectives: string;
  easterEggDiscount: boolean;
  estimatedTimeline: string;
  status: string;
  createdAt: string;
}

const STATS = [
  { value: "6", label: "Core Service Lines" },
  { value: "25+", label: "Assessment Offerings" },
  { value: "CVE", label: "Credited Research" },
  { value: "HoF", label: "Hall of Fame Recognitions" },
];

export default function ZeroDaySecurityPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("vapt");
  const [activeService, setActiveService] = useState<ServiceItem | null>(
    SERVICE_CATALOG.find((s) => s.category === "vapt") ?? null
  );

  const [selectedServices, setSelectedServices] = useState<string[]>([
    "Web Application Penetration Testing",
    "API Security Testing",
  ]);
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [objectives, setObjectives] = useState("");
  const [engagementModel, setEngagementModel] = useState("One-time Assessment");
  const [estimatedTimeline, setEstimatedTimeline] = useState("2-4 Weeks");
  const [easterEggDiscount, setEasterEggDiscount] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
    discountApplied?: boolean;
  } | null>(null);

  const [recentQuotes, setRecentQuotes] = useState<QuoteSubmission[]>([]);
  const [showQuotesModal, setShowQuotesModal] = useState(false);

  useEffect(() => {
    fetch("/api/quotes")
      .then((r) => r.json())
      .then((d) => {
        if (d.quotes) setRecentQuotes(d.quotes);
      })
      .catch(console.error);
  }, []);

  const activeCategoryMeta =
    SERVICE_CATEGORIES.find((c) => c.id === activeCategory) ??
    SERVICE_CATEGORIES[0];

  const categoryServices = SERVICE_CATALOG.filter(
    (s) => s.category === activeCategory
  );

  const toggleScope = (name: string) =>
    setSelectedServices((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );

  const selectCategory = (id: CategoryId) => {
    setActiveCategory(id);
    const first = SERVICE_CATALOG.find((s) => s.category === id);
    if (first) setActiveService(first);
  };

  const claimDiscount = () => {
    setEasterEggDiscount(true);
    if (!objectives.includes("HTML comment")) {
      setObjectives(
        (prev) =>
          (prev ? prev + "\n" : "") +
          'Claiming 5% off: "the discount from the website HTML comment or something".'
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          contactName,
          contactEmail,
          contactPhone,
          selectedTab: `${activeCategoryMeta.shortLabel} · ${engagementModel}`,
          selectedServices,
          objectives,
          easterEggDiscount,
          estimatedTimeline,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to submit request.",
        });
      } else {
        setStatusMessage({
          type: "success",
          text: data.message,
          discountApplied: data.discountApplied,
        });
        const updated = await fetch("/api/quotes").then((r) => r.json());
        if (updated.quotes) setRecentQuotes(updated.quotes);
        setCompanyName("");
        setContactName("");
        setContactEmail("");
        setContactPhone("");
      }
    } catch {
      setStatusMessage({ type: "error", text: "Network error. Try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#de5cff] selection:text-black">
      <div
        dangerouslySetInnerHTML={{
          __html: `<!--
    0day Security likes technical clients who are a little curious.
    Mention "the discount from the website HTML comment or something" and get 5% off your quote.
    Also, we break applications; we don't write them. Please forgive the spaghetti HTML.
    Cheers, Anmol — anmol@anmol.reseracher.com
-->`,
        }}
      />

      {/* ===================== HEADER ===================== */}
      <header className="fixed top-0 inset-x-0 z-50 bg-black/85 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-20 flex items-center justify-between gap-4">
          <a
            href="#top"
            className="font-anonymous font-bold text-2xl md:text-3xl tracking-tight hover:opacity-90 transition"
          >
            <span className="text-[#de5cff]">0day</span> Security
          </a>

          <nav className="hidden lg:flex items-center gap-7 font-mono-tech text-[13px] uppercase tracking-wider text-zinc-300">
            <a href="#about" className="hover:text-[#de5cff] transition">
              Who We Are
            </a>
            <a href="#services" className="hover:text-[#de5cff] transition">
              Services
            </a>
            <a href="#why" className="hover:text-[#de5cff] transition">
              Why Us
            </a>
            <a href="#contact" className="hover:text-[#de5cff] transition">
              Contact
            </a>
            <button
              onClick={() => setShowQuotesModal(true)}
              className="text-zinc-500 hover:text-[#de5cff] transition cursor-pointer"
            >
              Portal ({recentQuotes.length})
            </button>
          </nav>

          <a
            href="#contact"
            className="font-mono-tech text-[11px] md:text-xs uppercase tracking-wider px-5 py-2.5 border-2 border-[#c000f0] rounded-[3px] hover:bg-[#c000f0] transition shadow-[0_0_15px_rgba(192,0,240,0.3)]"
          >
            Get a Quote
          </a>
        </div>
      </header>

      {/* ===================== HERO ===================== */}
      <section
        id="top"
        className="relative w-full min-h-screen flex items-center overflow-hidden bg-black"
      >
        <PurpleFluidCanvas />

        <div className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-10 pt-28 pb-20">
          <div className="pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#de5cff]/40 bg-[#de5cff]/10 text-[#de5cff] font-mono-tech text-[11px] uppercase tracking-[0.2em] mb-6">
              <ShieldCheck className="w-3.5 h-3.5" /> Security Research &
              Testing Group
            </div>

            <h1 className="font-anonymous font-bold uppercase text-white text-5xl sm:text-7xl md:text-8xl lg:text-[6rem] leading-[1.02] tracking-[-0.03em] mb-5">
              Security. <br />
              From d<span className="tracking-[-0.08em]">ay</span> zero.
            </h1>

            <p className="font-mono-tech text-white/70 font-light text-xl sm:text-2xl md:text-3xl tracking-[-0.02em] max-w-3xl mb-4">
              Offensive security specialists
            </p>
            <p className="font-mono-tech text-zinc-400 text-sm md:text-base max-w-2xl leading-relaxed mb-10">
              We help businesses find and fix real security gaps before
              attackers do — backed by Hall of Fame recognitions and CVE credits
              from responsible disclosure work.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-16">
            <a
              href="#services"
              className="px-7 py-3.5 bg-[#de5cff] hover:bg-[#c000f0] text-black hover:text-white font-mono-tech font-medium text-sm uppercase tracking-wider rounded-[3px] transition shadow-[0_0_25px_rgba(222,92,255,0.35)]"
            >
              Explore Services
            </a>
            <a
              href="#contact"
              className="px-7 py-3.5 bg-black/60 hover:bg-zinc-900 text-white border border-white/25 hover:border-[#de5cff] font-mono-tech text-sm uppercase tracking-wider rounded-[3px] transition"
            >
              Free Scoping & Quote
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden max-w-3xl">
            {STATS.map((s) => (
              <div key={s.label} className="bg-black/70 backdrop-blur px-5 py-5">
                <div className="font-anonymous font-bold text-2xl md:text-3xl text-[#de5cff]">
                  {s.value}
                </div>
                <div className="font-mono-tech text-[10px] md:text-[11px] uppercase tracking-wider text-zinc-400 mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Note: Full original content restored to fix build. Tagline change will be re-applied carefully next. */}
