export type CategoryId =
  | "vapt"
  | "redteam"
  | "appsec"
  | "compliance"
  | "awareness"
  | "ir";

export interface ServiceItem {
  id: string;
  name: string;
  category: CategoryId;
  iconKey: string;
  methodology: string;
  deliverables: string[];
  typicalDuration: string;
}

export interface ServiceCategory {
  id: CategoryId;
  index: string;
  label: string;
  shortLabel: string;
  headline: string;
  blurb: string;
  highlights: { title: string; body: string; iconKey: string }[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "vapt",
    index: "01",
    label: "Vulnerability Assessment & Penetration Testing",
    shortLabel: "VAPT",
    headline: "Tested the way an attacker would test it",
    blurb:
      "One engagement can stretch from your internet-facing perimeter to internal networks, web apps, APIs, mobile builds and office Wi-Fi. Tooling handles the crawling — our testers handle the exploiting, and nothing lands in your report unverified.",
    highlights: [
      {
        title: "Nothing unverified",
        body: "Scanners get exactly one job: coverage. Every issue that reaches your report has been reproduced and risk-rated by a tester, so your team spends its time fixing real risk instead of chasing false positives.",
        iconKey: "ShieldCheck",
      },
      {
        title: "A methodology you can defend",
        body: "Testing maps to the OWASP Testing Guide, OWASP ASVS/MASVS and PTES — so your auditors, insurers and enterprise customers can trace every test back to a recognised standard.",
        iconKey: "Target",
      },
    ],
  },
  {
    id: "redteam",
    index: "02",
    label: "Red Teaming & Attack Simulation",
    shortLabel: "Red Teaming",
    headline: "One question: will you notice?",
    blurb:
      "A red team exercise measures what a vulnerability scan cannot — whether your people, processes and tooling actually detect and contain a patient, determined attacker working toward a concrete objective.",
    highlights: [
      {
        title: "Objective-driven operations",
        body: "We agree a target — reach the finance server, exfiltrate a marked file — then operate the way a real threat actor would: foothold, escalation, lateral movement, exfiltration. Success is judged against your defences, not a checklist.",
        iconKey: "Crosshair",
      },
      {
        title: "Find out if you're already owned",
        body: "Before or alongside the exercise, we hunt through endpoints, identities and logs for signs of a live intrusion — persistence, beaconing, dwell time — so you know the difference between 'secure' and 'not yet discovered'.",
        iconKey: "Flag",
      },
    ],
  },
  {
    id: "appsec",
    index: "03",
    label: "Application Security",
    shortLabel: "AppSec",
    headline: "Security that ships with the product",
    blurb:
      "Application security that reaches the code, not just the running app: deep testing with source access, line-by-line review, and coaching that stops your developers reintroducing the same class of bug next sprint.",
    highlights: [
      {
        title: "Testing with the code open",
        body: "Grey-box and white-box work pairs live exploitation with source review — the combination that surfaces the logic and authorization flaws black-box scanning structurally cannot see.",
        iconKey: "Code2",
      },
      {
        title: "Fix the class, not the instance",
        body: "Design reviews, secure patterns, CI/CD security gates and dependency hygiene — so the vulnerability we report today doesn't reappear in next month's release.",
        iconKey: "Network",
      },
    ],
  },
  {
    id: "compliance",
    index: "04",
    label: "Compliance & Risk Advisory",
    shortLabel: "Compliance",
    headline: "Audit-ready without the theatre",
    blurb:
      "Certification work grounded in how you actually operate. We map your current practices against ISO 27001, SOC 2, PCI DSS or India's DPDP Act, close the gaps that matter, and build the evidence trail your auditor expects to see.",
    highlights: [
      {
        title: "Know where you stand first",
        body: "Control gap assessments, policy packs and evidence preparation completed before the audit is booked — you walk in already knowing the outcome.",
        iconKey: "ClipboardCheck",
      },
      {
        title: "Risk that reads like the business",
        body: "Risk registers scored by real business impact and vendor exposure, written for leadership to govern — not to gather dust in a shared drive.",
        iconKey: "Scale",
      },
    ],
  },
  {
    id: "awareness",
    index: "05",
    label: "Security Awareness & Training",
    shortLabel: "Awareness",
    headline: "Make your people the hardest target",
    blurb:
      "Attackers email your staff long before they touch your firewall. We train and test people using the same social-engineering techniques we deploy in live operations — then measure what actually changed.",
    highlights: [
      {
        title: "Phishing tests that teach",
        body: "Simulation campaigns with realistic pretexts, measured click-through and credential capture, gateway-bypass findings, and immediate blame-free coaching for anyone who took the bait.",
        iconKey: "MailWarning",
      },
      {
        title: "Taught by practitioners",
        body: "Role-based sessions for staff, developers and leadership, run by the same people who exploit these weaknesses for a living — not a generic video library.",
        iconKey: "GraduationCap",
      },
    ],
  },
  {
    id: "ir",
    index: "06",
    label: "Incident Response & Managed Security",
    shortLabel: "IR & Managed",
    headline: "Ready before, supported during",
    blurb:
      "The worst moment to design a breach response is mid-breach. We build the playbooks and rehearse them in advance, then stay on call through the year — on fixed packages, not panic-rate consulting.",
    highlights: [
      {
        title: "Rehearsed before it's real",
        body: "Response plans, severity ladders and escalation chains pressure-tested in tabletop exercises with the people who would actually run the response.",
        iconKey: "Siren",
      },
      {
        title: "A security team as a service",
        body: "Recurring monitoring, threat analysis and on-call specialists — including vCISO cover for organisations that need the expertise without the headcount.",
        iconKey: "Radar",
      },
    ],
  },
];

export const SERVICE_CATALOG: ServiceItem[] = [
  // 01 — VAPT
  {
    id: "network-infra-testing",
    name: "Network Infrastructure Security Testing",
    category: "vapt",
    iconKey: "Server",
    methodology:
      "Internal and external network testing that answers three questions: what's exposed, what's reachable once an attacker is inside, and how far they travel. Service enumeration, Active Directory attack paths, privilege escalation and segmentation checks — from the outside and from an assumed foothold.",
    deliverables: [
      "Mapped external & internal attack paths",
      "Findings ranked by reach and exploitability",
      "Segmentation & hardening fix plan",
    ],
    typicalDuration: "1–3 Weeks",
  },
  {
    id: "web-app-pentest",
    name: "Web Application Penetration Testing",
    category: "vapt",
    iconKey: "Globe",
    methodology:
      "Hands-on testing well past the OWASP Top 10: authentication and session weaknesses, broken access control (IDOR/BOLA), business logic abuse, SSRF, injection and unsafe deserialisation — with source access when you can share it.",
    deliverables: [
      "Findings with full reproduction steps",
      "Working proof-of-concept requests",
      "Free retest once fixes are in",
    ],
    typicalDuration: "1–3 Weeks",
  },
  {
    id: "api-security-testing",
    name: "API Security Testing",
    category: "vapt",
    iconKey: "Code2",
    methodology:
      "REST, GraphQL and gRPC endpoints tested object by object and role by role — broken object- and function-level authorization, mass assignment, JWT and token flaws, excessive data exposure and rate-limit bypasses.",
    deliverables: [
      "Per-endpoint, per-role authorization matrix",
      "Replayable exploit collection (Burp / Postman)",
      "Gateway & schema hardening notes",
    ],
    typicalDuration: "1–2 Weeks",
  },
  {
    id: "mobile-app-testing",
    name: "Mobile Application Security Testing",
    category: "vapt",
    iconKey: "Smartphone",
    methodology:
      "Android and iOS builds assessed against OWASP MASVS — static and runtime analysis, insecure local storage, weak certificate pinning, root and jailbreak detection, and how the backend API survives direct attack.",
    deliverables: [
      "MASVS-mapped findings report",
      "Reverse-engineering & runtime evidence",
      "Fix list for client and backend",
    ],
    typicalDuration: "1–2 Weeks",
  },
  {
    id: "wireless-testing",
    name: "Wireless Security Testing",
    category: "vapt",
    iconKey: "Wifi",
    methodology:
      "On-site review of corporate and guest Wi-Fi: WPA2/WPA3-Enterprise configuration, rogue and evil-twin access points, EAP credential exposure, and whether guest networks are genuinely isolated from corporate systems.",
    deliverables: [
      "Rogue AP & RF survey results",
      "802.1X / RADIUS configuration review",
      "Wireless isolation audit",
    ],
    typicalDuration: "3–5 Days",
  },
  {
    id: "vuln-management",
    name: "Vulnerability Assessment & Management",
    category: "vapt",
    iconKey: "ScanSearch",
    methodology:
      "Authenticated and unauthenticated scan cycles with manual triage layered on top — de-duplicated, risk-rated findings and a tracked fix workflow, so the register shrinks each quarter instead of quietly growing.",
    deliverables: [
      "Clean, de-duplicated findings register",
      "CVSS scores with business context",
      "Quarterly trend & fix tracking",
    ],
    typicalDuration: "Ongoing / Quarterly",
  },

  // 02 — Red Teaming
  {
    id: "adversary-simulation",
    name: "Real-World Adversary Simulation",
    category: "redteam",
    iconKey: "Crosshair",
    methodology:
      "Covert, objective-based operations mapped to MITRE ATT&CK — initial access through C2, escalation and lateral movement to the agreed goal, all inside negotiated rules of engagement and a deconfliction channel.",
    deliverables: [
      "Executive narrative of the operation",
      "MITRE ATT&CK detection heatmap",
      "Blue-team replay timeline & telemetry gaps",
    ],
    typicalDuration: "4–6 Weeks",
  },
  {
    id: "attack-simulation-threat-modeling",
    name: "Attack Simulation & Threat Modeling",
    category: "redteam",
    iconKey: "GitBranch",
    methodology:
      "We map your crown-jewel assets and the data flows around them, model the attacks that could realistically reach them, then test whether the controls you've deployed actually stop those specific scenarios.",
    deliverables: [
      "Data-flow & trust boundary model",
      "Prioritised attack scenario library",
      "Control effectiveness scorecard",
    ],
    typicalDuration: "2–3 Weeks",
  },
  {
    id: "compromise-assessment",
    name: "Compromise Assessment",
    category: "redteam",
    iconKey: "Fingerprint",
    methodology:
      "A focused hunt across endpoints, identity systems and logs for evidence that an intrusion is already live — persistence mechanisms, beaconing patterns, and the indicators an attacker hoped nobody would look for.",
    deliverables: [
      "Indicators of compromise report",
      "Persistence & dwell-time analysis",
      "Containment & eradication plan",
    ],
    typicalDuration: "2–4 Weeks",
  },

  // 03 — AppSec
  {
    id: "application-security-testing",
    name: "Application Security Testing",
    category: "appsec",
    iconKey: "Bug",
    methodology:
      "A product-level deep dive across web, mobile, thick-client and API surfaces, weighted toward the business-logic and authorization bugs that are unique to how your product actually works.",
    deliverables: [
      "Severity-ranked findings with PoCs",
      "Fix guidance written for developers",
      "Post-fix verification retest",
    ],
    typicalDuration: "1–3 Weeks",
  },
  {
    id: "source-code-review",
    name: "Source Code Review",
    category: "appsec",
    iconKey: "FileCode2",
    methodology:
      "Manual review backed by static analysis — injection sinks, cryptographic and authentication misuse, hardcoded secrets, unsafe deserialisation and stale dependencies — reported line by line with fix patterns included.",
    deliverables: [
      "Line-referenced vulnerability report",
      "Secure code patterns & snippets",
      "Dependency & supply-chain review",
    ],
    typicalDuration: "1–3 Weeks",
  },
  {
    id: "secure-development-advisory",
    name: "Secure Development Advisory",
    category: "appsec",
    iconKey: "Blocks",
    methodology:
      "Advisory that moves security left: architecture and design reviews, threat-modeling workshops, CI/CD security gates and coaching that makes the secure choice the easy choice for your engineering team.",
    deliverables: [
      "SDLC maturity assessment",
      "CI/CD security gate blueprint",
      "Developer workshops & labs",
    ],
    typicalDuration: "Ongoing / Retainer",
  },
  {
    id: "cloud-security-assessment",
    name: "Cloud Security Assessments",
    category: "appsec",
    iconKey: "Cloud",
    methodology:
      "AWS, Azure and GCP configuration and architecture review — IAM escalation paths, key management, Kubernetes and container isolation, logging coverage and network boundaries, benchmarked against CIS.",
    deliverables: [
      "CIS benchmark gap analysis",
      "IAM escalation path diagram",
      "Infrastructure-as-code fix snippets",
    ],
    typicalDuration: "1–2 Weeks",
  },

  // 04 — Compliance
  {
    id: "iso-27001-readiness",
    name: "ISO 27001 Readiness & Audit Support",
    category: "compliance",
    iconKey: "ClipboardCheck",
    methodology:
      "Annex A gap assessment, ISMS documentation, internal audit dry runs and hands-on support through stage 1 and stage 2 certification — sized to your organisation rather than padded to a template.",
    deliverables: [
      "Annex A gap register",
      "ISMS policy & evidence pack",
      "Audit readiness action plan",
    ],
    typicalDuration: "4–12 Weeks",
  },
  {
    id: "gdpr-dpdp-advisory",
    name: "GDPR / DPDP Act Compliance Advisory",
    category: "compliance",
    iconKey: "Scale",
    methodology:
      "Practical data-protection advisory under GDPR and India's DPDP Act — data mapping, lawful basis, consent flows, breach-notification readiness and the technical safeguards an auditor will ask to see.",
    deliverables: [
      "Personal data inventory & flow map",
      "Privacy gap & fix plan",
      "Breach notification playbook",
    ],
    typicalDuration: "3–8 Weeks",
  },
  {
    id: "regulatory-gap-assessment",
    name: "Regulatory Compliance & Gap Assessment",
    category: "compliance",
    iconKey: "SearchCheck",
    methodology:
      "Where you stand against the frameworks that actually apply to you — SOC 2, PCI DSS, RBI/CERT-In directions, HIPAA, NIST CSF — consolidated into one de-duplicated control set instead of five overlapping audits.",
    deliverables: [
      "Multi-framework control mapping",
      "Consolidated gap & risk register",
      "Phased compliance roadmap",
    ],
    typicalDuration: "3–6 Weeks",
  },
  {
    id: "vendor-risk-assessment",
    name: "Third-Party / Vendor Risk Assessment",
    category: "compliance",
    iconKey: "Handshake",
    methodology:
      "Supply-chain review that goes beyond questionnaires: vendor security posture, validation of their external exposure, and contract clauses that make security obligations enforceable rather than aspirational.",
    deliverables: [
      "Vendor risk tiering & scorecards",
      "External exposure validation",
      "Contract clause recommendations",
    ],
    typicalDuration: "2–4 Weeks",
  },
  {
    id: "risk-management",
    name: "Risk Assessment & Management",
    category: "compliance",
    iconKey: "TrendingUp",
    methodology:
      "Enterprise risk assessment weighted by real business impact — what an outage, breach or data loss would actually cost you — with treatment plans and a register your leadership can govern quarter after quarter.",
    deliverables: [
      "Business-weighted risk register",
      "Treatment & acceptance plan",
      "Board-level reporting pack",
    ],
    typicalDuration: "2–5 Weeks",
  },

  // 05 — Awareness
  {
    id: "awareness-training",
    name: "Employee Security Awareness Training",
    category: "awareness",
    iconKey: "Users",
    methodology:
      "Live sessions built on real breach case studies and demonstrations — social engineering, credential hygiene, MFA fatigue and safe data handling — tuned to the risk each audience actually faces.",
    deliverables: [
      "Role-based session delivery",
      "Before/after knowledge metrics",
      "Reusable training materials",
    ],
    typicalDuration: "1–2 Days per Cohort",
  },
  {
    id: "phishing-simulation",
    name: "Phishing Simulation",
    category: "awareness",
    iconKey: "MailWarning",
    methodology:
      "Custom-pretext campaigns with credential-capture and MFA-bypass infrastructure, measuring both how users behave and how your email gateway handles a live attack.",
    deliverables: [
      "Click & credential-capture metrics",
      "Email gateway bypass findings",
      "Just-in-time coaching workflow",
    ],
    typicalDuration: "2–3 Weeks",
  },
  {
    id: "corporate-training",
    name: "Corporate Cybersecurity Training Programs",
    category: "awareness",
    iconKey: "GraduationCap",
    methodology:
      "Multi-module programs for developers, IT/ops and leadership — secure coding, cloud security, incident handling and executive risk literacy — built around hands-on labs, not slide decks.",
    deliverables: [
      "Custom curriculum & labs",
      "Hands-on secure coding practice",
      "Completion reports & certificates",
    ],
    typicalDuration: "Ongoing / Quarterly",
  },

  // 06 — IR & Managed
  {
    id: "incident-response-planning",
    name: "Incident Response Planning",
    category: "ir",
    iconKey: "Siren",
    methodology:
      "Response policy, severity classification, escalation matrices and scenario playbooks — then tabletop exercises with the people who would actually run the response, so gaps surface in a conference room instead of a crisis.",
    deliverables: [
      "Response plan & scenario playbooks",
      "Escalation & communication matrix",
      "Tabletop exercise report",
    ],
    typicalDuration: "2–4 Weeks",
  },
  {
    id: "managed-security-services",
    name: "Managed Security Services (Retainer)",
    category: "ir",
    iconKey: "Radar",
    methodology:
      "A fixed recurring package: scheduled assessments, guaranteed response times, on-call specialists and vCISO guidance — predictable cost, no panic rates, no surprise invoices.",
    deliverables: [
      "Guaranteed response SLA",
      "Recurring assessment & reporting cycle",
      "vCISO advisory hours",
    ],
    typicalDuration: "Monthly / Annual Retainer",
  },
  {
    id: "threat-analysis-prevention",
    name: "Threat Analysis & Prevention",
    category: "ir",
    iconKey: "ShieldAlert",
    methodology:
      "Threat intelligence filtered to your sector and tech stack, translated into detection rules, hardening changes and preventive controls your team can put in place this quarter.",
    deliverables: [
      "Sector-specific threat briefings",
      "Detection rule & use-case pack",
      "Preventive control recommendations",
    ],
    typicalDuration: "Ongoing / Retainer",
  },
];

export const WHY_US = [
  {
    strength: "A research record, not a pitch deck",
    meaning:
      "Our vulnerability research carries public, verifiable credit — CVE assignments and Hall of Fame entries you can look up yourself before you ever get on a call with us.",
    iconKey: "Award",
  },
  {
    strength: "We attack for a living",
    meaning:
      "The people who scope your engagement spend the rest of their week breaking live targets in bug bounty. Techniques stay current because the targets are real.",
    iconKey: "Crosshair",
  },
  {
    strength: "Nothing unverified reaches your report",
    meaning:
      "Tooling sweeps for coverage; testers confirm, reproduce and rate every finding by hand. You spend your time fixing real risk, not triaging scanner noise.",
    iconKey: "ShieldCheck",
  },
  {
    strength: "Reports built to be acted on",
    meaning:
      "An executive summary your leadership can decide with, reproduction steps your engineers can follow, and a retest to confirm the fixes held — the loop closes with us, not with a filed PDF.",
    iconKey: "FileText",
  },
  {
    strength: "Engagements shaped around you",
    meaning:
      "A one-time assessment, a recurring cycle or a year-round retainer — the structure follows your risk and your budget, not our convenience.",
    iconKey: "Handshake",
  },
];
