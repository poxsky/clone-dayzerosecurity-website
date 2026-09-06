"use client";

import React from "react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Crosshair,
  Target,
  Flag,
  Globe,
  Server,
  Wifi,
  Code2,
  FileCode2,
  Smartphone,
  ScanSearch,
  GitBranch,
  Fingerprint,
  Bug,
  Blocks,
  Cloud,
  ClipboardCheck,
  Scale,
  SearchCheck,
  Handshake,
  TrendingUp,
  Users,
  MailWarning,
  GraduationCap,
  Siren,
  Radar,
  Network,
  Terminal,
  FileText,
  Award,
} from "lucide-react";

const ICONS: Record<
  string,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Crosshair,
  Target,
  Flag,
  Globe,
  Server,
  Wifi,
  Code2,
  FileCode2,
  Smartphone,
  ScanSearch,
  GitBranch,
  Fingerprint,
  Bug,
  Blocks,
  Cloud,
  ClipboardCheck,
  Scale,
  SearchCheck,
  Handshake,
  TrendingUp,
  Users,
  MailWarning,
  GraduationCap,
  Siren,
  Radar,
  Network,
  Terminal,
  FileText,
  Award,
};

export default function Icon({
  name,
  className = "w-6 h-6",
  strokeWidth = 1.6,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = ICONS[name] ?? Shield;
  return <Cmp className={className} strokeWidth={strokeWidth} />;
}
