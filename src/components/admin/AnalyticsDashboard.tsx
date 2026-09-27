"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Target,
  Percent,
  Layers,
  Activity,
  Clock,
  Zap,
} from "lucide-react";
import type { QuoteRequest } from "@/db/schema";

const PURPLE = "#de5cff";
const PURPLE_DARK = "#c000f0";
const CYAN = "#22d3ee";
const EMERALD = "#34d399";
const AMBER = "#fbbf24";
const RED = "#f87171";
const VIOLET = "#a78bfa";
const ZINC = "#71717a";

const STATUS_COLORS: Record<string, string> = {
  SCOPING_REQUESTED: AMBER,
  SCOPING_APPROVED: EMERALD,
  IN_PROGRESS: CYAN,
  REPORT_DELIVERED: VIOLET,
  CLOSED: ZINC,
  REJECTED: RED,
};

const PIE_FALLBACK = [PURPLE, CYAN, EMERALD, AMBER, VIOLET, RED];

function parseServices(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [raw];
  } catch {
    return [raw];
  }
}

/* ---------- shared chart chrome ---------- */

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string; color?: string }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-black border border-zinc-700 rounded px-3 py-2 shadow-[0_0_20px_rgba(222,92,255,0.15)]">
      {label && (
        <p className="font-mono-tech text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
          {label}
        </p>
      )}
      {payload.map((p, i) => (
        <p key={i} className="font-mono-tech text-xs text-white">
          <span
            className="inline-block w-2 h-2 rounded-full mr-1.5"
            style={{ backgroundColor: p.color || PURPLE }}
          />
          {p.name}: <span className="text-[#de5cff] font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

function Panel({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg bg-zinc-950 border border-zinc-800 p-5 hover:border-zinc-700 transition ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[#de5cff]">{icon}</span>
        <h3 className="font-mono-tech text-[11px] uppercase tracking-[0.15em] text-zinc-400">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

/* ---------- main dashboard ---------- */

export default function AnalyticsDashboard({
  quotes,
}: {
  quotes: QuoteRequest[];
}) {
  const analytics = useMemo(() => {
    const total = quotes.length;
    const pending = quotes.filter(
      (q) => q.status === "SCOPING_REQUESTED"
    ).length;
    const won = quotes.filter((q) =>
      ["SCOPING_APPROVED", "IN_PROGRESS", "REPORT_DELIVERED", "CLOSED"].includes(
        q.status
      )
    ).length;
    const active = quotes.filter((q) =>
      ["SCOPING_APPROVED", "IN_PROGRESS"].includes(q.status)
    ).length;
    const discounts = quotes.filter((q) => q.easterEggDiscount).length;
    const conversionRate = total > 0 ? Math.round((won / total) * 100) : 0;
    const discountRate = total > 0 ? Math.round((discounts / total) * 100) : 0;

    // requests over time (by month)
    const byMonth = new Map<string, number>();
    const monthKeys: string[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
      monthKeys.push(key);
      byMonth.set(key, 0);
    }
    for (const q of quotes) {
      const d = new Date(q.createdAt);
      const key = d.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
      if (byMonth.has(key)) byMonth.set(key, (byMonth.get(key) || 0) + 1);
    }
    const timeline = monthKeys.map((k) => ({
      month: k,
      requests: byMonth.get(k) || 0,
    }));

    // status breakdown
    const statusMap = new Map<string, number>();
    for (const q of quotes) {
      statusMap.set(q.status, (statusMap.get(q.status) || 0) + 1);
    }
    const statusData = Array.from(statusMap.entries()).map(
      ([name, value]) => ({
        name: name.replace(/_/g, " "),
        rawName: name,
        value,
      })
    );

    // top services
    const serviceMap = new Map<string, number>();
    let totalServices = 0;
    for (const q of quotes) {
      for (const s of parseServices(q.selectedServices)) {
        serviceMap.set(s, (serviceMap.get(s) || 0) + 1);
        totalServices++;
      }
    }
    const topServices = Array.from(serviceMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({
        name: name.length > 28 ? name.slice(0, 26) + "…" : name,
        count,
      }));
    const avgServices =
      total > 0 ? (totalServices / total).toFixed(1) : "0.0";

    // engagement types (selectedTab)
    const tabMap = new Map<string, number>();
    for (const q of quotes) {
      const tab = (q.selectedTab || "Other").split("·")[0].trim();
      tabMap.set(tab, (tabMap.get(tab) || 0) + 1);
    }
    const engagementData = Array.from(tabMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));

    // timeline preference distribution
    const tlMap = new Map<string, number>();
    for (const q of quotes) {
      const t = q.estimatedTimeline || "Unspecified";
      tlMap.set(t, (tlMap.get(t) || 0) + 1);
    }
    const timelinePref = Array.from(tlMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    // recent activity
    const recent = [...quotes]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 6);

    return {
      total,
      pending,
      active,
      won,
      discounts,
      conversionRate,
      discountRate,
      timeline,
      statusData,
      topServices,
      avgServices,
      engagementData,
      timelinePref,
      recent,
    };
  }, [quotes]);

  const kpis = [
    {
      label: "Total Requests",
      value: analytics.total,
      sub: `${analytics.pending} awaiting scoping`,
      icon: <Layers className="w-4 h-4" />,
    },
    {
      label: "Conversion Rate",
      value: `${analytics.conversionRate}%`,
      sub: `${analytics.won} converted engagements`,
      icon: <Target className="w-4 h-4" />,
    },
    {
      label: "Active Engagements",
      value: analytics.active,
      sub: "approved or in progress",
      icon: <Activity className="w-4 h-4" />,
    },
    {
      label: "Discount Claims",
      value: `${analytics.discountRate}%`,
      sub: `${analytics.discounts} easter-egg finds`,
      icon: <Percent className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="relative overflow-hidden rounded-lg bg-zinc-950 border border-zinc-800 p-5 hover:border-[#de5cff]/40 transition group"
          >
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-[#de5cff]/5 group-hover:bg-[#de5cff]/10 transition" />
            <div className="flex items-center gap-2 text-zinc-500 mb-3">
              <span className="text-[#de5cff]">{k.icon}</span>
              <span className="font-mono-tech text-[10px] uppercase tracking-[0.15em]">
                {k.label}
              </span>
            </div>
            <p className="font-anonymous font-bold text-3xl md:text-4xl text-white">
              {k.value}
            </p>
            <p className="font-mono-tech text-[11px] text-zinc-500 mt-1">
              {k.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Row: requests over time + status donut */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Panel
          title="Requests Over Time · Last 6 Months"
          icon={<TrendingUp className="w-4 h-4" />}
          className="lg:col-span-2"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.timeline}>
                <defs>
                  <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={PURPLE} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={PURPLE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  stroke="#52525b"
                  tick={{ fontSize: 11, fontFamily: "monospace" }}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="#52525b"
                  tick={{ fontSize: 11, fontFamily: "monospace" }}
                  width={30}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="requests"
                  name="Requests"
                  stroke={PURPLE}
                  strokeWidth={2}
                  fill="url(#gradPurple)"
                  dot={{ fill: PURPLE_DARK, r: 3 }}
                  activeDot={{ r: 5, fill: PURPLE }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Status Breakdown" icon={<Zap className="w-4 h-4" />}>
          {analytics.statusData.length === 0 ? (
            <p className="font-mono-tech text-xs text-zinc-600 py-16 text-center">
              No data yet.
            </p>
          ) : (
            <>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={3}
                      stroke="#09090b"
                      strokeWidth={2}
                    >
                      {analytics.statusData.map((entry, i) => (
                        <Cell
                          key={entry.rawName}
                          fill={
                            STATUS_COLORS[entry.rawName] ||
                            PIE_FALLBACK[i % PIE_FALLBACK.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {analytics.statusData.map((s) => (
                  <div
                    key={s.rawName}
                    className="flex items-center justify-between font-mono-tech text-[11px]"
                  >
                    <span className="flex items-center gap-2 text-zinc-400">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: STATUS_COLORS[s.rawName] || PURPLE,
                        }}
                      />
                      {s.name}
                    </span>
                    <span className="text-white font-bold">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Panel>
      </div>

      {/* Row: top services + engagement types */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel
          title="Most Requested Services"
          icon={<Layers className="w-4 h-4" />}
        >
          {analytics.topServices.length === 0 ? (
            <p className="font-mono-tech text-xs text-zinc-600 py-16 text-center">
              No data yet.
            </p>
          ) : (
            <div style={{ height: analytics.topServices.length * 42 + 20 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.topServices}
                  layout="vertical"
                  margin={{ left: 8, right: 24 }}
                >
                  <CartesianGrid
                    stroke="#27272a"
                    strokeDasharray="3 3"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    stroke="#52525b"
                    tick={{ fontSize: 10, fontFamily: "monospace" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={190}
                    stroke="#52525b"
                    tick={{ fontSize: 10, fontFamily: "monospace" }}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: "rgba(222,92,255,0.06)" }}
                  />
                  <Bar
                    dataKey="count"
                    name="Requests"
                    fill={PURPLE}
                    radius={[0, 3, 3, 0]}
                    barSize={16}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Panel>

        <Panel
          title="Engagement Types"
          icon={<Target className="w-4 h-4" />}
        >
          {analytics.engagementData.length === 0 ? (
            <p className="font-mono-tech text-xs text-zinc-600 py-16 text-center">
              No data yet.
            </p>
          ) : (
            <div className="space-y-4 pt-2">
              {analytics.engagementData.map((e, i) => {
                const pct =
                  analytics.total > 0
                    ? Math.round((e.value / analytics.total) * 100)
                    : 0;
                const color = PIE_FALLBACK[i % PIE_FALLBACK.length];
                return (
                  <div key={e.name}>
                    <div className="flex items-center justify-between font-mono-tech text-xs mb-1.5">
                      <span className="text-zinc-300">{e.name}</span>
                      <span className="text-zinc-500">
                        {e.value} · <span className="text-white">{pct}%</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-900 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: color,
                          boxShadow: `0 0 8px ${color}66`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 mt-4 border-t border-zinc-900 grid grid-cols-2 gap-4">
                <div>
                  <p className="font-anonymous font-bold text-2xl text-[#de5cff]">
                    {analytics.avgServices}
                  </p>
                  <p className="font-mono-tech text-[10px] uppercase tracking-wider text-zinc-500 mt-0.5">
                    Avg Services / Request
                  </p>
                </div>
                <div>
                  <p className="font-anonymous font-bold text-2xl text-[#de5cff]">
                    {analytics.timelinePref[0]?.name ?? "—"}
                  </p>
                  <p className="font-mono-tech text-[10px] uppercase tracking-wider text-zinc-500 mt-0.5">
                    Most Common Timeline
                  </p>
                </div>
              </div>
            </div>
          )}
        </Panel>
      </div>

      {/* Row: timeline distribution + recent activity */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Panel
          title="Timeline Preferences"
          icon={<Clock className="w-4 h-4" />}
        >
          {analytics.timelinePref.length === 0 ? (
            <p className="font-mono-tech text-xs text-zinc-600 py-16 text-center">
              No data yet.
            </p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.timelinePref}>
                  <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    stroke="#52525b"
                    tick={{ fontSize: 10, fontFamily: "monospace" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    stroke="#52525b"
                    tick={{ fontSize: 10, fontFamily: "monospace" }}
                    width={26}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: "rgba(222,92,255,0.06)" }}
                  />
                  <Bar
                    dataKey="count"
                    name="Requests"
                    fill={CYAN}
                    radius={[3, 3, 0, 0]}
                    barSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Panel>

        <Panel
          title="Recent Activity"
          icon={<Activity className="w-4 h-4" />}
          className="lg:col-span-2"
        >
          {analytics.recent.length === 0 ? (
            <p className="font-mono-tech text-xs text-zinc-600 py-16 text-center">
              No activity yet.
            </p>
          ) : (
            <div className="space-y-1">
              {analytics.recent.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center gap-3 py-2.5 px-3 rounded hover:bg-zinc-900/60 transition border-b border-zinc-900/70 last:border-0"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      backgroundColor: STATUS_COLORS[q.status] || PURPLE,
                      boxShadow: `0 0 6px ${STATUS_COLORS[q.status] || PURPLE}88`,
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono-tech text-xs text-white truncate">
                      <span className="text-[#de5cff]">{q.companyName}</span>
                      {" — "}
                      {q.selectedTab}
                    </p>
                    <p className="font-mono-tech text-[10px] text-zinc-600 truncate">
                      {q.contactName} · {q.contactEmail}
                    </p>
                  </div>
                  {q.easterEggDiscount && (
                    <span className="px-1.5 py-0.5 rounded bg-[#de5cff] text-black font-mono-tech font-bold text-[9px] shrink-0">
                      5%
                    </span>
                  )}
                  <span className="font-mono-tech text-[10px] text-zinc-600 shrink-0 hidden sm:block">
                    {new Date(q.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span
                    className="font-mono-tech text-[9px] px-2 py-0.5 rounded border shrink-0 hidden md:block"
                    style={{
                      color: STATUS_COLORS[q.status] || PURPLE,
                      borderColor: `${STATUS_COLORS[q.status] || PURPLE}55`,
                    }}
                  >
                    {q.status.replace(/_/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
