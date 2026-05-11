'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/modal';
import { Field, inputCls } from '@/components/ui/form-field';
import { api } from '@/lib/api';

const schema = z.object({
  dateVersement: z.string().min(1, 'Date requise'),
  nomBanque: z.string().min(1, 'Banque requise'),
  compteBanque: z.string().min(1, 'Compte requis'),
  montantTotal: z.coerce.number().positive('Montant requis'),
  montantEspece: z.coerce.number().optional(),
});

type Form = z.infer<typeof schema>;

export default function VersementsPage() {
  const [open, setOpen] = useState(false);
  const [versements, setVersements] = useState<any[]>([]);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    api.get('/versements').then((r) => setVersements(r.data)).catch(() => {});
  }, []);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { dateVersement: new Date().toISOString().split('T')[0] },
  });

  async function onSubmit(data: Form) {
    setServerError('');
    try {
      const payload = { ...data, montantEspece: data.montantEspece || undefined };
      const res = await api.post('/versements', payload);
      setVersements((prev) => [res.data, ...prev]);
      reset();
      setOpen(false);
    } catch (e: any) {
      setServerError(e.response?.data?.message ?? 'Erreur serveur');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Versements banque</h1>
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          + Nouveau versement
        </button>
      </div>

      {versements.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          <p className="text-4xl mb-3">🏦</p>
          <p className="font-medium">Aucun versement pour le moment</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm divide-y">
          {versements.map((v: any) => (
            <div key={v.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{v.nomBanque}</p>
                <p className="text-xs text-gray-400">{v.compteBanque} · {v.dateVersement?.slice(0, 10)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{Number(v.montantTotal).toLocaleString('fr-MA')} MAD</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${v.statut === 'VALIDE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {v.statut}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Nouveau versement banque">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Date du versement" error={errors.dateVersement?.message} required>
            <input {...register('dateVersement')} type="date" className={inputCls} />
          </Field>

          <Field label="Banque" error={errors.nomBanque?.message} required>
            <input {...register('nomBanque')} className={inputCls} placeholder="CIH, Attijariwafa, BMCE..." />
          </Field>

          <Field label="N° compte / RIB" error={errors.compteBanque?.message} required>
            <input {...register('compteBanque')} className={inputCls} placeholder="Numéro de compte" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Montant total (MAD)" error={errors.montantTotal?.message} required>
              <input {...register('montantTotal')} type="number" step="0.01" className={inputCls} placeholder="0.00" />
            </Field>
            <Field label="Dont espèces (MAD)">
              <input {...register('montantEspece')} type="number" step="0.01" className={inputCls} placeholder="0.00" />
            </Field>
          </div>

          {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer le versement'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
