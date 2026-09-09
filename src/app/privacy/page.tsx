import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How 0DAY Research Team collects, uses and protects information submitted through 0daysecurity.tech.",
};

const LAST_UPDATED = "9 September 2026";

const CONTACT_EMAIL = "anmol@0daysecurity.tech";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 bg-black/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-anonymous font-bold text-xl tracking-tight hover:opacity-90 transition"
          >
            <span className="text-[#de5cff]">0DAY</span> Research Team
          </Link>
          <Link
            href="/"
            className="font-mono-tech text-[11px] uppercase tracking-wider text-zinc-400 hover:text-[#de5cff] transition"
          >
            ← Back to site
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <span className="font-mono-tech text-[11px] uppercase tracking-[0.25em] text-[#de5cff]">
          / Legal
        </span>
        <h1 className="font-anonymous font-bold text-4xl md:text-5xl text-white mt-4">
          Privacy Policy
        </h1>
        <p className="font-mono-tech text-xs text-zinc-500 mt-3">
          Last updated: {LAST_UPDATED}
        </p>

        <p className="font-mono-tech text-sm md:text-base text-zinc-300 leading-relaxed mt-8">
          This policy explains what 0DAY Research Team (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;) does with information submitted through
          0daysecurity.tech. The short version: we collect only what the quote
          form asks for, we use it only to respond to you, and we never sell
          it.
        </p>

        <div className="space-y-10 mt-12">
          <section>
            <h2 className="font-anonymous font-bold text-xl text-white">
              1. What we collect
            </h2>
            <p className="font-mono-tech text-sm text-zinc-400 leading-relaxed mt-3">
              The scoping &amp; quote form asks for: your organisation&apos;s
              name; your name and role; your work email address; your phone
              number (optional); the services you&apos;re interested in; your
              preferred engagement type and timeline; and any project details
              you choose to describe, such as the size of your environment. If
              you email us directly, we keep that correspondence.
            </p>
          </section>

          <section>
            <h2 className="font-anonymous font-bold text-xl text-white">
              2. What we don&apos;t collect
            </h2>
            <p className="font-mono-tech text-sm text-zinc-400 leading-relaxed mt-3">
              This website runs no analytics, no advertising pixels and no
              third-party tracking cookies. We don&apos;t profile visitors, and
              submitting the form creates no account and sets no password.
            </p>
          </section>

          <section>
            <h2 className="font-anonymous font-bold text-xl text-white">
              3. How we use your information
            </h2>
            <p className="font-mono-tech text-sm text-zinc-400 leading-relaxed mt-3">
              To reply to your enquiry, to scope and quote potential work, and
              to deliver any services you engage us for. Submitting the form
              does not commit you to anything.
            </p>
          </section>

          <section>
            <h2 className="font-anonymous font-bold text-xl text-white">
              4. Where it&apos;s stored
            </h2>
            <p className="font-mono-tech text-sm text-zinc-400 leading-relaxed mt-3">
              Form submissions are transmitted over HTTPS and stored in a
              managed PostgreSQL database, accessible only to team members who
              need them to respond to you.
            </p>
          </section>

          <section>
            <h2 className="font-anonymous font-bold text-xl text-white">
              5. Who we share it with
            </h2>
            <p className="font-mono-tech text-sm text-zinc-400 leading-relaxed mt-3">
              Nobody outside 0DAY Research Team, except the infrastructure
              providers (hosting and database) that process data on our behalf
              to keep this site running. We never sell, rent or trade your
              information.
            </p>
          </section>

          <section>
            <h2 className="font-anonymous font-bold text-xl text-white">
              6. How long we keep it
            </h2>
            <p className="font-mono-tech text-sm text-zinc-400 leading-relaxed mt-3">
              Only as long as your enquiry or engagement is active, plus any
              period required for record-keeping or legal obligations. If you
              ask us to delete it, we will.
            </p>
          </section>

          <section>
            <h2 className="font-anonymous font-bold text-xl text-white">
              7. Your rights
            </h2>
            <p className="font-mono-tech text-sm text-zinc-400 leading-relaxed mt-3">
              You can ask us for a copy of the data we hold about you, ask for
              corrections, or ask us to delete it. Email{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[#de5cff] hover:underline break-all"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              and we&apos;ll action it, typically within 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-anonymous font-bold text-xl text-white">
              8. Changes to this policy
            </h2>
            <p className="font-mono-tech text-sm text-zinc-400 leading-relaxed mt-3">
              If we change this policy, we&apos;ll update this page and the
              date above.
            </p>
          </section>

          <section>
            <h2 className="font-anonymous font-bold text-xl text-white">
              9. Contact
            </h2>
            <p className="font-mono-tech text-sm text-zinc-400 leading-relaxed mt-3">
              0DAY Research Team ·{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[#de5cff] hover:underline break-all"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              · 0daysecurity.tech
            </p>
          </section>
        </div>

        <div className="mt-14 pt-8 border-t border-zinc-900">
          <Link
            href="/"
            className="font-mono-tech text-xs uppercase tracking-wider text-zinc-400 hover:text-[#de5cff] transition"
          >
            ← Back to 0daysecurity.tech
          </Link>
        </div>
      </main>
    </div>
  );
}
