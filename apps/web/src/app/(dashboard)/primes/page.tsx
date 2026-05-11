'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/modal';
import { Field, inputCls, selectCls } from '@/components/ui/form-field';
import { api } from '@/lib/api';

const schema = z.object({
  clientId: z.string().min(1, 'Client requis'),
  typeEmission: z.enum(['AFFAIRE_NOUVELLE', 'RENOUVELLEMENT', 'AVENANT_DE_PERCEPTION', 'AVENANT_DE_RISTOURNE', 'RESILIATION', 'ANNULATION']),
  numeroPolice: z.string().optional(),
  dateEmission: z.string().min(1, 'Date requise'),
  dateEffet: z.string().optional(),
  dateEcheance: z.string().optional(),
  montantTtc: z.coerce.number().positive('Montant requis'),
  montantNet: z.coerce.number().positive('Montant requis'),
  commissionBrute: z.coerce.number().positive('Commission requise'),
  commissionNet: z.coerce.number().positive('Commission requise'),
});

type Form = z.infer<typeof schema>;

const TYPE_LABELS: Record<string, string> = {
  AFFAIRE_NOUVELLE: 'Affaire nouvelle',
  RENOUVELLEMENT: 'Renouvellement',
  AVENANT_DE_PERCEPTION: 'Avenant de perception',
  AVENANT_DE_RISTOURNE: 'Avenant de ristourne',
  RESILIATION: 'Résiliation',
  ANNULATION: 'Annulation',
};

export default function PrimesPage() {
  const [open, setOpen] = useState(false);
  const [primes, setPrimes] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    api.get('/clients').then((r) => setClients(r.data)).catch(() => {});
    api.get('/primes').then((r) => setPrimes(r.data)).catch(() => {});
  }, []);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { typeEmission: 'AFFAIRE_NOUVELLE', dateEmission: new Date().toISOString().split('T')[0] },
  });

  async function onSubmit(data: Form) {
    setServerError('');
    try {
      const res = await api.post('/primes', data);
      setPrimes((prev) => [res.data, ...prev]);
      reset();
      setOpen(false);
    } catch (e: any) {
      setServerError(e.response?.data?.message ?? 'Erreur serveur');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Primes</h1>
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          + Nouvelle prime
        </button>
      </div>

      {primes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium">Aucune prime pour le moment</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm divide-y">
          {primes.map((p: any) => (
            <div key={p.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{p.numeroPolice ?? '—'}</p>
                <p className="text-xs text-gray-400">{TYPE_LABELS[p.typeEmission]} · {p.client?.nomComplet}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{Number(p.montantTtc).toLocaleString('fr-MA')} MAD</p>
                <p className="text-xs text-gray-400">{p.dateEmission?.slice(0, 10)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Nouvelle prime">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Client" error={errors.clientId?.message} required>
            <select {...register('clientId')} className={selectCls}>
              <option value="">— Sélectionner un client —</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.nomComplet}</option>)}
            </select>
          </Field>

          <Field label="Type d'émission" required>
            <select {...register('typeEmission')} className={selectCls}>
              {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </Field>

          <Field label="Numéro de police">
            <input {...register('numeroPolice')} className={inputCls} placeholder="N° police (optionnel)" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date d'émission" error={errors.dateEmission?.message} required>
              <input {...register('dateEmission')} type="date" className={inputCls} />
            </Field>
            <Field label="Date d'effet">
              <input {...register('dateEffet')} type="date" className={inputCls} />
            </Field>
            <Field label="Date d'échéance">
              <input {...register('dateEcheance')} type="date" className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Montant TTC (MAD)" error={errors.montantTtc?.message} required>
              <input {...register('montantTtc')} type="number" step="0.01" className={inputCls} placeholder="0.00" />
            </Field>
            <Field label="Montant net (MAD)" error={errors.montantNet?.message} required>
              <input {...register('montantNet')} type="number" step="0.01" className={inputCls} placeholder="0.00" />
            </Field>
            <Field label="Commission brute" error={errors.commissionBrute?.message} required>
              <input {...register('commissionBrute')} type="number" step="0.01" className={inputCls} placeholder="0.00" />
            </Field>
            <Field label="Commission nette" error={errors.commissionNet?.message} required>
              <input {...register('commissionNet')} type="number" step="0.01" className={inputCls} placeholder="0.00" />
            </Field>
          </div>

          {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Enregistrement...' : 'Créer la prime'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
