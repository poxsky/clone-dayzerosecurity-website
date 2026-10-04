"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { services } from "@/lib/services";

type QuoteDialogProps = {
  open: boolean;
  service: string;
  onClose: () => void;
};

export function QuoteDialog({ open, service, onClose }: QuoteDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      setStatus("idle");
      setError("");
      setReference("");
      dialog.querySelector("form")?.reset();
      dialog.showModal();
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    } else {
      dialog.close();
    }
  }, [open]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: data.get("company") || "",
          contactName: data.get("name") || "",
          contactEmail: data.get("email") || "",
          contactPhone: data.get("phone") || "",
          selectedTab: service,
          selectedServices: [service],
          objectives: data.get("message") || "",
          easterEggDiscount: false,
          estimatedTimeline: "2-4 Weeks",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to submit");
      setStatus("success");
      setReference(json.id ? `REF-${json.id}` : "Received");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <dialog ref={dialogRef} className="quote-dialog" onCancel={onClose} onClick={(e) => { if (e.target === dialogRef.current) onClose(); }}>
      <div className="quote-dialog-inner">
        <button type="button" className="quote-close" onClick={onClose} aria-label="Close">×</button>
        {status === "success" ? (
          <div className="quote-success">
            <h2>Request received</h2>
            <p>We will get back to you shortly.</p>
            {reference && <p className="quote-ref">{reference}</p>}
            <button type="button" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <h2>Get a quote</h2>
            <p className="quote-intro">Tell us about your needs. Free scoping included.</p>
            <form onSubmit={handleSubmit}>
              <label>
                Company
                <input name="company" type="text" required />
              </label>
              <label>
                Your name
                <input name="name" type="text" required />
              </label>
              <label>
                Email
                <input name="email" type="email" required />
              </label>
              <label>
                Phone
                <input name="phone" type="tel" />
              </label>
              <label>
                Message / Objectives
                <textarea name="message" rows={4} />
              </label>
              {status === "error" && <p className="quote-error">{error}</p>}
              <button type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Submit request"}
              </button>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
