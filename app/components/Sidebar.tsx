'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Dashboard', icon: '🏠' },
  { href: '/verification', label: 'Verification', icon: '📋' },
  { href: '/users', label: 'Users', icon: '👥' },
  { href: '/corridors', label: 'Corridors', icon: '🗺️' },
  { href: '/trips', label: 'Trips', icon: '🚗' },
  { href: '/sos', label: 'SOS & Disputes', icon: '🆘' },
  { href: '/metrics', label: 'Metrics', icon: '📊' },
];

export default function Sidebar() {
  const pathname = usePathname();

  // The login screen is full-bleed — no sidebar.
  if (pathname === '/login') return null;

  return (
    <aside className="w-60 min-h-screen bg-[#162233] border-r border-[#243447] flex flex-col p-5 shrink-0">
      <div className="mb-10 px-2">
        <div className="text-2xl font-extrabold tracking-tight">
          We<span className="text-[#F5B800]">Move</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">Operations Console</div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map((n) => {
          const active = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`no-underline flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#F5B800] text-[#0D1B2A]'
                  : 'text-gray-300 hover:bg-[#0D1B2A] hover:text-white'
              }`}
            >
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-2 pt-6 text-xs text-gray-600">
        Accra Central ↔ Oyarifa pilot
      </div>
    </aside>
  );
}
