"use client"

import { useState } from "react"
import { siteConfig } from "@/../site.config"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  if (!siteConfig.newsletter.enabled) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
      setStatus("success")
      setEmail("")
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 text-center">
        <p className="font-semibold text-white">You're subscribed!</p>
        <p className="text-sm text-zinc-400 mt-1">
          We'll send you the latest articles.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6">
      <h3 className="font-semibold text-white mb-1">Stay updated</h3>
      <p className="text-sm text-zinc-400 mb-4">
        Get the latest {siteConfig.name} articles in your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-[var(--accent)] focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
          style={{ background: "var(--accent)" }}
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-sm text-red-400">Something went wrong. Try again.</p>
      )}
    </div>
  )
}
