import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h1>
      <p className="text-gray-500">Bienvenue, <span className="font-medium text-gray-900">{session?.user?.name}</span></p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {[
          { label: 'Clients', value: '—', icon: '👤', color: 'bg-blue-500' },
          { label: 'Primes émises', value: '—', icon: '📋', color: 'bg-green-500' },
          { label: 'Encaissements', value: '—', icon: '💰', color: 'bg-yellow-500' },
          { label: 'Versements', value: '—', icon: '🏦', color: 'bg-purple-500' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className={`${card.color} text-white text-2xl rounded-lg w-12 h-12 flex items-center justify-center`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
