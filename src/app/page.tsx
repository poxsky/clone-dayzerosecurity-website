"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ArrowUpRight,
  ArrowRight,
  Check,
  Plus,
  Send,
  Mail,
  Phone,
  User,
  Building2,
  Globe,
  Terminal as TerminalIcon,
  Sparkles,
  ShieldCheck,
  Clock,
  X,
  Zap,
  FileText,
  Lock,
  Eye,
  ChevronDown,
  Copy,
  AlertTriangle,
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

interface ResearchEpisode {
  id: number;
  episodeNumber: string;
  title: string;
  track: string;
  publishedAt: string;
  duration: string;
  cveTags: string;
  summary: string;
}

const PROCESS = [
  { n: "01", title: "Scope & Threat Model", desc: "We map your real attack surface — not what your asset inventory says. 45-min call, then a one-pager scope you can forward to legal.", meta: "2-3 days", icon: "Target" },
  { n: "02", title: "Break & Validate", desc: "Manual-first. Every finding gets PoC, curl, screenshot. No scanner dumps. We chain low-sevs into critical paths your team missed.", meta: "1-4 weeks", icon: "Crosshair" },
  { n: "03", title: "Report that ships", desc: "Exec summary for board, tech steps for eng, fix diffs you can copy-paste. Delivered as PDF + Notion + retest branch.", meta: "48h after", icon: "FileText" },
  { n: "04", title: "Retest & Harden", desc: "Free retest within 30 days. We jump on a call with your devs, not just throw Jira tickets over the wall.", meta: "Included", icon: "ShieldCheck" },
];

const RESEARCH_STATIC = [
  { cve: "CVE-2024-21412", title: "Defender SmartScreen bypass → Mark-of-the-Web", vendor: "Microsoft", type: "LPE", year: "2024", bounty: "$5k", impact: "MotW bypass → RCE via .url" },
  { cve: "CVE-2023-36884", title: "Windows Search RCE chain via .search-ms", vendor: "Microsoft", type: "RCE", year: "2023", bounty: "HoF", impact: "0-click search injection" },
  { cve: "CVE-2023-27905", title: "XSS → Account Takeover in OAuth flow", vendor: "Atlassian", type: "Auth Bypass", year: "2023", bounty: "$3.2k", impact: "Tenant takeover" },
  { cve: "PRIVATE", title: "SSRF → IMDSv2 bypass in fintech IAM", vendor: "Fintech Unicorn", type: "SSRF", year: "2024", bounty: "Undisclosed", impact: "Cross-account takeover" },
];

const TESTIMONIALS = [
  { quote: "They found an IDOR → full tenant takeover that two Big4 firms missed. Report was so clear our devs fixed it same day. No fluff, just curl + fix.", author: "CTO, B2B SaaS (Series C, 180 eng)", metric: "Critical in 6h", avatar: "S" },
  { quote: "Red team felt real. Got domain admin via printer + MFA fatigue. Our SOC now has actual detections, not just alerts. Worth every rupee.", author: "CISO, NBFC (4M users)", metric: "DA in 3 days", avatar: "R" },
];

const FAQS = [
  { q: "How are you different from Big4 / large audit firms?", a: "Big4 optimizes for compliance checkboxes. We optimize for actual exploitability. Our reports are 15 pages of chained attacks, not 200 pages of scanner output. Founder-led, 6 researchers, no junior outsourcing. We also retest free — Big4 charges for it." },
  { q: "Do you outsource testing?", a: "Never. Every engagement is done by our core team in Delhi + remote. If we need specialist (e.g., hardware), we tell you upfront and bring them in as named resources." },
  { q: "What does a typical engagement cost?", a: "Web/API VAPT: ₹1.5L–4L depending on roles & endpoints. External red team: ₹6L–12L for 4-6 weeks. Retainer (quarterly VAPT + cloud + advisory): starts ₹3L/month. We give fixed quote after 30-min scoping call — no hourly surprises." },
  { q: "Do you provide compliance reports (SOC2, ISO 27001)?", a: "Yes. We map findings to ISO 27001 Annex A, SOC2 CC, PCI DSS 4.0. But we don’t do audit theatre — we tell you if a control is actually ineffective, not just missing a document." },
  { q: "NDA and data handling?", a: "Mutual NDA before any access. All data stays in India (encrypted Postgres). We delete customer data + Burp projects 30 days after retest unless you ask us to retain. No logos without written permission." },
];

export default function Page() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("vapt");
  const [activeService, setActiveService] = useState<ServiceItem | null>(SERVICE_CATALOG.find((s) => s.category === "vapt") ?? null);
  const [selectedServices, setSelectedServices] = useState<string[]>(["Web Application Penetration Testing", "API Security Testing"]);
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [objectives, setObjectives] = useState("");
  const [engagementModel, setEngagementModel] = useState("One-time Assessment");
  const [estimatedTimeline, setEstimatedTimeline] = useState("2-4 Weeks");
  const [easterEggDiscount, setEasterEggDiscount] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string; discountApplied?: boolean } | null>(null);
  const [recentQuotes, setRecentQuotes] = useState<QuoteSubmission[]>([]);
  const [showQuotesModal, setShowQuotesModal] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [researchEpisodes, setResearchEpisodes] = useState<ResearchEpisode[]>([]);
  const [activeNav, setActiveNav] = useState("top");
  const heroRef = useRef<HTMLElement>(null);

  // fetch quotes + research
  useEffect(() => {
    fetch("/api/quotes").then(r => r.json()).then(d => { if (d.quotes) setRecentQuotes(d.quotes); }).catch(()=>{});
    fetch("/api/research").then(r => r.json()).then(d => { if (d.episodes) setResearchEpisodes(d.episodes.slice(0,3)); }).catch(()=>{});
  }, []);

  // terminal effect
  useEffect(() => {
    const logs = [
      "> recon --target acme.in --deep --active",
      "[*] 47 subdomains, 3 staging envs exposed, 1 .env.bak",
      "> nuclei -l subs.txt -t cves/ -c 50",
      "[!] CVE-2023-44487 (HTTP/2 Rapid Reset) on api-staging.acme.in:443",
      "> manual --review --chain",
      "[+] IDOR /api/v2/invoices/{id} → BOLA, tenant isolation fail",
      "[+] SSRF via /export?url= → IMDSv2 bypass → role creds",
      "[+] chaining → tenant takeover → RCE on worker",
      "[✓] PoC recorded, Loom + Burp project saved",
      "> 0day --status",
      "   3 active engagements • last critical: 2h ago • retest: pending",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setTerminalLines(prev => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setTerminalLines([]);
          i = 0;
        }, 8000);
      }
    }, 280);
    return () => clearInterval(interval);
  }, [terminalLines.length === 0]);

  // scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActiveNav(e.target.id); });
    }, { threshold: 0.3 });
    ["top","services","process","research","why","contact"].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const activeCategoryMeta = SERVICE_CATEGORIES.find((c) => c.id === activeCategory) ?? SERVICE_CATEGORIES[0];
  const categoryServices = SERVICE_CATALOG.filter((s) => s.category === activeCategory);

  const toggleScope = (name: string) =>
    setSelectedServices((prev) => prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]);

  const selectCategory = (id: CategoryId) => {
    setActiveCategory(id);
    const first = SERVICE_CATALOG.find((s) => s.category === id);
    if (first) setActiveService(first);
  };

  const claimDiscount = () => {
    setEasterEggDiscount(true);
    if (!objectives.includes("HTML comment")) {
      setObjectives((prev) => (prev ? prev + "\n" : "") + 'Claiming 5% off: "the discount from the website HTML comment or something".');
    }
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
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
          companyName, contactName, contactEmail, contactPhone,
          selectedTab: `${activeCategoryMeta.shortLabel} · ${engagementModel}`,
          selectedServices, objectives, easterEggDiscount, estimatedTimeline,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMessage({ type: "error", text: data.error || "Failed to submit. Check fields." });
      } else {
        setStatusMessage({ type: "success", text: data.message, discountApplied: data.discountApplied });
        const updated = await fetch("/api/quotes").then(r => r.json());
        if (updated.quotes) setRecentQuotes(updated.quotes);
        setCompanyName(""); setContactName(""); setContactEmail(""); setContactPhone(""); setObjectives("");
      }
    } catch {
      setStatusMessage({ type: "error", text: "Network error. Try again or email us directly." });
    } finally { setSubmitting(false); }
  };

  const copyPoC = () => {
    navigator.clipboard.writeText("curl -H 'Authorization: Bearer <token>' https://api.target.com/v2/invoices/1234 -- insecure direct object ref");
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-[#e8e8e6] relative">
      {/* easter egg */}
      <div dangerouslySetInnerHTML={{ __html: `<!--
  0day Security likes technical clients who are a little curious.
  Mention "the discount from the website HTML comment or something" and get 5% off your quote.
  Also, we break applications; we don't write them. Please forgive the spaghetti HTML.
  Cheers, Anmol — anmol@anmol.reseracher.com
-->`}} />

      <div className="pointer-events-none fixed inset-0 grid-bg opacity-[0.32] z-0" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#de5cff]/50 to-transparent z-50" />

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#08080a]/85 border-b border-white/[0.06]">
        <div className="max-w-[1480px] mx-auto px-5 md:px-8 h-[64px] flex items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <a href="#top" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-anonymous font-bold text-[16px] tracking-tighter group-hover:bg-[#de5cff] transition">0d</div>
              <span className="font-anonymous font-bold text-[19px] tracking-tight">0day Security</span>
              <span className="hidden xl:inline-flex ml-3 px-2 py-0.5 bg-[#de5cff]/10 border border-[#de5cff]/20 text-[#de5cff] font-mono-tech text-[10px] uppercase tracking-widest">EST. 2021 // DELHI + REMOTE</span>
            </a>
            <nav className="hidden lg:flex items-center gap-1 font-mono-tech text-[12px] uppercase tracking-widest">
              {[
                { id: "services", label: "Services" },
                { id: "process", label: "Process" },
                { id: "research", label: "Research" },
                { id: "why", label: "Why Us" },
              ].map((item) => (
                <a key={item.id} href={`#${item.id}`} className={`px-3 py-1.5 border transition ${activeNav === item.id ? "bg-white text-black border-white" : "text-zinc-400 border-transparent hover:text-white hover:border-white/10"}`}>{item.label}</a>
              ))}
              <button onClick={() => setShowQuotesModal(true)} className="ml-2 px-2.5 py-1 bg-white/5 border border-white/10 text-zinc-500 hover:text-white transition">Portal [{recentQuotes.length}]</button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#111113] border border-white/10 font-mono-tech text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-zinc-200">3 active</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">last finding 2h ago</span>
            </div>
            <a href="#contact" className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-white text-black font-mono-tech text-[12px] uppercase tracking-wider font-bold hover:bg-[#de5cff] transition">
              Get scoped <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <button aria-label="Menu" onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden w-9 h-9 bg-[#111] border border-white/10 flex items-center justify-center">
              <div className="w-4 flex flex-col gap-1"><span className="h-0.5 bg-white block" /><span className="h-0.5 bg-white block w-3/4" /></div>
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="lg:hidden border-t border-white/10 bg-[#0f0f10] px-5 py-5 space-y-1 font-mono-tech text-[13px] uppercase tracking-widest">
            {["services","process","research","why","contact"].map(id => (
              <a key={id} href={`#${id}`} onClick={() => setMobileMenu(false)} className="flex items-center justify-between py-3 border-b border-white/5 text-zinc-300"><span>{id}</span><ArrowRight className="w-3 h-3" /></a>
            ))}
            <a href="#contact" className="mt-3 inline-flex px-4 py-2.5 bg-white text-black font-bold">Get scoped →</a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="top" ref={heroRef} className="relative overflow-hidden border-b border-white/5">
        <PurpleFluidCanvas />
        <div className="scanline" />
        <div className="relative z-10 max-w-[1480px] mx-auto px-5 md:px-8 pt-12 md:pt-20 pb-12 grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#de5cff] text-black font-mono-tech text-[10px] font-bold uppercase tracking-widest mb-6">
              <Zap className="w-3 h-3" /> Offensive Security Lab • Manual-First • No Scanner Spam
            </div>

            <h1 className="font-anonymous font-bold text-[40px] md:text-[76px] lg:text-[88px] leading-[0.9] tracking-[-0.04em] text-[#f5f3ef]">
              We <span className="hand-underline">break in</span><br />
              before<br />
              <span className="text-[#de5cff]">they do.</span>
            </h1>

            <div className="mt-6 flex gap-4 items-start max-w-[60ch]">
              <div className="hidden md:block w-px h-24 bg-gradient-to-b from-[#de5cff] to-transparent mt-1 shrink-0" />
              <div className="space-y-3">
                <p className="font-mono-tech text-[14px] md:text-[16px] leading-[1.65] text-zinc-200">
                  Boutique team of exploit writers & AppSec nerds. Hall of Fame + CVE credited. We manually validate every finding, chain low-sevs into criticals, and write reports your devs <em className="text-white not-italic underline decoration-[#de5cff]/50">actually want to read.</em>
                </p>
                <p className="font-mono-tech text-[11px] leading-relaxed text-zinc-500 flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#de5cff] rounded-full" /> No scanner spam • No 200-page PDFs • Free retest within 30 days
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#services" className="px-6 py-3.5 bg-[#f5f3ef] text-black font-mono-tech text-[13px] uppercase tracking-wider font-bold hover:bg-[#de5cff] transition flex items-center gap-2">
                Explore services <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#contact" className="px-6 py-3.5 bg-transparent border border-white/20 text-white font-mono-tech text-[13px] uppercase tracking-wider hover:border-white/40 hover:bg-white/[0.04] transition">
                Free scoping call — 24h response
              </a>
              <span className="font-mono-tech text-[11px] text-zinc-500 ml-1 hidden md:inline-flex items-center gap-1.5"><span className="w-3 h-px bg-zinc-600" /> avg. first finding in 6 hours</span>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-px bg-white/10 border border-white/10 max-w-[560px]">
              {[
                { k: "25+", v: "Assessment types", sub: "VAPT → red team" },
                { k: "Manual", v: "Validation", sub: "0 false positives" },
                { k: "CVE", v: "Credited", sub: "12+ CVEs, 30+ HoFs" },
              ].map((s) => (
                <div key={s.k} className="bg-[#0e0e10] p-4">
                  <div className="font-anonymous font-bold text-[20px] text-white">{s.k}</div>
                  <div className="font-mono-tech text-[11px] uppercase tracking-wider text-zinc-300 mt-1">{s.v}</div>
                  <div className="font-mono-tech text-[10px] text-zinc-500 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 relative max-w-[400px] rotate-[-1deg]">
              <div className="tape -top-3 left-6" />
              <div className="bg-[#f6f3ee] text-[#111] p-4 font-mono-tech text-[11px] leading-relaxed shadow-[4px_6px_0_rgba(0,0,0,0.5)] border border-black/10">
                <span className="font-bold">P.S. from Anmol:</span> If you’re technical, view-source. There’s a 5% discount hidden in the HTML comment. We like curious clients. <span className="italic opacity-70">— handwritten</span>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="bg-[#0a0a0b] border border-white/[0.08] rounded-[4px] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
              <div className="h-9 flex items-center justify-between px-4 border-b border-white/[0.06] bg-[#111113]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500/80" /><span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" /><span className="w-2.5 h-2.5 rounded-full bg-green-500/80" /></div>
                  <span className="ml-3 font-mono-tech text-[11px] text-zinc-500">anmol@0day: ~/engagements/acme — zsh</span>
                </div>
                <div className="flex items-center gap-2 font-mono-tech text-[10px] text-zinc-600"><span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> LIVE</div>
              </div>
              <div className="p-4 font-mono-tech text-[11.5px] leading-[1.7] min-h-[280px] bg-[#0a0a0b]">
                {terminalLines.map((l, i) => (
                  <div key={i} className={`${l.startsWith("[!]") ? "text-amber-300" : l.startsWith("[+]") || l.startsWith("[✓]") ? "text-emerald-300" : l.startsWith(">") ? "text-zinc-100" : "text-zinc-500"} flex gap-2`}>
                    <span className="opacity-30 select-none">{String(i+1).padStart(2,"0")}</span><span>{l}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1 text-zinc-100 mt-2"><span className="text-[#de5cff]">$</span> <span className="w-2 h-4 bg-white/80 inline-block animate-[terminal-cursor_1s_steps(2)_infinite]" /></div>
              </div>
              <div className="px-4 py-2.5 bg-[#de5cff]/10 border-t border-[#de5cff]/20 flex items-center justify-between font-mono-tech text-[10px] uppercase tracking-widest">
                <span className="text-[#de5cff] flex items-center gap-1.5"><Eye className="w-3 h-3" /> Bypassed: WAF • EDR • MFA fatigue</span>
                <button onClick={copyPoC} className="flex items-center gap-1 text-zinc-500 hover:text-white transition"><Copy className="w-3 h-3" /> Copy PoC</button>
              </div>
            </div>

            <div className="relative bg-[#f6f3ee] text-[#121212] p-5 border border-black/10 rotate-[0.8deg] shadow-[8px_10px_0_rgba(0,0,0,0.4)]">
              <div className="tape -top-3 right-10 rotate-[12deg] bg-black/10" />
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-1 bg-black text-white font-mono-tech text-[10px] uppercase tracking-widest">Confidential • Draft Report</span>
                <span className="font-mono-tech text-[10px] text-zinc-500">v2.4 • 12 findings • 2 critical chained</span>
              </div>
              <h4 className="font-anonymous font-bold text-[18px] leading-tight">Acme Financial — External Red Team</h4>
              <div className="mt-3 space-y-2 font-mono-tech text-[11px]">
                <div className="flex justify-between border-b border-black/10 py-1.5"><span className="text-zinc-500">Critical</span><span className="font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-red-600" />2 chained → DA</span></div>
                <div className="flex justify-between border-b border-black/10 py-1.5"><span className="text-zinc-500">High</span><span>4 (SSRF, IDOR, RCE, AuthZ)</span></div>
                <div className="flex justify-between py-1.5"><span className="text-zinc-500">Fix SLA</span><span className="px-1.5 py-0.5 bg-emerald-600 text-white text-[10px] font-bold">48h retest included</span></div>
              </div>
              <div className="mt-4 flex items-center gap-2 font-mono-tech text-[10px] text-zinc-500">
                <FileText className="w-3.5 h-3.5" /> PDF + Notion + Burp project • signed by Anmol • 2026-03-12
              </div>
            </div>

            <div className="flex items-center gap-3 px-1 font-mono-tech text-[11px] text-zinc-500">
              <Lock className="w-3.5 h-3.5" /> NDA-first. We never logo-drop without permission. Ever.
            </div>
          </div>
        </div>

        <div className="relative z-10 border-y border-white/[0.06] bg-[#0c0c0e] overflow-hidden">
          <div className="flex marquee-track whitespace-nowrap">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex items-center gap-10 px-6 py-3 font-mono-tech text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                <span className="text-zinc-300">Fintech •</span> <span>HealthTech •</span> <span className="text-zinc-300">B2B SaaS •</span> <span>NBFC •</span> <span className="text-zinc-300">E-commerce •</span> <span>Series A → Unicorn •</span> <span className="text-zinc-300">SOC 2 • ISO 27001 • DPDP • GDPR •</span>
                <span>Trusted by security-minded teams — not by everyone.</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="relative z-10 max-w-[1480px] mx-auto px-5 md:px-8 py-20 grid grid-cols-12 gap-10 border-b border-white/5">
        <div className="col-span-12 md:col-span-4">
          <div className="sticky top-24 space-y-6">
            <span className="font-mono-tech text-[11px] uppercase tracking-[0.25em] text-[#de5cff]">/ Who we are</span>
            <h2 className="font-anonymous font-bold text-[34px] md:text-[44px] leading-[0.95] tracking-tight text-[#f5f3ef]">
              Small team.<br />Deep work.<br /><span className="text-zinc-500">No outsourcing.</span>
            </h2>
            <div className="w-12 h-px bg-[#de5cff]" />
            <div className="font-mono-tech text-[12px] leading-relaxed text-zinc-500 space-y-2">
              <p>We’re not a 200-person audit factory.</p>
              <p>We’re 6 researchers who still write exploits on weekends.</p>
              <p className="text-zinc-400 pt-2">Founder: Anmol — HoF @ Microsoft, Atlassian. CVE credits, HackerOne top 1%. Still codes.</p>
            </div>
            <div className="flex gap-2 pt-2">
              <span className="px-2 py-1 bg-white/5 border border-white/10 font-mono-tech text-[10px] uppercase tracking-widest text-zinc-400">Delhi</span>
              <span className="px-2 py-1 bg-white/5 border border-white/10 font-mono-tech text-[10px] uppercase tracking-widest text-zinc-400">Remote</span>
              <span className="px-2 py-1 bg-[#de5cff]/10 border border-[#de5cff]/20 font-mono-tech text-[10px] uppercase tracking-widest text-[#de5cff]">Est. 2021</span>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-8 space-y-10">
          <div className="grid grid-cols-12 gap-6">
            <p className="col-span-12 lg:col-span-7 font-mono-tech text-[14px] leading-[1.7] text-zinc-200">
              <span className="text-white font-medium">0day Security</span> started as a bug bounty crew in Delhi. We kept getting Hall of Fame mails, then founders started asking: “Can you do this for us, properly?” So we productized the way we already hunted — manual, curious, a bit obsessive. No sales team. You talk to the person who will hack you.
            </p>
            <div className="col-span-12 lg:col-span-5 bg-[#111113] border border-white/10 p-4 font-mono-tech text-[12px] leading-relaxed text-zinc-400">
              <div className="flex items-center gap-2 text-white font-bold mb-2"><ShieldCheck className="w-4 h-4 text-[#de5cff]" /> What we won’t do</div>
              We don’t sell you a scanner report. We don’t outsource to juniors. We don’t ghost after delivery. If we miss something critical, we retest free. Simple. Written in our SOW.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Research-led", body: "CVE & HoF credited. We publish technique, not just CVEs. Our recon tooling is open-sourced after 6 months. Keeps us sharp.", tape: "-rotate-2" },
              { title: "Manual-first", body: "Automated for coverage, manual for impact. Every high/critical is exploited live, recorded, and chained into business impact.", tape: "rotate-1" },
              { title: "Builder-friendly", body: "Reports with curl, fix diffs, and a Loom. We join your Slack for 7 days post-delivery. No ticket ping-pong.", tape: "-rotate-1" },
            ].map((c) => (
              <div key={c.title} className={`relative bg-[#f6f3ee] text-[#111] p-5 border border-black/10 shadow-[4px_4px_0_rgba(0,0,0,0.3)] ${c.tape} hover:rotate-0 transition-transform`}>
                <div className="tape -top-2 left-4 bg-black/10" />
                <div className="font-anonymous font-bold text-[16px]">{c.title}</div>
                <div className="font-mono-tech text-[11px] leading-[1.6] text-zinc-700 mt-2">{c.body}</div>
                <div className="mt-4 font-mono-tech text-[10px] uppercase tracking-widest text-zinc-500">— signed, team</div>
              </div>
            ))}
          </div>

          <div className="bg-[#0e0e10] border border-white/10 p-5 grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4 font-mono-tech text-[11px] uppercase tracking-widest text-zinc-500">Compliance that matters</div>
            <div className="col-span-12 md:col-span-8 flex flex-wrap gap-2">
              {["ISO 27001","SOC 2 Type II","PCI DSS 4.0","GDPR","DPDP Act","RBI/CERT-In","OWASP ASVS","PTES"].map(t => (
                <span key={t} className="px-2.5 py-1 bg-white/5 border border-white/10 text-zinc-300 font-mono-tech text-[11px]">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="relative z-10 bg-[#0a0a0b] border-b border-white/5">
        <div className="max-w-[1480px] mx-auto px-5 md:px-8 py-20">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <span className="font-mono-tech text-[11px] uppercase tracking-[0.25em] text-[#de5cff]">/ Services — index 06 • fixed quotes</span>
              <h2 className="font-anonymous font-bold text-[32px] md:text-[52px] leading-[0.9] mt-3">Six ways we break things,<br /><span className="text-zinc-500">so attackers can’t.</span></h2>
            </div>
            <div className="font-mono-tech text-[11px] text-zinc-500 max-w-[38ch] leading-relaxed border-l border-white/10 pl-4">
              Pick a lane. We’ll scope it in 24h. Mix-and-match — most clients start with VAPT + Cloud, then add red teaming quarterly. Fixed price, no hourly billing.
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto pb-2 border-b border-white/10 scrollbar-thin">
            {SERVICE_CATEGORIES.map((cat) => {
              const active = cat.id === activeCategory;
              return (
                <button key={cat.id} onClick={() => selectCategory(cat.id)}
                  className={`shrink-0 px-4 py-2.5 font-mono-tech text-[12px] uppercase tracking-wider border flex items-center gap-2 transition ${active ? "bg-[#f5f3ef] text-black border-[#f5f3ef] font-bold" : "bg-[#111113] text-zinc-400 border-white/10 hover:text-white hover:border-white/20"}`}>
                  <span className={`text-[10px] ${active ? "text-zinc-500" : "text-zinc-600"}`}>{cat.index}</span> {cat.shortLabel}
                  {active && <span className="ml-2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-12 gap-8 mt-8">
            <div className="col-span-12 lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between font-mono-tech text-[11px] uppercase tracking-widest text-zinc-500 mb-2">
                <span>{activeCategoryMeta.headline} — {categoryServices.length} offerings</span>
                <span className="text-zinc-600">{activeCategoryMeta.index} / 06</span>
              </div>
              <p className="font-mono-tech text-[12px] leading-relaxed text-zinc-400 mb-5 border-l-2 border-[#de5cff]/40 pl-4">{activeCategoryMeta.blurb}</p>

              {categoryServices.map((item) => {
                const inScope = selectedServices.includes(item.name);
                const isActive = activeService?.id === item.id;
                return (
                  <div key={item.id} onClick={() => setActiveService(item)}
                    className={`group cursor-pointer border p-4 flex gap-4 transition ${isActive ? "bg-white text-black border-white shadow-[4px_4px_0_rgba(222,92,255,0.3)]" : "bg-[#111113] border-white/10 hover:border-white/20 hover:bg-[#151517]"}`}>
                    <div className={`mt-0.5 ${isActive ? "text-black" : "text-[#de5cff]"}`}><Icon name={item.iconKey} className="w-5 h-5" /></div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-mono-tech text-[13px] leading-tight font-medium ${isActive ? "text-black" : "text-white"}`}>{item.name}</div>
                      <div className={`font-mono-tech text-[11px] mt-1 flex items-center gap-2 ${isActive ? "text-zinc-600" : "text-zinc-500"}`}><Clock className="w-3 h-3" /> {item.typicalDuration} <span className="opacity-50">•</span> {item.deliverables.length} deliverables</div>
                    </div>
                    <button aria-label="Toggle scope" onClick={(e) => { e.stopPropagation(); toggleScope(item.name); }}
                      className={`shrink-0 w-7 h-7 border flex items-center justify-center transition ${inScope ? "bg-black text-white border-black" : isActive ? "bg-black/10 border-black/20 text-black hover:bg-black hover:text-white" : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"}`}>
                      {inScope ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="col-span-12 lg:col-span-7">
              <div className="sticky top-24 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeCategoryMeta.highlights.map((h) => (
                    <div key={h.title} className="bg-[#f6f3ee] text-[#111] p-4 border border-black/10 hover:shadow-[3px_3px_0_rgba(0,0,0,0.2)] transition">
                      <div className="flex items-center gap-2 font-anonymous font-bold text-[14px]"><span className="w-6 h-6 bg-black text-white flex items-center justify-center"><Icon name={h.iconKey} className="w-3.5 h-3.5" /></span>{h.title}</div>
                      <div className="font-mono-tech text-[11px] leading-relaxed text-zinc-700 mt-2">{h.body}</div>
                    </div>
                  ))}
                </div>

                {activeService && (
                  <div className="bg-[#111113] border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2 py-1 bg-[#de5cff] text-black font-mono-tech text-[10px] font-bold uppercase tracking-widest">Scope Detail // {activeService.id}</span>
                      <span className="font-mono-tech text-[11px] text-zinc-500 flex items-center gap-1.5"><Clock className="w-3 h-3" />{activeService.typicalDuration}</span>
                    </div>
                    <h3 className="font-anonymous font-bold text-[22px] leading-tight text-white">{activeService.name}</h3>
                    <p className="font-mono-tech text-[12px] leading-relaxed text-zinc-400 mt-3 border-l border-white/10 pl-3">{activeService.methodology}</p>

                    <div className="mt-5 grid grid-cols-12 gap-4">
                      <div className="col-span-12 md:col-span-7">
                        <div className="font-mono-tech text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Deliverables • what you get</div>
                        <div className="space-y-1.5">
                          {activeService.deliverables.map((d) => (
                            <div key={d} className="flex items-start gap-2 font-mono-tech text-[12px] text-zinc-300"><span className="text-[#de5cff] mt-1">↳</span>{d}</div>
                          ))}
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-5 bg-black/40 border border-white/5 p-3">
                        <div className="font-mono-tech text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Included</div>
                        <div className="space-y-2 font-mono-tech text-[11px] text-zinc-400">
                          <div className="flex gap-1.5"><Check className="w-3 h-3 text-emerald-400 mt-0.5" /> Burp project + PoC videos</div>
                          <div className="flex gap-1.5"><Check className="w-3 h-3 text-emerald-400 mt-0.5" /> Fix diffs (copy-paste)</div>
                          <div className="flex gap-1.5"><Check className="w-3 h-3 text-emerald-400 mt-0.5" /> Free retest 30d</div>
                          <div className="flex gap-1.5"><Check className="w-3 h-3 text-emerald-400 mt-0.5" /> Slack access 7d</div>
                        </div>
                        <button onClick={() => toggleScope(activeService.name)}
                          className={`w-full mt-4 py-2.5 font-mono-tech text-[11px] uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition ${selectedServices.includes(activeService.name) ? "bg-emerald-500 text-black" : "bg-white text-black hover:bg-[#de5cff]"}`}>
                          {selectedServices.includes(activeService.name) ? <><Check className="w-3.5 h-3.5" /> In scope</> : <><Plus className="w-3.5 h-3.5" /> Add to scope</>}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-[#de5cff]/10 border border-[#de5cff]/20 p-3 flex items-center justify-between font-mono-tech text-[11px]">
                  <span className="text-[#de5cff]">{selectedServices.length} services selected — bundled quote same day</span>
                  <a href="#contact" className="px-3 py-1 bg-[#de5cff] text-black font-bold uppercase tracking-wider hover:bg-white transition">Scope now →</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="relative z-10 max-w-[1480px] mx-auto px-5 md:px-8 py-20 border-b border-white/5">
        <div className="flex items-center gap-3 mb-10">
          <span className="font-mono-tech text-[11px] uppercase tracking-[0.25em] text-[#de5cff]">/ Process</span>
          <div className="h-px flex-1 bg-white/10" />
          <span className="font-mono-tech text-[11px] text-zinc-500">How we work — no black box, daily updates</span>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <h2 className="font-anonymous font-bold text-[32px] leading-[0.95]">From scope<br />to retest in<br /><span className="text-zinc-500">2 weeks avg.</span></h2>
            <p className="font-mono-tech text-[13px] leading-relaxed text-zinc-400 mt-4 max-w-[36ch]">We over-communicate. Daily Slack updates, Loom walkthroughs, and a live Notion tracker. You always know where we are. No “we’ll get back to you”.</p>
            <div className="mt-6 p-3 bg-[#111113] border border-white/10 font-mono-tech text-[11px] text-zinc-500">Avg: First critical in 6h • Report in 48h • Retest in 24h</div>
          </div>
          <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
            {PROCESS.map((p) => (
              <div key={p.n} className="bg-[#0e0e10] p-5 flex flex-col group hover:bg-[#141416] transition">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-anonymous font-bold text-[28px] text-[#de5cff] group-hover:text-white transition">{p.n}</span>
                  <span className="px-2 py-0.5 bg-white/5 border border-white/10 font-mono-tech text-[10px] uppercase tracking-widest text-zinc-400">{p.meta}</span>
                </div>
                <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:bg-[#de5cff] group-hover:text-black transition mb-4"><Icon name={p.icon} className="w-4 h-4" /></div>
                <div className="font-anonymous font-bold text-[16px] leading-tight text-white">{p.title}</div>
                <div className="font-mono-tech text-[11px] leading-relaxed text-zinc-400 mt-3 flex-1">{p.desc}</div>
                <div className="mt-6 font-mono-tech text-[10px] text-zinc-600">— step {p.n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESEARCH */}
      <section id="research" className="relative z-10 bg-[#f6f3ee] text-[#111] border-b border-black/10">
        <div className="max-w-[1480px] mx-auto px-5 md:px-8 py-16 grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-5">
            <span className="font-mono-tech text-[11px] uppercase tracking-[0.2em] text-zinc-500">/ Research Lab • CVE & HoF</span>
            <h2 className="font-anonymous font-bold text-[34px] leading-[0.9] mt-3">We find bugs on weekends. <br /><span className="text-zinc-500">For fun.</span></h2>
            <div className="mt-6 p-4 bg-black text-white font-mono-tech text-[12px] leading-relaxed border border-black">
              <div className="flex items-center gap-2 font-bold mb-2"><TerminalIcon className="w-4 h-4 text-[#de5cff]" /> Hall of Fame & CVEs — why it matters</div>
              Microsoft, Atlassian, Adobe, HackerOne top 1% — we keep hunting so our client work stays sharp. Tools get stale. Curiosity doesn’t. Our recon stack is open-sourced after 6 months.
            </div>
            {researchEpisodes.length > 0 && (
              <div className="mt-6 space-y-3">
                <div className="font-mono-tech text-[11px] uppercase tracking-widest text-zinc-500">Latest lab notes • from DB</div>
                {researchEpisodes.map(ep => (
                  <div key={ep.id} className="bg-white border border-black/10 p-3">
                    <div className="flex items-center gap-2"><span className="px-1.5 py-0.5 bg-black text-white font-mono-tech text-[10px]">{ep.episodeNumber}</span><span className="font-mono-tech text-[10px] text-zinc-500">{ep.track} • {ep.duration}</span></div>
                    <div className="font-anonymous font-bold text-[13px] mt-2 leading-tight">{ep.title}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="col-span-12 md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RESEARCH_STATIC.map((r) => (
              <div key={r.cve} className="bg-white border border-black/10 p-4 shadow-[3px_3px_0_rgba(0,0,0,0.1)] hover:shadow-[5px_5px_0_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-black text-white font-mono-tech text-[10px] font-bold tracking-widest">{r.cve}</span>
                  <span className="font-mono-tech text-[10px] text-zinc-500">{r.year} • {r.type} • {r.bounty}</span>
                </div>
                <div className="font-anonymous font-bold text-[14px] mt-3 leading-tight">{r.title}</div>
                <div className="font-mono-tech text-[11px] text-zinc-600 mt-1">{r.vendor}</div>
                <div className="mt-3 h-px bg-black/10" />
                <div className="mt-2 font-mono-tech text-[10px] uppercase tracking-widest text-zinc-500 flex items-center gap-1"><Zap className="w-3 h-3" />{r.impact}</div>
              </div>
            ))}
            <div className="sm:col-span-2 bg-black text-white p-4 flex items-center justify-between font-mono-tech border border-black">
              <span className="text-[11px] uppercase tracking-widest">12+ CVEs • 30+ HoFs • Full list on scoping call</span>
              <ArrowUpRight className="w-4 h-4 text-[#de5cff]" />
            </div>
          </div>
        </div>
      </section>

      {/* WHY US + TESTIMONIALS */}
      <section id="why" className="relative z-10 max-w-[1480px] mx-auto px-5 md:px-8 py-20 border-b border-white/5">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono-tech text-[11px] uppercase tracking-[0.25em] text-[#de5cff]">/ Why teams pick us</span>
            <h2 className="font-anonymous font-bold text-[34px] leading-[0.9] mt-3">Not the cheapest.<br /><span className="text-zinc-500">The most thorough.</span></h2>

            <div className="mt-8 space-y-4">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="bg-[#111113] border border-white/10 p-5 relative hover:border-white/20 transition">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#de5cff] text-black flex items-center justify-center font-anonymous font-bold shrink-0">{t.avatar}</div>
                    <div className="font-mono-tech text-[13px] leading-relaxed text-zinc-200">“{t.quote}”</div>
                  </div>
                  <div className="mt-4 flex items-center justify-between pl-11">
                    <span className="font-mono-tech text-[11px] text-zinc-500">{t.author}</span>
                    <span className="px-2 py-0.5 bg-[#de5cff]/20 border border-[#de5cff]/30 text-[#de5cff] font-mono-tech text-[10px] font-bold uppercase">{t.metric}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-[#f6f3ee] text-[#111] p-4 border border-black/10 flex gap-4 items-start rotate-[-0.5deg]">
              <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-anonymous font-bold shrink-0">!</div>
              <div className="font-mono-tech text-[11px] leading-relaxed">
                <span className="font-bold">Redacted for privacy:</span> We don’t publish client logos without explicit written permission. Most work is under NDA. We’ll share anonymized case studies on the scoping call — with numbers, not fluff. <span className="bg-black text-white px-1">We take confidentiality seriously.</span>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <div className="border border-white/10 overflow-hidden">
              <div className="grid grid-cols-12 bg-[#111113] border-b border-white/10 font-mono-tech text-[11px] uppercase tracking-widest text-zinc-500">
                <div className="col-span-5 px-5 py-3">Strength</div>
                <div className="col-span-7 px-5 py-3 border-l border-white/10">What it means for you</div>
              </div>
              {WHY_US.map((row, idx) => (
                <div key={row.strength} className={`grid grid-cols-12 hover:bg-[#111113] transition ${idx !== WHY_US.length - 1 ? "border-b border-white/10" : ""}`}>
                  <div className="col-span-12 md:col-span-5 px-5 py-4 flex gap-3">
                    <span className="text-[#de5cff]"><Icon name={row.iconKey} className="w-4 h-4 mt-0.5" /></span>
                    <span className="font-anonymous font-bold text-[14px] leading-tight text-white">{row.strength}</span>
                  </div>
                  <div className="col-span-12 md:col-span-7 px-5 pb-4 md:py-4 font-mono-tech text-[12px] leading-relaxed text-zinc-400 md:border-l border-white/10">{row.meaning}</div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div className="mt-8">
              <div className="font-mono-tech text-[11px] uppercase tracking-[0.25em] text-[#de5cff] mb-4">/ FAQ • real questions from founders</div>
              <div className="border border-white/10 divide-y divide-white/10">
                {FAQS.map((f, i) => (
                  <div key={i} className="bg-[#0e0e10]">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left hover:bg-[#151517] transition">
                      <span className="font-mono-tech text-[13px] text-white pr-4">{f.q}</span>
                      <ChevronDown className={`w-4 h-4 text-zinc-500 shrink-0 transition ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === i && <div className="px-4 pb-4 font-mono-tech text-[12px] leading-relaxed text-zinc-400">{f.a}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative z-10 bg-[#0c0c0e] border-b border-white/5">
        <div className="max-w-[1480px] mx-auto px-5 md:px-8 py-20 grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <span className="font-mono-tech text-[11px] uppercase tracking-[0.25em] text-[#de5cff]">/ Get scoped — 24h response • founder replies</span>
            <h2 className="font-anonymous font-bold text-[32px] md:text-[42px] leading-[0.95]">Let’s talk about<br />your attack surface.</h2>
            <p className="font-mono-tech text-[13px] leading-relaxed text-zinc-400 max-w-[42ch]">30-min call, map your real risks, send a one-pager scope + fixed quote. No sales deck. Just technical talk with the person who will test you.</p>

            <div className="bg-[#111113] border border-white/10 p-5 space-y-4">
              <div className="font-anonymous font-bold text-[16px] text-white flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />Direct — skip the form</div>
              <div className="space-y-2.5 font-mono-tech text-[13px]">
                <a href="tel:+917309435990" className="flex items-center gap-2.5 text-zinc-300 hover:text-[#de5cff] transition"><Phone className="w-4 h-4 text-[#de5cff]" /> +91 7309435990 • 3h avg response</a>
                <a href="mailto:contact@anmol.reseracher.com" className="flex items-center gap-2.5 text-zinc-300 hover:text-[#de5cff] transition break-all"><Mail className="w-4 h-4 text-[#de5cff]" /> contact@anmol.reseracher.com</a>
                <a href="https://anmol.reseracher.com" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-zinc-500 hover:text-white transition"><Globe className="w-4 h-4" /> anmol.reseracher.com • research</a>
              </div>
              <div className="pt-3 border-t border-white/5 font-mono-tech text-[11px] text-zinc-500">Founder replies personally. No SDR, no Calendly spam. If urgent, call.</div>
            </div>

            <div className="relative bg-[#de5cff] text-black p-4 rotate-[-0.6deg] shadow-[6px_6px_0_rgba(0,0,0,0.4)]">
              <div className="flex items-center justify-between">
                <span className="font-mono-tech text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Curious? View-source → 5% off</span>
                <span className="px-2 py-0.5 bg-black text-[#de5cff] font-mono-tech font-bold text-[10px]">5% OFF</span>
              </div>
              <p className="font-mono-tech text-[12px] leading-relaxed mt-2">Hidden comment in HTML. Mention it, get 5% off. We like clients who poke around.</p>
              <button onClick={claimDiscount} className="mt-3 w-full py-2 bg-black text-white font-mono-tech text-[11px] uppercase tracking-widest font-bold hover:bg-white hover:text-black transition">{easterEggDiscount ? "✓ Discount applied — scroll to form" : "Claim 5% — I found it"}</button>
            </div>

            <div className="font-mono-tech text-[11px] text-zinc-600 leading-relaxed max-w-[38ch] border-l border-white/10 pl-3">
              P.S. We read every submission. If you include a target URL or tech stack, we’ll come prepared with initial recon on the call. — Anmol
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <div className="bg-[#f6f3ee] text-[#111] border border-black/10 shadow-[10px_10px_0_rgba(0,0,0,0.5)]">
              <div className="px-6 py-4 border-b border-black/10 flex items-center justify-between bg-white">
                <h3 className="font-anonymous font-bold text-[17px] flex items-center gap-2"><TerminalIcon className="w-4 h-4" /> Briefing Dossier // Scoping Request</h3>
                <span className="font-mono-tech text-[10px] uppercase tracking-widest text-zinc-500">{selectedServices.length} in scope • CLASSIFIED • 24h SLA</span>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="font-mono-tech text-[11px] uppercase tracking-widest text-zinc-600 mb-2 block">Services of interest — click to toggle (selected: {selectedServices.length})</label>
                  <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1 p-1 bg-white border border-black/10">
                    {SERVICE_CATALOG.map((s) => {
                      const on = selectedServices.includes(s.name);
                      return (
                        <button key={s.id} type="button" onClick={() => toggleScope(s.name)}
                          className={`px-2.5 py-1 border font-mono-tech text-[11px] transition ${on ? "bg-black text-white border-black" : "bg-[#f6f3ee] text-zinc-600 border-black/10 hover:border-black/30 hover:text-black"}`}>
                          {on ? "✓ " : "+ "}{s.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono-tech text-[11px] uppercase tracking-widest text-zinc-700 mb-1.5 block">Organisation *</label>
                    <div className="relative"><Building2 className="w-4 h-4 text-zinc-400 absolute left-3 top-3" /><input required value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Pvt Ltd" className="w-full pl-9 pr-3 py-2.5 bg-white border border-black/15 text-[13px] font-mono-tech focus:outline-none focus:border-black focus:ring-1 focus:ring-black" /></div>
                  </div>
                  <div>
                    <label className="font-mono-tech text-[11px] uppercase tracking-widest text-zinc-700 mb-1.5 block">Your name & role *</label>
                    <div className="relative"><User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" /><input required value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Priya — CISO" className="w-full pl-9 pr-3 py-2.5 bg-white border border-black/15 text-[13px] font-mono-tech focus:outline-none focus:border-black focus:ring-1 focus:ring-black" /></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono-tech text-[11px] uppercase tracking-widest text-zinc-700 mb-1.5 block">Work email *</label>
                    <div className="relative"><Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" /><input type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="you@company.com" className="w-full pl-9 pr-3 py-2.5 bg-white border border-black/15 text-[13px] font-mono-tech focus:outline-none focus:border-black focus:ring-1 focus:ring-black" /></div>
                  </div>
                  <div>
                    <label className="font-mono-tech text-[11px] uppercase tracking-widest text-zinc-700 mb-1.5 block">Phone (optional)</label>
                    <div className="relative"><Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" /><input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+91..." className="w-full pl-9 pr-3 py-2.5 bg-white border border-black/15 text-[13px] font-mono-tech focus:outline-none focus:border-black focus:ring-1 focus:ring-black" /></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono-tech text-[11px] uppercase tracking-widest text-zinc-700 mb-1.5 block">Engagement</label>
                    <select value={engagementModel} onChange={(e) => setEngagementModel(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-black/15 text-[13px] font-mono-tech focus:outline-none focus:border-black">
                      <option>One-time Assessment</option><option>Periodic Retainer</option><option>Ongoing vCISO Support</option><option>Managed Security Services</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-mono-tech text-[11px] uppercase tracking-widest text-zinc-700 mb-1.5 block">Timeline</label>
                    <select value={estimatedTimeline} onChange={(e) => setEstimatedTimeline(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-black/15 text-[13px] font-mono-tech focus:outline-none focus:border-black">
                      <option>Immediate (within 2 weeks)</option><option>2-4 Weeks</option><option>Next Quarter</option><option>Annual Compliance Cycle</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-mono-tech text-[11px] uppercase tracking-widest text-zinc-700 mb-1.5 block">Objectives & stack — be specific, we love details</label>
                  <textarea rows={4} value={objectives} onChange={(e) => setObjectives(e.target.value)} placeholder="e.g. Node.js API (120 endpoints) + React SPA on AWS ECS, SOC 2 prep, suspect SSRF on /export?url=. Include URLs, repos, infra, compliance drivers..." className="w-full p-3 bg-white border border-black/15 text-[13px] font-mono-tech focus:outline-none focus:border-black focus:ring-1 focus:ring-black resize-y" />
                  <div className="mt-1 font-mono-tech text-[10px] text-zinc-500">Tip: Include tech stack + URLs, we’ll come with initial recon.</div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={easterEggDiscount} onChange={(e) => setEasterEggDiscount(e.target.checked)} className="w-4 h-4 accent-black" />
                  <span className="font-mono-tech text-[11px] text-zinc-700 group-hover:text-black">Apply 5% source-comment discount <span className="text-zinc-500">(for the curious)</span></span>
                </label>

                {statusMessage && (
                  <div className={`p-3 border font-mono-tech text-[12px] flex items-center justify-between ${statusMessage.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-red-50 border-red-200 text-red-900"}`}>
                    <span className="flex items-center gap-2">{statusMessage.type === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}{statusMessage.text}</span>
                    {statusMessage.discountApplied && <span className="px-2 py-0.5 bg-black text-white font-bold text-[10px] shrink-0">5% OFF</span>}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                  <button type="button" onClick={() => setShowQuotesModal(true)} className="font-mono-tech text-[11px] text-zinc-500 hover:text-black underline flex items-center gap-1">View {recentQuotes.length} recent requests <ArrowRight className="w-3 h-3" /></button>
                  <button type="submit" disabled={submitting} className="w-full sm:w-auto px-7 py-3 bg-black text-white font-mono-tech text-[12px] uppercase tracking-widest font-bold hover:bg-[#de5cff] hover:text-black transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-[4px_4px_0_rgba(0,0,0,0.2)]">
                    <Send className="w-4 h-4" /> {submitting ? "Sending..." : "Send briefing →"}
                  </button>
                </div>

                <div className="pt-3 border-t border-black/10 font-mono-tech text-[10px] leading-relaxed text-zinc-500">
                  By sending, you agree we can process this under our mutual NDA. We never share scope details. Data stored in India (PostgreSQL, encrypted at rest). Deletion after 30d. Unsubscribe anytime. Founder replies, not a bot.
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 bg-[#050507] border-t border-white/10 pt-16 pb-8">
        <div className="max-w-[1480px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-12 gap-10 pb-12">
            <div className="col-span-12 md:col-span-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-anonymous font-bold text-[18px]">0d</div>
                <span className="font-anonymous font-bold text-[22px]">0day Security</span>
                <span className="ml-2 px-2 py-0.5 bg-white/5 border border-white/10 font-mono-tech text-[10px] uppercase tracking-widest text-zinc-500">Delhi + Remote</span>
              </div>
              <div className="mt-4 font-anonymous text-[22px] leading-tight text-[#f5f3ef]">Serious security for<br />serious businesses.<br /><span className="text-zinc-500">From day zero.</span></div>
              <div className="mt-6 font-mono-tech text-[11px] leading-relaxed text-zinc-500 max-w-[38ch]">Boutique offensive security lab. We break, we document, we help fix. Founder-led, researcher-operated. No sales team, no outsourcing. 6 people, deep work.</div>
              <div className="mt-6 flex items-center gap-2 font-mono-tech text-[11px] text-zinc-600"><span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Systems operational • Last deploy 2h ago</div>
            </div>
            <div className="col-span-6 md:col-span-2">
              <div className="font-mono-tech text-[11px] uppercase tracking-widest text-zinc-500 mb-4">Services</div>
              <ul className="space-y-2 font-mono-tech text-[12px] text-zinc-400">
                {SERVICE_CATEGORIES.map((c) => (<li key={c.id}><a href="#services" onClick={() => selectCategory(c.id)} className="hover:text-[#de5cff] flex items-center gap-1.5"><ArrowRight className="w-3 h-3" />{c.shortLabel}</a></li>))}
              </ul>
            </div>
            <div className="col-span-6 md:col-span-2">
              <div className="font-mono-tech text-[11px] uppercase tracking-widest text-zinc-500 mb-4">Company</div>
              <ul className="space-y-2 font-mono-tech text-[12px] text-zinc-400">
                <li><a href="#process" className="hover:text-white">Process</a></li>
                <li><a href="#research" className="hover:text-white">Research / CVEs</a></li>
                <li><a href="#why" className="hover:text-white">Why us + FAQ</a></li>
                <li><button onClick={() => setShowQuotesModal(true)} className="hover:text-white">Portal [{recentQuotes.length}]</button></li>
                <li><a href="mailto:contact@anmol.reseracher.com" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className="font-anonymous font-bold text-[20px] uppercase tracking-tight text-[#de5cff]">Get a quote</div>
              <div className="mt-3 space-y-1.5 font-mono-tech text-[13px]">
                <a href="tel:+917309435990" className="block text-white hover:text-[#de5cff] font-bold">+91 7309435990</a>
                <a href="mailto:contact@anmol.reseracher.com" className="block text-zinc-300 hover:text-white break-all">contact@anmol.reseracher.com</a>
                <div className="pt-3 font-mono-tech text-[11px] text-zinc-500 leading-relaxed">Free scoping call. Fixed quote in 24h. NDA on request. We reply personally — no SDR. Founder-led.</div>
                <div className="pt-4 flex gap-2">
                  <span className="px-2 py-1 bg-white/5 border border-white/10 font-mono-tech text-[10px] uppercase tracking-widest text-zinc-400">SOC 2</span>
                  <span className="px-2 py-1 bg-white/5 border border-white/10 font-mono-tech text-[10px] uppercase tracking-widest text-zinc-400">ISO 27001</span>
                  <span className="px-2 py-1 bg-[#de5cff]/10 border border-[#de5cff]/20 font-mono-tech text-[10px] uppercase tracking-widest text-[#de5cff]">CVE Credited</span>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 font-mono-tech text-[11px] text-zinc-600">
            <div className="flex flex-wrap items-center gap-3"><span>© 2026 0day Security. All rights reserved.</span><span className="hidden md:inline">•</span><span>Built by researchers, not marketers.</span><span className="hidden md:inline">•</span><span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> All systems nominal</span></div>
            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-zinc-500">Delhi • Remote • Est. 2021</span>
              <button aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="w-8 h-8 bg-white/5 border border-white/10 hover:bg-white hover:text-black flex items-center justify-center transition"><ArrowUpRight className="w-3.5 h-3.5 rotate-[-45deg]" /></button>
            </div>
          </div>
        </div>
      </footer>

      {/* Portal Modal */}
      {showQuotesModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowQuotesModal(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-[#f6f3ee] text-[#111] border border-black/10 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-[12px_12px_0_rgba(0,0,0,0.6)]">
            <div className="sticky top-0 bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between z-10">
              <div><div className="font-anonymous font-bold text-[20px]">Submitted Briefings</div><div className="font-mono-tech text-[11px] text-zinc-500">Stored in PostgreSQL • {recentQuotes.length} total • Encrypted at rest</div></div>
              <button aria-label="Close" onClick={() => setShowQuotesModal(false)} className="w-8 h-8 bg-black text-white flex items-center justify-center hover:bg-zinc-800 transition"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              {recentQuotes.length === 0 && <div className="font-mono-tech text-[13px] text-zinc-500 py-10 text-center border border-dashed border-black/20">No requests yet. Be the first to get scoped.</div>}
              {recentQuotes.map((q) => {
                let services: string[] = [];
                try { services = JSON.parse(q.selectedServices); } catch { services = [q.selectedServices]; }
                return (
                  <div key={q.id} className="bg-white border border-black/10 p-4 space-y-3 hover:shadow-[2px_2px_0_rgba(0,0,0,0.1)] transition">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div><span className="font-anonymous font-bold text-[16px]">{q.companyName}</span><span className="font-mono-tech text-[11px] text-zinc-500 ml-2">{q.contactName} • {q.contactEmail}</span></div>
                      <div className="flex items-center gap-2">{q.easterEggDiscount && <span className="px-2 py-0.5 bg-[#de5cff] text-black font-mono-tech font-bold text-[10px]">5% OFF</span>}<span className="px-2 py-0.5 bg-black text-white font-mono-tech text-[10px]">{q.status}</span></div>
                    </div>
                    <div className="flex flex-wrap gap-1">{services.map((s, i) => (<span key={i} className="px-2 py-0.5 bg-[#f6f3ee] border border-black/10 font-mono-tech text-[11px]">{s}</span>))}</div>
                    {q.objectives && <div className="font-mono-tech text-[11px] text-zinc-600 bg-[#f6f3ee] p-3 border border-black/5 whitespace-pre-line leading-relaxed">{q.objectives}</div>}
                    <div className="font-mono-tech text-[10px] text-zinc-400">{new Date(q.createdAt).toLocaleString()} • {q.selectedTab} • {q.estimatedTimeline}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
