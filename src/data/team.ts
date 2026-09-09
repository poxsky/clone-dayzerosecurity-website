export interface TeamMember {
  id: string;
  /** Only set when a real, approved name exists for the site. */
  name?: string;
  role: string;
  /** Number of people filling this role (e.g. 2x VAPT specialists). */
  headcount?: number;
  focus: string;
  detail?: string;
  iconKey: string;
  credentials?: string[];
  email?: string;
  personalEmail?: string;
}

export const FOUNDER: TeamMember = {
  id: "founder",
  name: "Anmol Singh Rajput",
  role: "Founder & Lead",
  focus: "Red teaming · network, API & web security · open-source research",
  iconKey: "Crosshair",
  credentials: [
    "10+ CVEs published through responsible disclosure",
    "100+ Hall of Fame recognitions",
    "TryHackMe — Global Top 20",
    "pwn.college — Expert player",
    "Active bug bounty hunter on Google, Com Olho, YesWeHack and HackenProof",
    "Speaker, Hack The Box Meetup Mumbai — “From SSRF to RCE: Discovering a CVE in DigitalOcean’s Droplet Agent”",
    "Certified in ethical hacking — Great Learning",
  ],
  email: "anmol@0daysecurity.tech",
  personalEmail: "anmol.reseracher@gmail.com",
};

/**
 * Role cards for the rest of the team. Listed by role only —
 * add `name` / `detail` per member as real names and bios are confirmed.
 */
export const TEAM_ROLES: TeamMember[] = [
  {
    id: "vapt",
    role: "VAPT Specialist",
    headcount: 2,
    focus: "Infrastructure & endpoint assessment",
    detail:
      "Servers, workstations, Active Directory and network infrastructure — deep technical testing of everything on-prem.",
    iconKey: "Server",
  },
  {
    id: "appsec",
    role: "Web / API / App Security Specialist",
    focus: "Application & API security",
    detail:
      "Web applications, APIs and the business logic behind them — hunting the flaws scanners can't see.",
    iconKey: "Code2",
  },
  {
    id: "forensics",
    role: "Cyber Forensics Specialist",
    focus: "Incident response & investigation",
    detail:
      "Evidence preservation, root-cause analysis and incident timelines — for when something has already gone wrong.",
    iconKey: "Fingerprint",
  },
  {
    id: "grc",
    role: "GRC Specialist",
    focus: "Governance, risk & compliance",
    detail:
      "ISO 27001, the DPDP Act and audit readiness — security that satisfies boards and auditors alike.",
    iconKey: "Scale",
  },
];
