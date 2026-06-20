'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const token = () => typeof window !== 'undefined' ? localStorage.getItem('wemove_token') : '';

export default function MetricsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/admin/metrics`, { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  const STATS = data ? [
    { label: 'Active Drivers', value: data.active_drivers, icon: '🚗' },
    { label: 'Active Passengers', value: data.active_passengers, icon: '👥' },
    { label: 'Trips Today', value: data.trips_today, icon: '📅' },
    { label: 'Bookings Today', value: data.bookings_today, icon: '🎫' },
    { label: 'Match Rate', value: data.match_rate ? `${(data.match_rate * 100).toFixed(1)}%` : '—', icon: '🎯' },
    { label: 'Avg Fare (GHS)', value: data.avg_fare ? data.avg_fare.toFixed(2) : '—', icon: '💰' },
    { label: 'Cancellation Rate', value: data.cancellation_rate ? `${(data.cancellation_rate * 100).toFixed(1)}%` : '—', icon: '❌' },
    { label: 'Pending Verifications', value: data.pending_verifications, icon: '⏳' },
    { label: 'Open SOS Events', value: data.open_sos, icon: '🆘' },
    { label: 'Total Users', value: data.total_users, icon: '👤' },
    { label: 'Completed Trips (All Time)', value: data.completed_trips_total, icon: '✅' },
    { label: 'Revenue Today (GHS)', value: data.revenue_today ? data.revenue_today.toFixed(2) : '—', icon: '📈' },
  ] : [];

  return (
    <main className="min-h-screen bg-[#0D1B2A] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">📊 Operational Metrics</h1>
        <p className="text-gray-400 mb-8">Platform health for the Accra Central ↔ Oyarifa pilot</p>
        {loading ? <p className="text-gray-400">Loading…</p> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {STATS.map(s => (
              <div key={s.label} className="bg-[#162233] rounded-xl p-5 border border-[#243447]">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-2xl font-bold text-[#F5B800]">{s.value ?? '—'}</div>
                <div className="text-sm text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
