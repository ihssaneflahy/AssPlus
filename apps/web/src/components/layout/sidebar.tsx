'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

const navItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: '📊' },
  { href: '/clients', label: 'Clients', icon: '👤' },
  { href: '/primes', label: 'Primes', icon: '📋' },
  { href: '/encaissements', label: 'Encaissements', icon: '💰' },
  { href: '/versements', label: 'Versements', icon: '🏦' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-sm flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-blue-600">AssPlus</h1>
        <p className="text-xs text-gray-400 mt-0.5">Gestion Agence Assurance</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            )}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
