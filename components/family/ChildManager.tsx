"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type RewardItem = { id: string; difficulty: string; label: string };
type Attempt = { id: string; subject: string; grade: number; topic: string; difficulty: string; score: number | null; count: number; passed: boolean | null; createdAt: string };
type Claim = { id: string; prizeLabel: string; status: string; createdAt: string; attempt: { subject: string; topic: string; difficulty: string } };

const DIFFICULTIES = ["easy", "medium", "hard"] as const;
const AVATARS = ["🧒", "👦", "👧", "🦸", "🦸‍♀️", "🐯", "🦄", "🐼", "🚀", "⭐"];

export default function ChildManager({
  childId, childName, childAvatar, childGrade, childHasPin,
}: { childId: string; childName: string; childAvatar: string; childGrade: number; childHasPin: boolean }) {
  const router = useRouter();
  const [items, setItems] = useState<RewardItem[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [newLabel, setNewLabel] = useState<Record<string, string>>({ easy: "", medium: "", hard: "" });
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(childName);
  const [avatar, setAvatar] = useState(childAvatar);
  const [grade, setGrade] = useState(childGrade);
  const [pin, setPin] = useState(""); // blank = leave unchanged
  const [clearPin, setClearPin] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => { loadAll(); }, [childId]);

  async function loadAll() {
    setLoading(true);
    const [rewardsRes, historyRes] = await Promise.all([
      fetch(`/api/family/children/${childId}/rewards`),
      fetch(`/api/family/children/${childId}/history`),
    ]);
    const rewardsData = await rewardsRes.json();
    const historyData = await historyRes.json();
    if (rewardsRes.ok) setItems(rewardsData.items);
    if (historyRes.ok) { setClaims(historyData.claims); setAttempts(historyData.attempts); }
    setLoading(false);
  }

  async function saveEdits(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setEditError("");
    const res = await fetch(`/api/family/children/${childId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        avatar,
        gradeDefault: grade,
        pin: clearPin ? "" : pin || undefined, // omit entirely if left blank and not clearing — keeps existing PIN
      }),
    });
    let data: any = {};
    try { data = await res.json(); } catch {}
    setSaving(false);
    if (!res.ok) { setEditError(data.error || "Something went wrong."); return; }
    setEditing(false);
    setPin("");
    setClearPin(false);
    router.refresh(); // re-fetch server-rendered props (name/avatar/grade shown in the header)
  }

  async function deleteChild() {
    if (!confirm(`Delete ${name}'s profile? This removes their reward history and challenge history too — this can't be undone.`)) return;
    await fetch(`/api/family/children/${childId}`, { method: "DELETE" });
    router.push("/dashboard/family");
  }

  async function addReward(difficulty: string) {
    const label = newLabel[difficulty]?.trim();
    if (!label) return;
    const res = await fetch(`/api/family/children/${childId}/rewards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ difficulty, label }),
    });
    if (res.ok) {
      setNewLabel({ ...newLabel, [difficulty]: "" });
      loadAll();
    }
  }

  async function removeReward(rewardId: string) {
    await fetch(`/api/family/children/${childId}/rewards/${rewardId}`, { method: "DELETE" });
    loadAll();
  }

  async function fulfillClaim(claimId: string) {
    await fetch(`/api/family/claims/${claimId}/fulfill`, { method: "POST" });
    loadAll();
  }

  if (loading) return <p className="text-slate-400">Loading…</p>;

  const pendingClaims = claims.filter((c) => c.status === "pending");

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{childAvatar}</span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{childName}</h1>
            <button onClick={() => setEditing(!editing)} className="text-xs text-slate-500 dark:text-slate-400 underline">
              {editing ? "Cancel editing" : "Edit profile"}
            </button>
          </div>
        </div>
        <Link
          href={`/dashboard/family/${childId}/challenge`}
          className="bg-amber-400 text-amber-950 font-semibold px-5 py-2.5 rounded-lg hover:bg-amber-300"
        >
          🎯 Start a Challenge
        </Link>
      </div>

      {editing && (
        <form onSubmit={saveEdits} className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-3 bg-white dark:bg-slate-900 max-w-sm">
          <input
            value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
          <div className="flex flex-wrap gap-2">
            {AVATARS.map((a) => (
              <button
                type="button" key={a} onClick={() => setAvatar(a)}
                className={`text-xl p-1.5 rounded-lg border ${avatar === a ? "border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800" : "border-transparent"}`}
              >
                {a}
              </button>
            ))}
          </div>
          <div className="flex gap-3 items-center">
            <label className="text-sm text-slate-600 dark:text-slate-300">Grade</label>
            <select value={grade} onChange={(e) => setGrade(parseInt(e.target.value, 10))} className="border border-slate-300 rounded-lg px-2 py-1 text-sm">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <input
              value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setClearPin(false); }}
              maxLength={4} placeholder={childHasPin ? "New 4-digit PIN (leave blank to keep current)" : "Optional 4-digit PIN"}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            {childHasPin && (
              <label className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                <input type="checkbox" checked={clearPin} onChange={(e) => { setClearPin(e.target.checked); if (e.target.checked) setPin(""); }} />
                Remove PIN entirely
              </label>
            )}
          </div>
          {editError && <p className="text-xs text-red-600">{editError}</p>}
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={saving} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button type="button" onClick={deleteChild} className="text-red-600 text-sm px-3 py-2 hover:underline">
              Delete profile
            </button>
          </div>
        </form>
      )}

      {pendingClaims.length > 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950 dark:border-amber-800 p-5">
          <h2 className="font-semibold text-amber-900 dark:text-amber-200 mb-3">🎉 Prizes to give</h2>
          <div className="space-y-2">
            {pendingClaims.map((c) => (
              <div key={c.id} className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-lg px-4 py-3">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{c.prizeLabel}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Earned from {c.attempt.difficulty} {c.attempt.topic} — {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => fulfillClaim(c.id)}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm px-4 py-1.5 rounded-lg font-medium"
                >
                  Mark as given ✅
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Reward pool</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          When {childName} passes a challenge, one reward is picked at random from that difficulty's list below.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {DIFFICULTIES.map((d) => (
            <div key={d} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">{d}</p>
              <ul className="space-y-1.5 mb-3">
                {items.filter((i) => i.difficulty === d).map((i) => (
                  <li key={i.id} className="flex items-center justify-between text-sm bg-slate-50 dark:bg-slate-800 rounded-lg px-2.5 py-1.5">
                    <span className="text-slate-800 dark:text-slate-200">{i.label}</span>
                    <button onClick={() => removeReward(i.id)} className="text-slate-400 hover:text-red-600 text-xs">✕</button>
                  </li>
                ))}
                {items.filter((i) => i.difficulty === d).length === 0 && (
                  <li className="text-xs text-slate-400">No rewards yet</li>
                )}
              </ul>
              <div className="flex gap-1.5">
                <input
                  value={newLabel[d]}
                  onChange={(e) => setNewLabel({ ...newLabel, [d]: e.target.value })}
                  onKeyDown={(e) => { if (e.key === "Enter") addReward(d); }}
                  placeholder="e.g. $5, Roblox card"
                  className="flex-1 border border-slate-300 rounded-lg px-2 py-1 text-xs"
                />
                <button onClick={() => addReward(d)} className="text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-2.5 rounded-lg font-medium">+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Challenge history</h2>
        {attempts.length === 0 ? (
          <p className="text-sm text-slate-400">No challenges taken yet.</p>
        ) : (
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-left">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Topic</th>
                  <th className="px-4 py-2">Difficulty</th>
                  <th className="px-4 py-2">Score</th>
                  <th className="px-4 py-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a) => (
                  <tr key={a.id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{a.topic} (G{a.grade})</td>
                    <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{a.difficulty}</td>
                    <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{a.score ?? "—"}/{a.count}</td>
                    <td className="px-4 py-2">
                      {a.passed === null ? <span className="text-slate-400">in progress</span> : a.passed ? <span className="text-emerald-600">Passed ✅</span> : <span className="text-slate-500">Not yet</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
