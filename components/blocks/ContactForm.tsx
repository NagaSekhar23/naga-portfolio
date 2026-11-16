"use client";

import { useState } from "react";

/**
 * No backend: composes a pre-filled email in the visitor's mail app.
 * Swap `onSubmit` for a server action / form service later without touching the page.
 */
export function ContactForm({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "");
    const from = String(f.get("email") ?? "");
    const message = String(f.get("message") ?? "");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Message from ${name}`)}&body=${encodeURIComponent(`${message}\n\n— ${name} (${from})`)}`;
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  }

  const field = "mt-1.5 w-full rounded-md border border-line-strong bg-surface px-3.5 py-2.5 text-[15px] outline-none transition-colors placeholder:text-subtle focus:border-accent";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Name
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="block text-sm font-medium">
          Your email
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
      </div>
      <label className="block text-sm font-medium">
        Message
        <textarea name="message" required rows={6} className={field} />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent hover:text-accent-ink">
          Compose email
        </button>
        <button type="button" onClick={copy} className="text-sm text-muted underline decoration-line-strong underline-offset-4 hover:text-accent">
          {copied ? "Copied ✓" : "Copy email address"}
        </button>
        <span role="status" aria-live="polite" className="sr-only">{copied ? "Email address copied" : ""}</span>
      </div>
      <p className="text-xs text-subtle">Opens your email app with the message pre-filled. Nothing is sent from this site.</p>
    </form>
  );
}
