export type ServiceId = "redteamingservice" | "pentestingservice" | "cloudservice";

export type SecurityService = {
  id: ServiceId;
  name: string;
  value: string;
  tiles: { label: string; icon: string }[];
  features: { title: string; description: string; icon: string }[];
};

export const services: SecurityService[] = [
  {
    id: "redteamingservice",
    name: "Red Teaming",
    value: "red-teaming",
    tiles: [
      { label: "Adversary Simulation", icon: "solid-icon-Cube-Molecule" },
      { label: "Objective-based Testing", icon: "solid-icon-Target" },
      { label: "Phishing", icon: "solid-icon-Email" },
      { label: "Physical Security", icon: "solid-icon-Lock-2" },
    ],
    features: [
      {
        title: "Real Red Teaming",
        description: "Gain insight to how your organisation detects, responds to, and recovers from a full-frontal cyber-operation, executed just as a sophisticated real-world threat actor would.",
        icon: "solid-icon-Shield-Check",
      },
      {
        title: "Objective-based Testing",
        description: "Set business or mission-critical goals for the engagement to measure the effectiveness of your organisation's people, processes and technology.",
        icon: "solid-icon-Target",
      },
    ],
  },
  {
    id: "pentestingservice",
    name: "Penetration Testing",
    value: "penetration-testing",
    tiles: [
      { label: "Web Applications", icon: "solid-icon-Browser" },
      { label: "External Networks", icon: "solid-icon-Server" },
      { label: "Internal Networks", icon: "solid-icon-Laptop" },
      { label: "Wireless Networks", icon: "solid-icon-Wifi" },
      { label: "API Pentesting", icon: "solid-icon-Code" },
    ],
    features: [
      {
        title: "Offensive Security Testing",
        description: "Identify weaknesses in products, backend systems or IT infrastructure which threat actors could exploit.",
        icon: "solid-icon-Shield-Check",
      },
      {
        title: "Cyber Protection",
        description: "Reduce risk to your business with business-focused remediations which minimise financial, reputational and legal damage.",
        icon: "solid-icon-Lock-2",
      },
    ],
  },
  {
    id: "cloudservice",
    name: "Cloud Security",
    value: "cloud-security",
    tiles: [
      { label: "Architecture Review", icon: "solid-icon-Cloud" },
      { label: "Configuration Review", icon: "solid-icon-Settings" },
      { label: "Identity & Access", icon: "solid-icon-User" },
      { label: "Container Security", icon: "solid-icon-Box" },
    ],
    features: [
      {
        title: "Cloud Security Assessment",
        description: "Identify misconfigurations, excessive permissions and architectural weaknesses across your cloud environments.",
        icon: "solid-icon-Cloud",
      },
      {
        title: "Secure by Design",
        description: "Help your teams build and operate cloud infrastructure that is secure from day zero.",
        icon: "solid-icon-Shield-Check",
      },
    ],
  },
];
