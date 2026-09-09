"use client";

import React, { useState } from "react";
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
  ShieldCheck,
  Clock,
} from "lucide-react";

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
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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
        });
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
      {/* ===================== HEADER ===================== */}
      <header className="fixed top-0 inset-x-0 z-50 bg-black/85 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-20 flex items-center justify-between gap-4">
          <a
            href="#top"
            className="font-anonymous font-bold text-2xl md:text-3xl tracking-tight hover:opacity-90 transition"
          >
            <span className="text-[#de5cff]">0DAY</span> Research Team
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

      {/* ===================== WHO WE ARE ===================== */}
      <section
        id="about"
        className="bg-[#050505] border-t border-zinc-900 py-24"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
          <div className="lg:col-span-5">
            <span className="font-mono-tech text-[11px] uppercase tracking-[0.25em] text-[#de5cff]">
              / Who We Are
            </span>
            <h2 className="font-anonymous font-bold text-3xl md:text-5xl text-white mt-4 leading-tight">
              A security team that actually breaks things.
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <p className="font-mono-tech text-zinc-300 text-base md:text-lg leading-relaxed">
              <span className="text-white font-semibold">
                0DAY Research Team
              </span>{" "}
              is a security research and testing group built around a core team
              with hands-on offensive security experience — including multiple
              Hall of Fame recognitions and CVE credits from responsible
              disclosure work.
            </p>
            <p className="font-mono-tech text-zinc-400 text-sm md:text-base leading-relaxed">
              We help businesses find and fix real security gaps before
              attackers do. That means manually validated findings, exploitation
              evidence you can reproduce, and reporting your leadership can
              actually act on.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {[
                { k: "Research-led", v: "CVE & Hall of Fame credited" },
                { k: "Manual-first", v: "Validated, not scanner noise" },
                { k: "Business-aware", v: "Risk framed for decisions" },
              ].map((b) => (
                <div
                  key={b.k}
                  className="p-4 rounded-lg bg-[#111] border border-zinc-800"
                >
                  <div className="font-anonymous font-bold text-white text-lg">
                    {b.k}
                  </div>
                  <div className="font-mono-tech text-xs text-zinc-400 mt-1 leading-relaxed">
                    {b.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CORE SERVICES ===================== */}
      <section
        id="services"
        className="bg-black border-t border-zinc-900 py-24"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <span className="font-mono-tech text-[11px] uppercase tracking-[0.25em] text-[#de5cff]">
              / Core Services
            </span>
            <h2 className="font-anonymous font-bold text-3xl md:text-5xl text-white mt-4">
              Cybersecurity Services Overview
            </h2>
            <p className="font-mono-tech text-zinc-400 text-sm md:text-base mt-4 max-w-2xl mx-auto">
              Six core service lines covering offensive testing, application
              security, compliance, people and response.
            </p>
          </div>

          {/* Category tabs */}
          <div className="border-b border-zinc-800 mb-14 overflow-x-auto">
            <ul className="flex justify-start lg:justify-center min-w-max gap-2 md:gap-6 font-mono-tech">
              {SERVICE_CATEGORIES.map((cat) => {
                const active = cat.id === activeCategory;
                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => selectCategory(cat.id)}
                      className={`pb-4 px-3 md:px-4 border-b-[3px] transition cursor-pointer flex items-center gap-2 text-sm md:text-base uppercase whitespace-nowrap ${
                        active
                          ? "border-[#de5cff] text-white font-semibold"
                          : "border-transparent text-zinc-500 hover:text-white"
                      }`}
                    >
                      <span
                        className={`text-[10px] ${
                          active ? "text-[#de5cff]" : "text-zinc-600"
                        }`}
                      >
                        {cat.index}
                      </span>
                      {cat.shortLabel}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: service cards */}
            <div className="lg:col-span-7">
              <div className="mb-6">
                <h3 className="font-anonymous font-bold text-2xl md:text-3xl text-white">
                  {activeCategoryMeta.headline}
                </h3>
                <p className="font-mono-tech text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
                  {activeCategoryMeta.blurb}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoryServices.map((item) => {
                  const inScope = selectedServices.includes(item.name);
                  const isActive = activeService?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveService(item)}
                      className={`group cursor-pointer rounded-[6px] p-5 border transition-all ${
                        isActive
                          ? "bg-[#1a1a1a] border-[#de5cff] shadow-[0_0_25px_rgba(222,92,255,0.15)]"
                          : "bg-[#0f0f0f] border-zinc-800 hover:bg-[#171717] hover:border-zinc-700"
                      }`}
                    >
                      <div
                        className={`mb-3 transition-colors ${
                          isActive
                            ? "text-[#de5cff]"
                            : "text-zinc-300 group-hover:text-white"
                        }`}
                      >
                        <Icon name={item.iconKey} className="w-8 h-8" />
                      </div>
                      <span className="font-mono-tech font-medium text-white text-sm block leading-snug mb-3">
                        {item.name}
                      </span>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono-tech text-[10px] uppercase tracking-wider text-zinc-500">
                          {item.typicalDuration}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleScope(item.name);
                          }}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono-tech uppercase tracking-wider transition cursor-pointer ${
                            inScope
                              ? "bg-[#de5cff]/20 text-[#de5cff] border border-[#de5cff]/40"
                              : "bg-zinc-900 text-zinc-400 hover:text-white border border-transparent"
                          }`}
                        >
                          {inScope ? (
                            <>
                              <Check className="w-3 h-3" /> In Scope
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" /> Add
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: category highlights + inspector */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
              {activeCategoryMeta.highlights.map((h) => (
                <div key={h.title} className="flex items-start gap-4">
                  <div className="mt-1 p-2.5 rounded-lg bg-[#de5cff]/10 border border-[#de5cff]/30 text-[#de5cff] shrink-0">
                    <Icon name={h.iconKey} className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-anonymous font-bold text-lg text-white block mb-1.5">
                      {h.title}
                    </span>
                    <p className="font-mono-tech text-sm text-zinc-400 leading-relaxed">
                      {h.body}
                    </p>
                  </div>
                </div>
              ))}

              {activeService && (
                <div className="bg-[#0d0d0d] border border-zinc-800 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="px-2.5 py-1 rounded bg-[#de5cff]/15 text-[#de5cff] font-mono-tech text-[10px] uppercase tracking-wider border border-[#de5cff]/30">
                      Scope Detail
                    </span>
                    <span className="font-mono-tech text-[11px] text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {activeService.typicalDuration}
                    </span>
                  </div>

                  <h4 className="font-anonymous font-bold text-xl text-white leading-snug">
                    {activeService.name}
                  </h4>
                  <p className="font-mono-tech text-xs text-zinc-400 leading-relaxed">
                    {activeService.methodology}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <span className="font-mono-tech text-[10px] uppercase tracking-wider text-zinc-500">
                      Deliverables
                    </span>
                    {activeService.deliverables.map((d) => (
                      <div
                        key={d}
                        className="flex items-start gap-2 font-mono-tech text-xs text-zinc-300"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#de5cff] mt-0.5 shrink-0" />
                        {d}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleScope(activeService.name)}
                    className={`w-full py-2.5 rounded-[3px] font-mono-tech text-[11px] uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 ${
                      selectedServices.includes(activeService.name)
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                        : "bg-[#de5cff] text-black hover:bg-[#c000f0] hover:text-white font-semibold"
                    }`}
                  >
                    {selectedServices.includes(activeService.name) ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Scope
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Add to Engagement Scope
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== WHY 0DAY SECURITY ===================== */}
      <section id="why" className="bg-[#050505] border-t border-zinc-900 py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="mb-12">
            <span className="font-mono-tech text-[11px] uppercase tracking-[0.25em] text-[#de5cff]">
              / Why Us
            </span>
            <h2 className="font-anonymous font-bold text-3xl md:text-5xl text-white mt-4">
              Why 0DAY Research Team
            </h2>
          </div>

          <div className="border border-zinc-800 rounded-lg overflow-hidden">
            <div className="hidden md:grid grid-cols-12 bg-[#0d0d0d] border-b border-zinc-800 font-mono-tech text-[11px] uppercase tracking-wider text-zinc-500">
              <div className="col-span-4 px-6 py-4">Strength</div>
              <div className="col-span-8 px-6 py-4">
                What it means for you
              </div>
            </div>

            {WHY_US.map((row, i) => (
              <div
                key={row.strength}
                className={`grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-0 hover:bg-[#111] transition ${
                  i !== WHY_US.length - 1 ? "border-b border-zinc-800" : ""
                }`}
              >
                <div className="md:col-span-4 px-6 py-5 flex items-start gap-3">
                  <span className="text-[#de5cff] mt-0.5 shrink-0">
                    <Icon name={row.iconKey} className="w-5 h-5" />
                  </span>
                  <span className="font-anonymous font-bold text-white text-base md:text-lg leading-snug">
                    {row.strength}
                  </span>
                </div>
                <div className="md:col-span-8 px-6 pb-5 md:py-5 font-mono-tech text-sm text-zinc-400 leading-relaxed md:border-l md:border-zinc-800">
                  {row.meaning}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CONTACT / SCOPING ===================== */}
      <section
        id="contact"
        className="bg-[#0a0a0a] border-t border-zinc-900 py-24"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left */}
          <div className="lg:col-span-5 space-y-6">
            <span className="font-mono-tech text-[11px] uppercase tracking-[0.25em] text-[#de5cff]">
              / Get In Touch
            </span>
            <h2 className="font-anonymous font-bold text-3xl md:text-4xl text-white leading-tight">
              Let&apos;s talk about your security posture.
            </h2>
            <p className="font-mono-tech text-sm md:text-base text-zinc-400 leading-relaxed">
              We&apos;d welcome the chance to walk you through how we can
              support your security posture — from a one-time assessment to an
              ongoing partnership.
            </p>

            <div className="p-6 rounded-lg bg-[#111] border border-zinc-800 space-y-4">
              <h5 className="font-anonymous font-bold text-lg text-white">
                Direct Contact
              </h5>
              <div className="space-y-3 font-mono-tech text-sm">
                <a
                  href="tel:+917309435990"
                  className="flex items-center gap-3 text-zinc-300 hover:text-[#de5cff] transition"
                >
                  <Phone className="w-4 h-4 text-[#de5cff]" /> +91 7309435990
                </a>
                <a
                  href="mailto:anmol@0daysecurity.tech?subject=0DAY%20Research%20Team%20Enquiry"
                  className="flex items-center gap-3 text-zinc-300 hover:text-[#de5cff] transition break-all"
                >
                  <Mail className="w-4 h-4 text-[#de5cff] shrink-0" />
                  anmol@0daysecurity.tech
                </a>
                <a
                  href="https://0daysecurity.tech"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-zinc-300 hover:text-[#de5cff] transition"
                >
                  <GlobeIcon className="w-4 h-4 text-[#de5cff]" />
                  0daysecurity.tech
                </a>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-[#111] border border-zinc-800 space-y-4">
              <h5 className="font-anonymous font-bold text-lg text-white">
                What happens next
              </h5>
              <ol className="space-y-3 font-mono-tech text-sm text-zinc-400 list-decimal list-inside">
                <li>We review your scope and reply within 24 hours.</li>
                <li>A short call to align on targets, timing and rules.</li>
                <li>A written scope and fixed price — no obligation.</li>
              </ol>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-7 bg-[#111] border border-zinc-800 rounded-lg p-6 md:p-9">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h3 className="font-anonymous font-bold text-2xl text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#de5cff]" /> Request
                  Scoping & Quote
                </h3>
                <span className="font-mono-tech text-[11px] text-zinc-500">
                  {selectedServices.length} selected
                </span>
              </div>

              <div>
                <label className="block font-mono-tech text-[11px] uppercase tracking-wider text-zinc-400 mb-3">
                  Services of interest
                </label>
                <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto pr-1">
                  {SERVICE_CATALOG.map((s) => {
                    const on = selectedServices.includes(s.name);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleScope(s.name)}
                        className={`px-2.5 py-1.5 rounded text-[11px] font-mono-tech transition cursor-pointer flex items-center gap-1.5 ${
                          on
                            ? "bg-[#de5cff] text-black font-semibold"
                            : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700"
                        }`}
                      >
                        {on ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Plus className="w-3 h-3" />
                        )}
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono-tech text-[11px] uppercase tracking-wider text-zinc-300 mb-2">
                    Organisation *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                    <input
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Company name"
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/90 border border-zinc-700 rounded text-sm font-mono-tech text-white focus:outline-none focus:border-[#de5cff]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-mono-tech text-[11px] uppercase tracking-wider text-zinc-300 mb-2">
                    Your name & role *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                    <input
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Priya Sharma (IT Head)"
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/90 border border-zinc-700 rounded text-sm font-mono-tech text-white focus:outline-none focus:border-[#de5cff]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono-tech text-[11px] uppercase tracking-wider text-zinc-300 mb-2">
                    Work email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/90 border border-zinc-700 rounded text-sm font-mono-tech text-white focus:outline-none focus:border-[#de5cff]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-mono-tech text-[11px] uppercase tracking-wider text-zinc-300 mb-2">
                    Phone (optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                    <input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/90 border border-zinc-700 rounded text-sm font-mono-tech text-white focus:outline-none focus:border-[#de5cff]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono-tech text-[11px] uppercase tracking-wider text-zinc-300 mb-2">
                    Engagement model
                  </label>
                  <select
                    value={engagementModel}
                    onChange={(e) => setEngagementModel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-900/90 border border-zinc-700 rounded text-sm font-mono-tech text-white focus:outline-none focus:border-[#de5cff]"
                  >
                    <option>One-time Assessment</option>
                    <option>Periodic Retainer</option>
                    <option>Ongoing vCISO Support</option>
                    <option>Managed Security Services</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono-tech text-[11px] uppercase tracking-wider text-zinc-300 mb-2">
                    Preferred timeline
                  </label>
                  <select
                    value={estimatedTimeline}
                    onChange={(e) => setEstimatedTimeline(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-900/90 border border-zinc-700 rounded text-sm font-mono-tech text-white focus:outline-none focus:border-[#de5cff]"
                  >
                    <option>Immediate (within 2 weeks)</option>
                    <option>2-4 Weeks</option>
                    <option>Next Quarter</option>
                    <option>Annual Compliance Cycle</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono-tech text-[11px] uppercase tracking-wider text-zinc-300 mb-2">
                  Objectives & target environment
                </label>
                <textarea
                  rows={3}
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  placeholder="Applications, network ranges, cloud accounts, compliance drivers, red team goals..."
                  className="w-full p-3.5 bg-zinc-900/90 border border-zinc-700 rounded text-sm font-mono-tech text-white focus:outline-none focus:border-[#de5cff]"
                />
              </div>

              {statusMessage && (
                <div
                  className={`p-4 rounded border font-mono-tech text-xs flex items-center justify-between gap-3 ${
                    statusMessage.type === "success"
                      ? "bg-emerald-950/50 border-emerald-500/50 text-emerald-300"
                      : "bg-red-950/50 border-red-500/50 text-red-300"
                  }`}
                >
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-end gap-4 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3.5 bg-[#de5cff] hover:bg-[#c000f0] text-black hover:text-white font-mono-tech font-semibold text-sm uppercase tracking-wider rounded-[3px] transition cursor-pointer flex items-center gap-2 disabled:opacity-60 shadow-[0_0_20px_rgba(222,92,255,0.3)]"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Sending..." : "Send Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="bg-black border-t border-zinc-900 pt-20 pb-10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14">
            <div className="md:col-span-5">
              <h4 className="font-anonymous font-bold text-3xl text-white mb-4">
                <span className="text-[#de5cff]">0day</span> Security
              </h4>
              <span className="font-mono-tech font-light text-lg md:text-xl leading-relaxed tracking-[-0.02em] text-zinc-300 block max-w-sm">
                Serious Security for <br />
                Serious Businesses.
                <br />
                From day zero.
              </span>
            </div>

            <div className="md:col-span-3">
              <h5 className="font-mono-tech text-[11px] uppercase tracking-wider text-zinc-500 mb-4">
                Services
              </h5>
              <ul className="space-y-2 font-mono-tech text-sm text-zinc-400">
                {SERVICE_CATEGORIES.map((c) => (
                  <li key={c.id}>
                    <a
                      href="#services"
                      onClick={() => selectCategory(c.id)}
                      className="hover:text-[#de5cff] transition flex items-center gap-1.5"
                    >
                      <ArrowRight className="w-3 h-3" />
                      {c.shortLabel}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-4">
              <h4 className="font-anonymous font-bold text-2xl uppercase tracking-[-0.02em] text-[#c000f0] mb-3">
                Get a quote
              </h4>
              <p className="font-mono-tech text-zinc-400 text-sm mb-5">
                Contact us for free scoping and a quote.
              </p>
              <div className="space-y-2">
                <a
                  href="tel:+917309435990"
                  className="block font-mono-tech font-light text-xl md:text-2xl text-white hover:text-[#de5cff] transition tracking-[-0.02em]"
                >
                  +91 7309435990
                </a>
                <a
                  href="mailto:anmol@0daysecurity.tech?subject=0DAY%20Research%20Team%20Enquiry"
                  className="block font-mono-tech font-light text-base md:text-lg text-white hover:text-[#de5cff] transition break-all"
                >
                  anmol@0daysecurity.tech
                </a>
                <a
                  href="https://0daysecurity.tech"
                  target="_blank"
                  rel="noreferrer"
                  className="block font-mono-tech text-sm text-zinc-400 hover:text-[#de5cff] transition"
                >
                  0daysecurity.tech
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-anonymous text-zinc-500 text-sm">
              &copy; 2026 0DAY Research Team. All rights reserved.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Scroll to top"
              className="w-10 h-10 rounded-full bg-zinc-900 hover:bg-[#de5cff] text-white hover:text-black flex items-center justify-center transition cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
