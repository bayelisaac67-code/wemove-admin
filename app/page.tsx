'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const NAV = [
  { href: '/verification', label: '📋 Verification Queue', desc: 'Review pending passenger & driver ID submissions' },
  { href: '/users', label: '👥 Users', desc: 'Search, view, suspend or adjust user accounts' },
  { href: '/corridors', label: '🗺️ Corridors & Pickup Points', desc: 'Manage routes and boarding locations' },
  { href: '/trips', label: '🚗 Trips & Bookings', desc: 'Live and historical trip monitor' },
  { href: '/sos', label: '🆘 SOS & Disputes', desc: 'Incoming emergency events and dispute tickets' },
  { href: '/metrics', label: '📊 Operational Metrics', desc: 'Platform health, match rates, cancellations' },
];

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/metrics`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('wemove_token')}` },
    }).then(r => r.json()).then(setMetrics).catch(() => {});
  }, []);

  const stats = [
    { label: 'Active Drivers', value: metrics?.active_drivers ?? '—' },
    { label: 'Active Passengers', value: metrics?.active_passengers ?? '—' },
    { label: 'Trips Today', value: metrics?.trips_today ?? '—' },
    { label: 'Pending Verifications', value: metrics?.pending_verifications ?? '—' },
  ];

  return (
    <main className="min-h-screen bg-[#0D1B2A] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">WeMove <span className="text-[#F5B800]">Admin</span></h1>
        <p className="text-gray-400 mb-8">Operations console · Accra Central ↔ Oyarifa pilot</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map(s => (
            <div key={s.label} className="bg-[#162233] rounded-xl p-5 border border-[#243447]">
              <div className="text-2xl font-bold text-[#F5B800]">{s.value}</div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {NAV.map(n => (
            <Link key={n.href} href={n.href} className="no-underline">
              <div className="bg-[#162233] rounded-xl p-6 border border-[#243447] hover:border-[#F5B800] transition-colors cursor-pointer h-full">
                <div className="text-xl font-semibold mb-2">{n.label}</div>
                <p className="text-gray-400 text-sm leading-relaxed m-0">{n.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
