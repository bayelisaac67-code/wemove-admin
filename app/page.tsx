'use client';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/metrics`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('wemove_token')}` },
    }).then(r => r.json()).then(setMetrics).catch(() => {});
  }, []);

  const stats = [
    { label: 'Active Drivers', value: metrics?.active_drivers ?? '—', icon: '🚗' },
    { label: 'Active Passengers', value: metrics?.active_passengers ?? '—', icon: '👥' },
    { label: 'Trips Today', value: metrics?.trips_today ?? '—', icon: '📅' },
    { label: 'Pending Verifications', value: metrics?.pending_verifications ?? '—', icon: '⏳' },
  ];

  return (
    <main className="min-h-screen bg-[#F6F7F9] text-[#0D1B2A] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-gray-500 mb-8">Operations console · Accra Central ↔ Oyarifa pilot</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="text-2xl mb-3">{s.icon}</div>
              <div className="text-3xl font-bold text-[#0D1B2A]">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="font-semibold text-lg mb-1">Welcome to WeMove Operations</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Use the sidebar to review identity verifications, manage users, monitor live trips and
            bookings, respond to SOS events, and track platform health metrics for the pilot corridor.
          </p>
        </div>
      </div>
    </main>
  );
}
