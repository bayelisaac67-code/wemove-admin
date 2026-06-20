'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const token = () => typeof window !== 'undefined' ? localStorage.getItem('wemove_token') : '';
const STATUS_COLOR: Record<string, string> = { OPEN: '#ef4444', ACKNOWLEDGED: '#F5B800', RESOLVED: '#4CAF50' };

export default function SOSPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const r = await fetch(`${API}/api/admin/sos`, { headers: { Authorization: `Bearer ${token()}` } });
    const d = await r.json();
    setEvents(d.events || []);
    setLoading(false);
  }

  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, []);

  async function acknowledge(id: string) {
    await fetch(`${API}/api/admin/sos/${id}/acknowledge`, { method: 'PATCH', headers: { Authorization: `Bearer ${token()}` } });
    load();
  }
  async function resolve(id: string) {
    await fetch(`${API}/api/admin/sos/${id}/resolve`, { method: 'PATCH', headers: { Authorization: `Bearer ${token()}` } });
    load();
  }

  const open = events.filter(e => e.status === 'OPEN');

  return (
    <main className="min-h-screen bg-[#0D1B2A] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold">🆘 SOS & Disputes</h1>
          {open.length > 0 && <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">{open.length} OPEN</span>}
        </div>
        <p className="text-gray-400 mb-8">Emergency events auto-refresh every 30 seconds</p>
        {loading ? <p className="text-gray-400">Loading…</p> : events.length === 0 ? <p className="text-gray-400">No SOS events recorded.</p> : (
          <div className="flex flex-col gap-4">
            {events.map(e => (
              <div key={e.id} className="bg-[#162233] rounded-xl p-6 border" style={{ borderColor: e.status === 'OPEN' ? '#ef4444' : '#243447' }}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-bold text-sm px-2 py-0.5 rounded-full" style={{ background: (STATUS_COLOR[e.status] || '#888') + '22', color: STATUS_COLOR[e.status] || '#888' }}>{e.status}</span>
                    <p className="font-semibold mt-2">{e.user_name} · {e.user_phone}</p>
                    <p className="text-gray-400 text-sm">{new Date(e.created_at).toLocaleString()}</p>
                    {e.location && <p className="text-gray-400 text-sm">📍 {e.location.lat?.toFixed(5)}, {e.location.lng?.toFixed(5)}</p>}
                    {e.trip_id && <p className="text-gray-400 text-sm">Trip: {e.trip_id}</p>}
                  </div>
                  <div className="flex gap-2">
                    {e.status === 'OPEN' && <button onClick={() => acknowledge(e.id)} className="bg-yellow-700 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm">Acknowledge</button>}
                    {e.status !== 'RESOLVED' && <button onClick={() => resolve(e.id)} className="bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm">Resolve</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
