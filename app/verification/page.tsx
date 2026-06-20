'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const token = () => typeof window !== 'undefined' ? localStorage.getItem('wemove_token') : '';

export default function VerificationQueuePage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState<Record<string, string>>({});

  async function load() {
    const r = await fetch(`${API}/api/admin/verification-queue`, { headers: { Authorization: `Bearer ${token()}` } });
    const d = await r.json();
    setDocs(d.documents || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAction(docId: string, action: 'approve' | 'reject') {
    await fetch(`${API}/api/admin/verification/${docId}/${action}`, {
      method: 'PATCH', headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: reason[docId] || '' }),
    });
    load();
  }

  return (
    <main className="min-h-screen bg-[#F6F7F9] text-[#0D1B2A] p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">📋 Verification Queue</h1>
        <p className="text-gray-500 mb-8">Review and approve/reject identity documents</p>
        {loading ? <p className="text-gray-500">Loading…</p> : docs.length === 0 ? <p className="text-gray-500">No pending documents.</p> : (
          <div className="flex flex-col gap-4">
            {docs.map(d => (
              <div key={d.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[#B8860B] font-bold text-sm">{d.doc_type}</span>
                    <p className="font-semibold mt-1">{d.user_name} · {d.user_phone}</p>
                    <p className="text-gray-500 text-sm">{d.extracted_number || '—'} · Submitted {new Date(d.created_at).toLocaleString()}</p>
                  </div>
                  {d.file_url && <a href={d.file_url} target="_blank" rel="noreferrer" className="text-[#B8860B] text-sm underline">View document ↗</a>}
                </div>
                <div className="flex gap-3 items-center">
                  <input className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#0D1B2A] placeholder-gray-400"
                    placeholder="Rejection reason (required if rejecting)" value={reason[d.id] || ''} onChange={e => setReason(r => ({ ...r, [d.id]: e.target.value }))} />
                  <button onClick={() => handleAction(d.id, 'approve')} className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">✓ Approve</button>
                  <button onClick={() => handleAction(d.id, 'reject')} className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">✕ Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
