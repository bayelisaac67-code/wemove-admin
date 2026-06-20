'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('+233200000000');
  const [code, setCode] = useState('');
  const [hint, setHint] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendOtp() {
    setError(''); setLoading(true);
    try {
      const r = await fetch(`${API}/api/auth/send-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const d = await r.json();
      if (!d.success) { setError(d.errors?.[0]?.msg || d.error || 'Could not send code'); return; }
      if (d.devCode) { setHint(`Dev code: ${d.devCode}`); setCode(d.devCode); }
      setStep('code');
    } catch { setError('Network error — is the API running?'); }
    finally { setLoading(false); }
  }

  async function verify() {
    setError(''); setLoading(true);
    try {
      const r = await fetch(`${API}/api/auth/verify-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });
      const d = await r.json();
      if (!d.success) { setError(d.error || 'Wrong code'); return; }
      if (!d.user?.is_admin) { setError('This account is not an admin.'); return; }
      localStorage.setItem('wemove_token', d.token);
      router.push('/');
    } catch { setError('Network error — is the API running?'); }
    finally { setLoading(false); }
  }

  return (
    <main className="min-h-screen bg-[#0D1B2A] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-3xl font-extrabold mb-1">We<span className="text-[#F5B800]">Move</span></div>
        <p className="text-gray-400 mb-8">Operations Console — Admin sign in</p>

        {step === 'phone' ? (
          <>
            <label className="text-sm text-gray-400 mb-1 block">Admin phone number</label>
            <input
              className="w-full bg-[#162233] border border-[#243447] rounded-lg px-4 py-3 mb-4 text-white"
              value={phone} onChange={e => setPhone(e.target.value)} placeholder="+233XXXXXXXXX"
            />
            <button onClick={sendOtp} disabled={loading}
              className="w-full bg-[#F5B800] text-[#0D1B2A] font-bold py-3 rounded-lg disabled:opacity-60">
              {loading ? 'Sending…' : 'Send code'}
            </button>
          </>
        ) : (
          <>
            <label className="text-sm text-gray-400 mb-1 block">Enter 6-digit code</label>
            <input
              className="w-full bg-[#162233] border border-[#243447] rounded-lg px-4 py-3 mb-2 text-white tracking-widest text-lg"
              value={code} onChange={e => setCode(e.target.value)} placeholder="------" maxLength={6}
            />
            {hint && <p className="text-[#F5B800] text-sm mb-3">{hint}</p>}
            <button onClick={verify} disabled={loading}
              className="w-full bg-[#F5B800] text-[#0D1B2A] font-bold py-3 rounded-lg disabled:opacity-60">
              {loading ? 'Verifying…' : 'Verify & sign in'}
            </button>
            <button onClick={() => { setStep('phone'); setCode(''); setHint(''); }}
              className="w-full text-gray-400 text-sm mt-3">← Change number</button>
          </>
        )}

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </div>
    </main>
  );
}
