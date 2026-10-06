/**
 * Central brand and contact settings.
 * Change these values to rebrand the entire website in one place.
 */
export const siteConfig = {
  name: "Day 0 Security",
  slogan: "Security. From day zero.",
  tagline: "Serious Security for Serious Businesses.",
  description:
    "Serious Security for Serious Businesses. From day zero. Offensive security specialists in red teaming, penetration testing and cloud security.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, ""),
  phone: { display: "+61 493 064 326", href: "tel:+61493064326" },
  email: "accounts@dayzerosecurity.com.au",
  emailSubject: "Day Zero Security Quote Request",
  referencePrefix: "D0",
  terminalHost: "day0",
};

export function quoteReference(id: string) {
  return `${siteConfig.referencePrefix}-${id.slice(0, 8).toUpperCase()}`;
}
