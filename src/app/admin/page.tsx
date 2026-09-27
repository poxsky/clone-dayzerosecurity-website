"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Lock,
  Shield,
  LogOut,
  Trash2,
  RefreshCw,
  Terminal,
  Loader2,
  BarChart3,
  Inbox,
} from "lucide-react";
import Link from "next/link";
import type { QuoteRequest } from "@/db/schema";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

const STATUS_OPTIONS = [
  "SCOPING_REQUESTED",
  "SCOPING_APPROVED",
  "IN_PROGRESS",
  "REPORT_DELIVERED",
  "CLOSED",
  "REJECTED",
];

const STATUS_COLORS: Record<string, string> = {
  SCOPING_REQUESTED: "bg-amber-950 text-amber-300 border-amber-700/50",
  SCOPING_APPROVED: "bg-emerald-950 text-emerald-300 border-emerald-700/50",
  IN_PROGRESS: "bg-sky-950 text-sky-300 border-sky-700/50",
  REPORT_DELIVERED: "bg-violet-950 text-violet-300 border-violet-700/50",
  CLOSED: "bg-zinc-900 text-zinc-400 border-zinc-700/50",
  REJECTED: "bg-red-950 text-red-300 border-red-700/50",
};

type AdminTab = "analytics" | "requests";

export default function AdminPortal() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState<AdminTab>("analytics");

  // login form
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // data
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const fetchQuotes = useCallback(async () => {
    setLoadingQuotes(true);
    try {
      const res = await fetch("/api/quotes");
      const data = await res.json();
      setQuotes(Array.isArray(data.quotes) ? data.quotes : []);
    } catch {
      setQuotes([]);
    } finally {
      setLoadingQuotes(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let isAuthed = false;
      try {
        const res = await fetch("/api/admin/session");
        const data = await res.json();
        isAuthed = Boolean(data.authenticated);
      } catch {
        // ignore
      }
      if (cancelled) return;
      setAuthenticated(isAuthed);
      setCheckingSession(false);
      if (isAuthed) fetchQuotes();
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchQuotes]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: loginId, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Login failed.");
        return;
      }
      setAuthenticated(true);
      setLoginPassword("");
      fetchQuotes();
    } catch {
      setLoginError("Network error. Try again.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setQuotes([]);
  }

  async function updateStatus(id: number, status: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setQuotes((prev) =>
          prev.map((q) => (q.id === id ? { ...q, status: data.quote.status } : q))
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  async function deleteQuote(id: number) {
    if (!window.confirm("Permanently delete this scoping request?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/quotes/${id}`, { method: "DELETE" });
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (res.ok) {
        setQuotes((prev) => prev.filter((q) => q.id !== id));
      }
    } finally {
      setBusyId(null);
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#de5cff] animate-spin" />
      </div>
    );
  }

  /* ===================== LOGIN SCREEN ===================== */
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
        {/* ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#de5cff]/5 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 mb-4 shadow-[0_0_25px_rgba(222,92,255,0.15)]">
              <Lock className="w-6 h-6 text-[#de5cff]" />
            </div>
            <h1 className="font-anonymous font-bold text-2xl text-white tracking-tight">
              0DAY // ADMIN PORTAL
            </h1>
            <p className="font-mono-tech text-xs text-zinc-500 mt-2 uppercase tracking-widest">
              Restricted Area — Operator Access Only
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 space-y-4"
          >
            <div>
              <label className="block font-mono-tech text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                Operator ID
              </label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                autoComplete="username"
                autoFocus
                required
                className="w-full px-3 py-2.5 rounded bg-black border border-zinc-800 focus:border-[#de5cff] outline-none font-mono-tech text-sm text-white placeholder-zinc-600 transition"
                placeholder="operator id"
              />
            </div>
            <div>
              <label className="block font-mono-tech text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                Passphrase
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full px-3 py-2.5 rounded bg-black border border-zinc-800 focus:border-[#de5cff] outline-none font-mono-tech text-sm text-white placeholder-zinc-600 transition"
                placeholder="••••••••••••"
              />
            </div>

            {loginError && (
              <p className="font-mono-tech text-xs text-red-400 bg-red-950/40 border border-red-900/50 rounded px-3 py-2">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-2.5 rounded bg-[#de5cff] hover:bg-[#c93ef0] disabled:opacity-60 text-black font-mono-tech font-bold text-sm uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
            >
              {loggingIn ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
              {loggingIn ? "Authenticating..." : "Authenticate"}
            </button>
          </form>

          <p className="text-center font-mono-tech text-[10px] text-zinc-700 mt-6">
            All access attempts are logged · 0day Security
          </p>
        </div>
      </div>
    );
  }

  /* ===================== DASHBOARD SHELL ===================== */
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-[#de5cff]" />
            <span className="font-anonymous font-bold text-lg tracking-tight">
              0DAY // ADMIN
            </span>
            <span className="hidden sm:inline px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 font-mono-tech text-[10px] text-zinc-400 uppercase tracking-widest">
              Operator: poxsky
            </span>
          </div>

          {/* Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setTab("analytics")}
              className={`px-4 py-1.5 rounded-md font-mono-tech text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
                tab === "analytics"
                  ? "bg-[#de5cff] text-black font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analytics
            </button>
            <button
              onClick={() => setTab("requests")}
              className={`px-4 py-1.5 rounded-md font-mono-tech text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
                tab === "requests"
                  ? "bg-[#de5cff] text-black font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              Requests
              <span
                className={`px-1.5 rounded-full text-[10px] ${
                  tab === "requests"
                    ? "bg-black/20 text-black"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {quotes.length}
              </span>
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 font-mono-tech text-xs text-zinc-300 transition"
            >
              ← Site
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-red-950 hover:text-red-300 font-mono-tech text-xs text-zinc-300 transition cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden border-t border-zinc-900 px-4 py-2 flex gap-2">
          <button
            onClick={() => setTab("analytics")}
            className={`flex-1 py-2 rounded font-mono-tech text-xs uppercase tracking-wider transition cursor-pointer ${
              tab === "analytics"
                ? "bg-[#de5cff] text-black font-bold"
                : "bg-zinc-950 text-zinc-400 border border-zinc-800"
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setTab("requests")}
            className={`flex-1 py-2 rounded font-mono-tech text-xs uppercase tracking-wider transition cursor-pointer ${
              tab === "requests"
                ? "bg-[#de5cff] text-black font-bold"
                : "bg-zinc-950 text-zinc-400 border border-zinc-800"
            }`}
          >
            Requests ({quotes.length})
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-anonymous font-bold text-2xl">
              {tab === "analytics" ? "Analytics Dashboard" : "Scoping Requests"}
            </h2>
            <p className="font-mono-tech text-[11px] text-zinc-500 mt-0.5 uppercase tracking-wider">
              {tab === "analytics"
                ? "Engagement intelligence · live from PostgreSQL"
                : "Manage incoming offensive security engagements"}
            </p>
          </div>
          <button
            onClick={fetchQuotes}
            disabled={loadingQuotes}
            className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 font-mono-tech text-xs text-zinc-300 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loadingQuotes ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {loadingQuotes && quotes.length === 0 ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-6 h-6 text-[#de5cff] animate-spin" />
          </div>
        ) : tab === "analytics" ? (
          <AnalyticsDashboard quotes={quotes} />
        ) : (
          /* ===================== REQUESTS TAB ===================== */
          <section>
            {quotes.length === 0 ? (
              <p className="font-mono-tech text-sm text-zinc-500 py-10 text-center">
                No scoping requests in the database.
              </p>
            ) : (
              <div className="space-y-4">
                {quotes.map((q) => {
                  let services: string[] = [];
                  try {
                    services = JSON.parse(q.selectedServices);
                  } catch {
                    services = [q.selectedServices];
                  }
                  const busy = busyId === q.id;
                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-3 transition ${
                        busy ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-anonymous font-bold text-lg text-white">
                              {q.companyName}
                            </span>
                            {q.easterEggDiscount && (
                              <span className="px-2 py-0.5 rounded bg-[#de5cff] text-black font-mono-tech font-bold text-[10px]">
                                5% OFF
                              </span>
                            )}
                          </div>
                          <p className="font-mono-tech text-[11px] text-zinc-500 mt-0.5">
                            {q.contactName} · {q.contactEmail}
                            {q.contactPhone ? ` · ${q.contactPhone}` : ""}
                          </p>
                          <p className="font-mono-tech text-[11px] text-zinc-600 mt-0.5">
                            #{q.id} · {q.selectedTab} · Timeline:{" "}
                            {q.estimatedTimeline || "—"} ·{" "}
                            {new Date(q.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={q.status}
                            disabled={busy}
                            onChange={(e) => updateStatus(q.id, e.target.value)}
                            className={`px-2.5 py-1.5 rounded border font-mono-tech text-[11px] outline-none cursor-pointer bg-black ${
                              STATUS_COLORS[q.status] ||
                              "bg-zinc-900 text-zinc-300 border-zinc-700"
                            }`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s} className="bg-black">
                                {s}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => deleteQuote(q.id)}
                            disabled={busy}
                            aria-label="Delete request"
                            className="p-2 rounded bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-300 transition cursor-pointer disabled:opacity-60"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {services.map((s, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-black border border-zinc-700 font-mono-tech text-[11px] text-[#de5cff]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      {q.objectives && (
                        <p className="font-mono-tech text-xs text-zinc-400 bg-black/60 p-3 rounded border border-zinc-800/60 whitespace-pre-line">
                          {q.objectives}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
