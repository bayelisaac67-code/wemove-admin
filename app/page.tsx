// WeMove Admin — Dashboard entry point
export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-[#0D1B2A] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">WeMove <span className="text-[#F5B800]">Admin</span></h1>
        <p className="text-gray-400 mb-8">Operations console — Phase 1</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Drivers', value: '—' },
            { label: 'Active Passengers', value: '—' },
            { label: 'Trips Today', value: '—' },
            { label: 'Pending Verifications', value: '—' },
          ].map((s) => (
            <div key={s.label} className="bg-[#162233] rounded-xl p-5 border border-[#243447]">
              <div className="text-2xl font-bold text-[#F5B800]">{s.value}</div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#162233] rounded-xl p-6 border border-[#243447]">
            <h2 className="font-semibold mb-4">Verification Queue</h2>
            <p className="text-gray-400 text-sm">No pending verifications.</p>
          </div>
          <div className="bg-[#162233] rounded-xl p-6 border border-[#243447]">
            <h2 className="font-semibold mb-4">Live Trips</h2>
            <p className="text-gray-400 text-sm">No active trips right now.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
