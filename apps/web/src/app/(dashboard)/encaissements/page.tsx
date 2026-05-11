export default function EncaissementsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Encaissements</h1>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          + Nouvel encaissement
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
        <p className="text-4xl mb-3">💰</p>
        <p className="font-medium">Aucun encaissement pour le moment</p>
        <p className="text-sm mt-1">Les encaissements apparaîtront ici</p>
      </div>
    </div>
  );
}
