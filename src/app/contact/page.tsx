"use client"

import { useState } from "react"
import { siteConfig } from "@/../site.config"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState<"idle" | "sent">("idle")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // For now, just show confirmation. Wire to email API later.
    setStatus("sent")
  }

  if (status === "sent") {
    return (
      <div className="mx-auto max-w-xl text-center py-16">
        <h1 className="text-2xl font-bold text-white mb-3">Message Sent</h1>
        <p className="text-zinc-400">
          Thanks for getting in touch. We'll get back to you as soon as
          possible.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-3xl font-bold text-white mb-2">Contact Us</h1>
      <p className="text-zinc-400 mb-8">
        Have a question, feedback, or content suggestion for {siteConfig.name}?
        Drop us a message below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Name
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[var(--accent)] focus:outline-none"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[var(--accent)] focus:outline-none"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Message
          </label>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[var(--accent)] focus:outline-none resize-none"
            placeholder="How can we help?"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg px-6 py-2.5 text-sm font-semibold text-black"
          style={{ background: "var(--accent)" }}
        >
          Send Message
        </button>
      </form>
    </div>
  )
}
