"use client";
import { useState, useEffect } from "react";
import DrawingSurface from "@/components/whiteboard/DrawingSurface";
import { exportPagesToPdf } from "./pdfExport";

type WorksheetPage = { id: string; snapshot: string | null };
type Worksheet = { id: string; title: string; subject: string | null; grade: number | null; shareCode: string; pages: WorksheetPage[] };

export default function CustomWorksheetEditor({ id }: { id: string }) {
  const [ws, setWs] = useState<Worksheet | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingPage, setAddingPage] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");

  useEffect(() => { load(); }, [id]);

  async function load() {
    const res = await fetch(`/api/custom-worksheet/${id}`);
    const data = await res.json();
    if (res.ok) setWs(data.worksheet);
    setLoading(false);
  }

  async function savePage(pageId: string, dataUrl: string) {
    await fetch(`/api/custom-worksheet/${id}/page`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId, snapshot: dataUrl }),
    });
    setWs((prev) => prev ? { ...prev, pages: prev.pages.map((p) => (p.id === pageId ? { ...p, snapshot: dataUrl } : p)) } : prev);
  }

  async function addPage() {
    setAddingPage(true);
    const res = await fetch(`/api/custom-worksheet/${id}/add-page`, { method: "POST" });
    const data = await res.json();
    setAddingPage(false);
    if (res.ok) {
      setWs((prev) => prev ? { ...prev, pages: data.pages } : prev);
      setCurrentPageIndex(data.pages.length - 1);
    }
  }

  async function downloadPdf() {
    if (!ws) return;
    setExporting(true);
    try {
      await exportPagesToPdf(ws.pages, `${ws.title.replace(/[^a-z0-9]/gi, "-")}.pdf`);
    } finally {
      setExporting(false);
    }
  }

  const shareUrl = ws && typeof window !== "undefined" ? `${window.location.origin}/w/${ws.shareCode}` : "";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link:", shareUrl);
    }
  }

  async function sendEmails() {
    const emails = emailInput.split(/[,\s]+/).map((e) => e.trim()).filter(Boolean);
    if (emails.length === 0) return;
    setSendingEmail(true);
    setEmailStatus("");
    const res = await fetch(`/api/custom-worksheet/${id}/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emails }),
    });
    const data = await res.json();
    setSendingEmail(false);
    if (res.ok) {
      setEmailStatus(`Sent to ${data.sent} recipient${data.sent === 1 ? "" : "s"}${data.failed ? ` (${data.failed} failed)` : ""}.`);
      setEmailInput("");
    } else {
      setEmailStatus(data.error || "Something went wrong.");
    }
  }

  if (loading) return <p className="text-slate-400 text-center py-16">Loading…</p>;
  if (!ws) return <p className="text-red-600 text-center py-16">Worksheet not found.</p>;

  const currentPage = ws.pages[currentPageIndex];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{ws.title}</h1>
          <p className="text-xs text-slate-400">{[ws.subject, ws.grade ? `Grade ${ws.grade}` : null].filter(Boolean).join(" · ")}</p>
        </div>
        <button
          onClick={downloadPdf} disabled={exporting}
          className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm px-4 py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {exporting ? "Preparing…" : "⬇ Download PDF"}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {ws.pages.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setCurrentPageIndex(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${i === currentPageIndex ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white" : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`}
          >
            Page {i + 1}
          </button>
        ))}
        <button
          onClick={addPage} disabled={addingPage || ws.pages.length >= 20}
          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-dashed border-slate-400 dark:border-slate-600 text-slate-500 dark:text-slate-400 disabled:opacity-50"
        >
          {addingPage ? "Adding…" : "+ Add page"}
        </button>
      </div>

      <DrawingSurface
        key={currentPage.id}
        remoteSnapshot={currentPage.snapshot}
        remoteVersion={null}
        onUpload={(dataUrl) => savePage(currentPage.id, dataUrl)}
      />

      <div className="mt-6 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">Share with students</p>

        <div className="flex items-center gap-2 mb-4">
          <input readOnly value={shareUrl} onFocus={(e) => e.target.select()} className="flex-1 text-xs border border-slate-300 rounded-lg px-2 py-1.5" />
          <button onClick={copyLink} className="text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap">
            {copied ? "Copied ✓" : "Copy link"}
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">Or email it directly (separate multiple addresses with commas):</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={emailInput} onChange={(e) => setEmailInput(e.target.value)}
            placeholder="student1@example.com, student2@example.com"
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={sendEmails} disabled={sendingEmail || !emailInput.trim()}
            className="border border-slate-900 dark:border-white text-slate-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {sendingEmail ? "Sending…" : "Send email"}
          </button>
        </div>
        {emailStatus && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{emailStatus}</p>}
      </div>
    </div>
  );
}
