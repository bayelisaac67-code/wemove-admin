'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const token = () => typeof window !== 'undefined' ? localStorage.getItem('wemove_token') : '';

export default function CorridorsPage() {
  const [corridors, setCorridors] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [points, setPoints] = useState<any[]>([]);
  const [newPoint, setNewPoint] = useState({ name: '', lat: '', lng: '', radius: '50' });
  const [loading, setLoading] = useState(true);

  async function loadCorridors() {
    const r = await fetch(`${API}/api/corridors`, { headers: { Authorization: `Bearer ${token()}` } });
    const d = await r.json();
    setCorridors(d.corridors || []);
    setLoading(false);
  }

  async function loadPoints(corridorId: string) {
    const r = await fetch(`${API}/api/corridors/${corridorId}/pickup-points`, { headers: { Authorization: `Bearer ${token()}` } });
    const d = await r.json();
    setPoints(d.pickup_points || []);
  }

  useEffect(() => { loadCorridors(); }, []);

  async function selectCorridor(c: any) {
    setSelected(c);
    await loadPoints(c.id);
  }

  async function addPoint() {
    if (!selected || !newPoint.name || !newPoint.lat || !newPoint.lng) return;
    await fetch(`${API}/api/admin/corridors/${selected.id}/pickup-points`, {
      method: 'POST', headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newPoint.name, lat: parseFloat(newPoint.lat), lng: parseFloat(newPoint.lng), geofence_radius_m: parseInt(newPoint.radius) }),
    });
    setNewPoint({ name: '', lat: '', lng: '', radius: '50' });
    loadPoints(selected.id);
  }

  return (
    <main className="min-h-screen bg-[#0D1B2A] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">🗺️ Corridors & Pickup Points</h1>
        <p className="text-gray-400 mb-8">Manage routes and boarding locations</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h2 className="font-semibold mb-3 text-gray-300">Corridors</h2>
            {loading ? <p className="text-gray-400 text-sm">Loading…</p> : corridors.map(c => (
              <button key={c.id} onClick={() => selectCorridor(c)} className={`w-full text-left p-4 rounded-xl mb-2 border transition-colors ${selected?.id === c.id ? 'border-[#F5B800] bg-[#162233]' : 'border-[#243447] bg-[#162233] hover:border-[#F5B800]'}`}>
                <p className="font-semibold text-sm">{c.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{c.status}</p>
              </button>
            ))}
          </div>
          {selected && (
            <div className="md:col-span-2">
              <h2 className="font-semibold mb-3 text-gray-300">Pickup points — {selected.name}</h2>
              <div className="flex flex-col gap-2 mb-6">
                {points.map((p, i) => (
                  <div key={p.id} className="bg-[#162233] rounded-xl px-4 py-3 border border-[#243447] flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#F5B800] text-[#0D1B2A] text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{p.name}</p>
                      <p className="text-gray-400 text-xs">{p.location?.lat?.toFixed(5)}, {p.location?.lng?.toFixed(5)} · {p.geofence_radius_m}m radius</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#162233] rounded-xl p-5 border border-[#243447]">
                <h3 className="font-semibold mb-3 text-sm">Add pickup point</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {[{ label: 'Name', key: 'name', placeholder: 'e.g. 37 Station' }, { label: 'Latitude', key: 'lat', placeholder: '5.5502' }, { label: 'Longitude', key: 'lng', placeholder: '-0.1969' }, { label: 'Geofence (m)', key: 'radius', placeholder: '50' }].map(f => (
                    <div key={f.key}>
                      <label className="text-xs text-gray-400 mb-1 block">{f.label}</label>
                      <input className="w-full bg-[#0D1B2A] border border-[#243447] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600" placeholder={f.placeholder} value={newPoint[f.key as keyof typeof newPoint]} onChange={e => setNewPoint(p => ({ ...p, [f.key]: e.target.value }))} />
                    </div>
                  ))}
                </div>
                <button onClick={addPoint} className="bg-[#F5B800] text-[#0D1B2A] font-bold px-4 py-2 rounded-lg text-sm w-full">Add pickup point</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
