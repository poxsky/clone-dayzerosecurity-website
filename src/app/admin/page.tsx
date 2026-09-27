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
} from "lucide-react";
import type { QuoteRequest } from "@/db/schema";

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

export default function AdminPortal() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // login form
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // dashboard
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
    (async () => {
      try {
        const res = await fetch("/api/admin/session");
        const data = await res.json();
        if (data.authenticated) {
          setAuthenticated(true);
        }
      } catch {
        // ignore
      } finally {
        setCheckingSession(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (authenticated) fetchQuotes();
  }, [authenticated, fetchQuotes]);

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
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 mb-4">
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

  /* ===================== DASHBOARD ===================== */
  const stats = {
    total: quotes.length,
    pending: quotes.filter((q) => q.status === "SCOPING_REQUESTED").length,
    active: quotes.filter(
      (q) => q.status === "SCOPING_APPROVED" || q.status === "IN_PROGRESS"
    ).length,
    discounts: quotes.filter((q) => q.easterEggDiscount).length,
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-[#de5cff]" />
            <span className="font-anonymous font-bold text-lg tracking-tight">
              0DAY // ADMIN
            </span>
            <span className="hidden sm:inline px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 font-mono-tech text-[10px] text-zinc-400 uppercase tracking-widest">
              Operator: poxsky
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 font-mono-tech text-xs text-zinc-300 transition"
            >
              ← Site
            </a>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-red-950 hover:text-red-300 font-mono-tech text-xs text-zinc-300 transition cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-10">
        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Requests", value: stats.total },
            { label: "Pending Scoping", value: stats.pending },
            { label: "Active Engagements", value: stats.active },
            { label: "Discounts Claimed", value: stats.discounts },
          ].map((s) => (
            <div
              key={s.label}
              className="p-5 rounded-lg bg-zinc-950 border border-zinc-800"
            >
              <p className="font-anonymous font-bold text-3xl text-[#de5cff]">
                {s.value}
              </p>
              <p className="font-mono-tech text-[11px] uppercase tracking-wider text-zinc-500 mt-1">
                {s.label}
              </p>
            </div>
          ))}
        </section>

        {/* Quote Requests */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-anonymous font-bold text-xl">
              Scoping Requests
            </h2>
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
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-[#de5cff] animate-spin" />
            </div>
          ) : quotes.length === 0 ? (
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
      </main>
    </div>
  );
}
