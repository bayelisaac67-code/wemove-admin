'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const token = () => typeof window !== 'undefined' ? localStorage.getItem('wemove_token') : '';
const STATUS_COLOR: Record<string, string> = { ACTIVE: '#4CAF50', SUSPENDED: '#F5B800', BANNED: '#ef4444' };

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  async function load(q = '') {
    setLoading(true);
    const r = await fetch(`${API}/api/admin/users?search=${encodeURIComponent(q)}`, { headers: { Authorization: `Bearer ${token()}` } });
    const d = await r.json();
    setUsers(d.users || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function suspend(userId: string) {
    await fetch(`${API}/api/admin/users/${userId}/suspend`, { method: 'PATCH', headers: { Authorization: `Bearer ${token()}` } });
    load(search);
  }

  return (
    <main className="min-h-screen bg-[#F6F7F9] text-[#0D1B2A] p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">👥 Users</h1>
        <p className="text-gray-500 mb-6">Search and manage platform users</p>
        <div className="flex gap-3 mb-6">
          <input className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-[#0D1B2A] placeholder-gray-400" placeholder="Search by name or phone…" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load(search)} />
          <button onClick={() => load(search)} className="bg-[#F5B800] text-[#0D1B2A] font-bold px-5 py-2 rounded-lg">Search</button>
        </div>
        {loading ? <p className="text-gray-500">Loading…</p> : (
          <div className="flex flex-col gap-3">
            {users.map(u => (
              <div key={u.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-semibold">{u.full_name} <span className="text-gray-500 font-normal">({u.preferred_name})</span></p>
                  <p className="text-gray-500 text-sm">{u.phone} · Reliability {u.reliability_score}/100</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: STATUS_COLOR[u.account_status] + '22', color: STATUS_COLOR[u.account_status] }}>{u.account_status}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{u.verification_status}</span>
                    {u.role_flags?.includes('DRIVER') && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: '#F5B80022', color: '#B8860B' }}>DRIVER</span>}
                  </div>
                </div>
                <button onClick={() => suspend(u.id)} className="text-red-600 hover:text-red-500 text-sm border border-red-300 hover:border-red-500 px-3 py-1.5 rounded-lg transition-colors">
                  {u.account_status === 'SUSPENDED' ? 'Reinstate' : 'Suspend'}
                </button>
              </div>
            ))}
            {users.length === 0 && !loading && <p className="text-gray-500">No users found.</p>}
          </div>
        )}
      </div>
    </main>
  );
}
