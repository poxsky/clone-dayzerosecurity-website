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
    headline: "Vulnerability Assessment & Penetration Testing",
    blurb:
      "Full-spectrum VAPT across networks, web, APIs, mobile and wireless — every finding manually validated by the team, never raw scanner output.",
    highlights: [
      {
        title: "Manually Validated Findings",
        body: "Automated tooling gives us coverage; our engineers give you certainty. Every issue is exploited, evidenced and triaged by hand to eliminate false positives.",
        iconKey: "ShieldCheck",
      },
      {
        title: "OWASP & PTES Methodology",
        body: "Testing follows peer-reviewed industry methodology (OWASP Testing Guide, OWASP ASVS/MASVS and PTES) so results are repeatable, defensible and audit-ready.",
        iconKey: "Target",
      },
    ],
  },
  {
    id: "redteam",
    index: "02",
    label: "Red Teaming & Attack Simulation",
    shortLabel: "Red Teaming",
    headline: "Red Teaming & Attack Simulation",
    blurb:
      "Real-world adversary simulation that measures how your people, processes and technology actually detect, respond to and recover from an attack.",
    highlights: [
      {
        title: "Real-World Adversary Simulation",
        body: "Objective-based operations executed the way a determined threat actor would — testing detection and response, not just the existence of a vulnerability.",
        iconKey: "Crosshair",
      },
      {
        title: "Threat Modeling & Compromise Assessment",
        body: "We model the threats that actually matter to your business, then hunt for evidence that an intrusion has already happened in your environment.",
        iconKey: "Flag",
      },
    ],
  },
  {
    id: "appsec",
    index: "03",
    label: "Application Security",
    shortLabel: "AppSec",
    headline: "Application Security",
    blurb:
      "Security built into the product — from deep application testing and source code review to secure development advisory and cloud posture assessment.",
    highlights: [
      {
        title: "Code-Assisted Security Testing",
        body: "Grey-box and white-box review combining application testing with source code analysis to uncover logic flaws that black-box testing alone will miss.",
        iconKey: "Code2",
      },
      {
        title: "Secure by Design Advisory",
        body: "Practical guidance for your engineering teams: secure design patterns, SDLC integration, dependency hygiene and cloud architecture hardening.",
        iconKey: "Network",
      },
    ],
  },
  {
    id: "compliance",
    index: "04",
    label: "Compliance & Risk Advisory",
    shortLabel: "Compliance",
    headline: "Compliance & Risk Advisory",
    blurb:
      "Get audit-ready and stay there — ISO 27001 readiness, GDPR and India's DPDP Act advisory, vendor risk and enterprise risk management.",
    highlights: [
      {
        title: "ISO 27001 & Regulatory Readiness",
        body: "Gap assessment, control mapping, policy and evidence preparation so you walk into your audit knowing exactly where you stand.",
        iconKey: "ClipboardCheck",
      },
      {
        title: "Data Protection & Vendor Risk",
        body: "GDPR and DPDP Act compliance advisory, data flow mapping, and structured third-party risk assessment for your supply chain.",
        iconKey: "Scale",
      },
    ],
  },
  {
    id: "awareness",
    index: "05",
    label: "Security Awareness & Training",
    shortLabel: "Awareness",
    headline: "Security Awareness & Training",
    blurb:
      "Your people are the largest attack surface. We train them with the same techniques we use against them in live engagements.",
    highlights: [
      {
        title: "Phishing Simulation Campaigns",
        body: "Realistic, measurable campaigns with click-through and credential-capture metrics, plus just-in-time coaching for users who fall for it.",
        iconKey: "MailWarning",
      },
      {
        title: "Corporate Training Programs",
        body: "Role-based training for staff, developers and leadership — delivered by practitioners with real offensive security experience.",
        iconKey: "GraduationCap",
      },
    ],
  },
  {
    id: "ir",
    index: "06",
    label: "Incident Response & Managed Security",
    shortLabel: "IR & Managed",
    headline: "Incident Response & Managed Security",
    blurb:
      "Be ready before the incident, and supported through it — response planning, threat analysis and retainer-based monitoring and support.",
    highlights: [
      {
        title: "Incident Response Planning",
        body: "Playbooks, escalation paths and tabletop exercises so your team knows exactly what to do in the first hour of a breach.",
        iconKey: "Siren",
      },
      {
        title: "Retainer-Based Managed Security",
        body: "Ongoing monitoring, threat analysis and on-call expertise — including vCISO support for organisations without an in-house security lead.",
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
      "Internal and external network penetration testing covering perimeter exposure, service enumeration, Active Directory attack paths, privilege escalation and network segmentation validation.",
    deliverables: [
      "External & Internal Attack Surface Map",
      "Prioritised Vulnerability & Misconfiguration Matrix",
      "Segmentation & Hardening Roadmap",
    ],
    typicalDuration: "1–3 Weeks",
  },
  {
    id: "web-app-pentest",
    name: "Web Application Penetration Testing",
    category: "vapt",
    iconKey: "Globe",
    methodology:
      "Manual, source-assisted testing well beyond the OWASP Top 10 — authentication and session flaws, access control (IDOR/BOLA), business logic abuse, SSRF, injection and deserialisation.",
    deliverables: [
      "Technical Report with Reproduction Steps",
      "Proof-of-Concept Exploits & HTTP Requests",
      "Free Remediation Retest",
    ],
    typicalDuration: "1–3 Weeks",
  },
  {
    id: "api-security-testing",
    name: "API Security Testing",
    category: "vapt",
    iconKey: "Code2",
    methodology:
      "REST, GraphQL and gRPC assessment aligned to the OWASP API Security Top 10 — broken object/function level authorization, mass assignment, JWT flaws and rate-limit bypass.",
    deliverables: [
      "Endpoint-by-Endpoint Authorization Matrix",
      "Postman / Burp Exploit Collection",
      "API Gateway & Schema Hardening Guidance",
    ],
    typicalDuration: "1–2 Weeks",
  },
  {
    id: "mobile-app-testing",
    name: "Mobile Application Security Testing",
    category: "vapt",
    iconKey: "Smartphone",
    methodology:
      "Android and iOS assessment against OWASP MASVS — static and dynamic analysis, insecure local storage, certificate pinning bypass, root/jailbreak detection and backend API abuse.",
    deliverables: [
      "MASVS-Mapped Findings Report",
      "Reverse Engineering & Runtime Analysis Evidence",
      "Client & Backend Remediation Plan",
    ],
    typicalDuration: "1–2 Weeks",
  },
  {
    id: "wireless-testing",
    name: "Wireless Security Testing",
    category: "vapt",
    iconKey: "Wifi",
    methodology:
      "Corporate Wi-Fi assessment covering WPA2/WPA3 Enterprise, rogue and evil-twin access points, EAP credential capture, and guest/corporate network isolation.",
    deliverables: [
      "RF Survey & Rogue AP Analysis",
      "802.1X / RADIUS Configuration Review",
      "Wireless Segmentation Audit",
    ],
    typicalDuration: "3–5 Days",
  },
  {
    id: "vuln-management",
    name: "Vulnerability Assessment & Management",
    category: "vapt",
    iconKey: "ScanSearch",
    methodology:
      "Authenticated and unauthenticated scanning with OpenVAS, Acunetix and Burp Suite, followed by manual triage, risk-rating and a tracked remediation lifecycle.",
    deliverables: [
      "Validated, De-Duplicated Findings Register",
      "CVSS + Business-Context Risk Ratings",
      "Recurring Scan Cadence & Trend Reporting",
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
      "Covert, objective-based operations mapped to MITRE ATT&CK — initial access, C2, privilege escalation, lateral movement and domain dominance, all under agreed rules of engagement.",
    deliverables: [
      "Executive Cyber Resilience Narrative",
      "MITRE ATT&CK Detection & Response Heatmap",
      "Blue Team Replay Timeline & Telemetry Gaps",
    ],
    typicalDuration: "4–6 Weeks",
  },
  {
    id: "attack-simulation-threat-modeling",
    name: "Attack Simulation & Threat Modeling",
    category: "redteam",
    iconKey: "GitBranch",
    methodology:
      "Structured threat modeling of your critical assets and data flows, converted into targeted attack scenarios that validate whether your controls actually stop them.",
    deliverables: [
      "Trust Boundary & Data Flow Threat Model",
      "Prioritised Attack Scenario Library",
      "Control Effectiveness Scorecard",
    ],
    typicalDuration: "2–3 Weeks",
  },
  {
    id: "compromise-assessment",
    name: "Compromise Assessment",
    category: "redteam",
    iconKey: "Fingerprint",
    methodology:
      "Threat hunt across endpoints, identity systems and logs to determine whether your environment is already compromised, and to surface persistence and dwell-time indicators.",
    deliverables: [
      "Indicators of Compromise (IOC) Findings",
      "Persistence & Dwell-Time Analysis",
      "Containment & Eradication Recommendations",
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
      "Deep product security assessment across web, mobile, thick-client and API surfaces with an emphasis on business logic and authorization flaws unique to your application.",
    deliverables: [
      "Severity-Ranked Findings with PoCs",
      "Developer-Focused Fix Guidance",
      "Post-Fix Verification Retest",
    ],
    typicalDuration: "1–3 Weeks",
  },
  {
    id: "source-code-review",
    name: "Source Code Review",
    category: "appsec",
    iconKey: "FileCode2",
    methodology:
      "Manual secure code review supported by SAST — injection sinks, authentication and crypto misuse, secrets in code, unsafe deserialisation and vulnerable dependencies.",
    deliverables: [
      "Line-Referenced Vulnerability Report",
      "Secure Code Patterns & Fix Snippets",
      "Dependency & Supply Chain Risk Review",
    ],
    typicalDuration: "1–3 Weeks",
  },
  {
    id: "secure-development-advisory",
    name: "Secure Development Advisory",
    category: "appsec",
    iconKey: "Blocks",
    methodology:
      "Hands-on advisory to embed security into your SDLC — design reviews, threat modeling workshops, CI/CD security gates and developer enablement.",
    deliverables: [
      "SDLC Security Maturity Assessment",
      "CI/CD Security Gate Blueprint",
      "Developer Secure Coding Workshops",
    ],
    typicalDuration: "Ongoing / Retainer",
  },
  {
    id: "cloud-security-assessment",
    name: "Cloud Security Assessments",
    category: "appsec",
    iconKey: "Cloud",
    methodology:
      "AWS, Azure and GCP configuration and architecture review — IAM privilege escalation paths, key management, container and Kubernetes isolation, logging and network perimeter controls.",
    deliverables: [
      "CIS Benchmark Gap Analysis",
      "IAM Privilege Escalation Path Diagram",
      "Infrastructure-as-Code Remediation Snippets",
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
      "Annex A control gap assessment, ISMS documentation support, internal audit preparation and stage 1/2 certification audit assistance.",
    deliverables: [
      "Annex A Control Gap Register",
      "ISMS Policy & Evidence Pack",
      "Audit Readiness Action Plan",
    ],
    typicalDuration: "4–12 Weeks",
  },
  {
    id: "gdpr-dpdp-advisory",
    name: "GDPR / DPDP Act Compliance Advisory",
    category: "compliance",
    iconKey: "Scale",
    methodology:
      "Data protection advisory covering data mapping, lawful basis, consent design, breach notification readiness and technical/organisational safeguards under GDPR and India's DPDP Act.",
    deliverables: [
      "Personal Data Inventory & Flow Map",
      "Privacy Gap Assessment & Remediation Plan",
      "Breach Notification Playbook",
    ],
    typicalDuration: "3–8 Weeks",
  },
  {
    id: "regulatory-gap-assessment",
    name: "Regulatory Compliance & Gap Assessment",
    category: "compliance",
    iconKey: "SearchCheck",
    methodology:
      "Assessment against the frameworks that apply to you — SOC 2, PCI DSS, RBI/CERT-In directions, HIPAA and NIST CSF — with a consolidated, de-duplicated control set.",
    deliverables: [
      "Multi-Framework Control Mapping",
      "Consolidated Gap & Risk Register",
      "Phased Compliance Roadmap",
    ],
    typicalDuration: "3–6 Weeks",
  },
  {
    id: "vendor-risk-assessment",
    name: "Third-Party / Vendor Risk Assessment",
    category: "compliance",
    iconKey: "Handshake",
    methodology:
      "Supply chain risk review combining vendor security questionnaires, external attack surface validation and contractual security requirement analysis.",
    deliverables: [
      "Vendor Risk Tiering & Scorecards",
      "External Exposure Validation Results",
      "Contractual Security Clause Recommendations",
    ],
    typicalDuration: "2–4 Weeks",
  },
  {
    id: "risk-management",
    name: "Risk Assessment & Management",
    category: "compliance",
    iconKey: "TrendingUp",
    methodology:
      "Enterprise security risk assessment with business-impact-weighted scoring, treatment planning and an ongoing risk register your leadership can actually govern.",
    deliverables: [
      "Business-Weighted Risk Register",
      "Risk Treatment & Acceptance Plan",
      "Board-Level Risk Reporting Pack",
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
      "Practitioner-led awareness sessions using real breach case studies and live demonstrations — social engineering, credential hygiene, MFA fatigue and safe data handling.",
    deliverables: [
      "Role-Based Training Delivery",
      "Pre/Post Knowledge Assessment Metrics",
      "Reusable Training Material Pack",
    ],
    typicalDuration: "1–2 Days per Cohort",
  },
  {
    id: "phishing-simulation",
    name: "Phishing Simulation",
    category: "awareness",
    iconKey: "MailWarning",
    methodology:
      "Targeted spear-phishing campaigns with custom pretexting and MFA-bypass proxy infrastructure, measuring both user behaviour and email gateway effectiveness.",
    deliverables: [
      "Click-Through & Credential Harvest Metrics",
      "Email Gateway Bypass Findings",
      "Just-in-Time User Coaching Workflow",
    ],
    typicalDuration: "2–3 Weeks",
  },
  {
    id: "corporate-training",
    name: "Corporate Cybersecurity Training Programs",
    category: "awareness",
    iconKey: "GraduationCap",
    methodology:
      "Structured multi-module programs for developers, IT/ops and leadership — secure coding, cloud security, incident handling and executive cyber risk literacy.",
    deliverables: [
      "Custom Curriculum & Lab Exercises",
      "Hands-On Secure Coding Labs",
      "Completion Reporting & Certificates",
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
      "Development of IR policy, severity classification, escalation matrices and scenario-specific playbooks, validated through executive and technical tabletop exercises.",
    deliverables: [
      "Incident Response Plan & Playbooks",
      "Escalation & Communication Matrix",
      "Tabletop Exercise Report",
    ],
    typicalDuration: "2–4 Weeks",
  },
  {
    id: "managed-security-services",
    name: "Managed Security Services (Retainer)",
    category: "ir",
    iconKey: "Radar",
    methodology:
      "Retainer-based monitoring and advisory: recurring assessments, guaranteed response SLAs, on-call expertise and vCISO support for security governance.",
    deliverables: [
      "Guaranteed Response SLA",
      "Recurring Assessment & Reporting Cycle",
      "vCISO Advisory Hours",
    ],
    typicalDuration: "Monthly / Annual Retainer",
  },
  {
    id: "threat-analysis-prevention",
    name: "Threat Analysis & Prevention",
    category: "ir",
    iconKey: "ShieldAlert",
    methodology:
      "Threat intelligence tailored to your sector and tech stack, converted into detection rules, hardening actions and preventative controls your team can deploy.",
    deliverables: [
      "Sector-Specific Threat Briefings",
      "Detection Rule & Use-Case Pack",
      "Preventative Control Recommendations",
    ],
    typicalDuration: "Ongoing / Retainer",
  },
];

export const WHY_US = [
  {
    strength: "Hands-on offensive security team",
    meaning:
      "Findings are manually validated, not just scanner output — every issue is proven before it reaches your report.",
    iconKey: "Crosshair",
  },
  {
    strength: "Hall of Fame credits & CVEs",
    meaning:
      "A proven, publicly verifiable research track record from responsible disclosure work with real vendors.",
    iconKey: "Award",
  },
  {
    strength: "Industry-standard tooling",
    meaning:
      "OpenVAS, Acunetix, Burp Suite and a manual testing methodology grounded in OWASP and PTES.",
    iconKey: "Terminal",
  },
  {
    strength: "Business-first reporting",
    meaning:
      "Executive summaries leadership can act on — not just technical jargon dumped into a PDF.",
    iconKey: "FileText",
  },
  {
    strength: "Flexible engagement",
    meaning:
      "One-time VAPT, periodic retainer, or ongoing vCISO support — structured around how your business actually works.",
    iconKey: "Handshake",
  },
];
