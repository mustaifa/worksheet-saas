"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setStatus("error");
      return;
    }
    setStatus("sent");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <main>
      <Navbar />
      <section className="max-w-lg mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold">Contact us</h1>
        <p className="text-slate-600 mt-2">Questions, bug reports, feature requests — happy to hear them.</p>

        {status === "sent" ? (
          <div className="mt-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-4 text-sm">
            Thanks — your message has been sent. We'll get back to you soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="text" required placeholder="Your name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
            />
            <input
              type="email" required placeholder="Your email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
            />
            <textarea
              required minLength={5} placeholder="How can we help?" value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 min-h-[140px]"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit" disabled={status === "sending"}
              className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-700 disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </section>
      <Footer />
    </main>
  );
}
