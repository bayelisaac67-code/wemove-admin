'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const token = () => typeof window !== 'undefined' ? localStorage.getItem('wemove_token') : '';
const STATUS_COLOR: Record<string, string> = { PUBLISHED: '#F5B800', IN_PROGRESS: '#2196F3', COMPLETED: '#4CAF50', CANCELLED: '#ef4444' };

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/admin/trips?status=${filter === 'ALL' ? '' : filter}`, { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json()).then(d => setTrips(d.trips || [])).finally(() => setLoading(false));
  }, [filter]);

  return (
    <main className="min-h-screen bg-[#F6F7F9] text-[#0D1B2A] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">🚗 Trips & Bookings</h1>
        <p className="text-gray-500 mb-6">Live and historical trip monitor</p>
        <div className="flex gap-2 mb-6">
          {['ALL', 'PUBLISHED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${filter === s ? 'bg-[#F5B800] text-[#0D1B2A]' : 'bg-white text-gray-500 hover:text-[#0D1B2A] border border-gray-200'}`}>{s}</button>
          ))}
        </div>
        {loading ? <p className="text-gray-500">Loading…</p> : (
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm p-2">
            <table className="w-full text-sm">
              <thead><tr className="text-gray-500 border-b border-gray-200">
                {['Departure', 'Driver', 'Route', 'Seats', 'Bookings', 'Status'].map(h => <th key={h} className="text-left py-3 px-4 font-medium">{h}</th>)}
              </tr></thead>
              <tbody>
                {trips.map(t => (
                  <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">{new Date(t.departure_time).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="py-3 px-4">{t.driver_name}</td>
                    <td className="py-3 px-4">{t.origin_name} → {t.destination_name}</td>
                    <td className="py-3 px-4">{t.available_seats}/{t.total_seats}</td>
                    <td className="py-3 px-4">{t.booking_count || 0}</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: (STATUS_COLOR[t.status] || '#888') + '22', color: STATUS_COLOR[t.status] || '#888' }}>{t.status}</span></td>
                  </tr>
                ))}
                {trips.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-gray-500">No trips found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
