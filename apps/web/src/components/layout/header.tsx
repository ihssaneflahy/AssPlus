'use client';

import { signOut, useSession } from 'next-auth/react';

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{session?.user?.name}</span>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}
