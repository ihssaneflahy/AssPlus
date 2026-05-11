'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/modal';
import { Field, inputCls, selectCls } from '@/components/ui/form-field';
import { api } from '@/lib/api';

const detailSchema = z.object({
  type: z.enum(['CHEQUE', 'ESPECE', 'VIREMENT', 'REPORT']),
  montant: z.coerce.number().positive('Montant requis'),
  numCheque: z.string().optional(),
  numVirement: z.string().optional(),
  dateVersement: z.string().optional(),
});

const schema = z.object({
  clientId: z.string().min(1, 'Client requis'),
  montantTotal: z.coerce.number().positive('Montant requis'),
  details: z.array(detailSchema).min(1, 'Au moins un mode de règlement'),
});

type Form = z.infer<typeof schema>;

const TYPE_LABELS: Record<string, string> = {
  CHEQUE: 'Chèque', ESPECE: 'Espèce', VIREMENT: 'Virement', REPORT: 'Report',
};

export default function EncaissementsPage() {
  const [open, setOpen] = useState(false);
  const [encaissements, setEncaissements] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    api.get('/clients').then((r) => setClients(r.data)).catch(() => {});
    api.get('/encaissements').then((r) => setEncaissements(r.data)).catch(() => {});
  }, []);

  const { register, handleSubmit, control, watch, reset, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { details: [{ type: 'CHEQUE', montant: 0 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'details' });
  const watchedDetails = watch('details');

  async function onSubmit(data: Form) {
    setServerError('');
    try {
      const res = await api.post('/encaissements', data);
      setEncaissements((prev) => [res.data, ...prev]);
      reset();
      setOpen(false);
    } catch (e: any) {
      setServerError(e.response?.data?.message ?? 'Erreur serveur');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Encaissements</h1>
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          + Nouvel encaissement
        </button>
      </div>

      {encaissements.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          <p className="text-4xl mb-3">💰</p>
          <p className="font-medium">Aucun encaissement pour le moment</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm divide-y">
          {encaissements.map((e: any) => (
            <div key={e.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{e.client?.nomComplet}</p>
                <p className="text-xs text-gray-400">{e.details?.map((d: any) => TYPE_LABELS[d.type]).join(', ')}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{Number(e.montantTotal).toLocaleString('fr-MA')} MAD</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${e.statut === 'VALIDE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {e.statut}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Nouvel encaissement">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Client" error={errors.clientId?.message} required>
            <select {...register('clientId')} className={selectCls}>
              <option value="">— Sélectionner un client —</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.nomComplet}</option>)}
            </select>
          </Field>

          <Field label="Montant total (MAD)" error={errors.montantTotal?.message} required>
            <input {...register('montantTotal')} type="number" step="0.01" className={inputCls} placeholder="0.00" />
          </Field>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Modes de règlement <span className="text-red-500">*</span></label>
              <button type="button" onClick={() => append({ type: 'CHEQUE', montant: 0 })} className="text-xs text-blue-600 hover:underline">
                + Ajouter
              </button>
            </div>
            {fields.map((f, i) => {
              const type = watchedDetails?.[i]?.type;
              return (
                <div key={f.id} className="border border-gray-200 rounded-lg p-3 mb-2 space-y-2">
                  <div className="flex gap-2">
                    <select {...register(`details.${i}.type`)} className={`${selectCls} flex-1`}>
                      {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <input {...register(`details.${i}.montant`)} type="number" step="0.01" className={`${inputCls} w-28`} placeholder="Montant" />
                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 px-1">✕</button>
                    )}
                  </div>
                  {type === 'CHEQUE' && (
                    <div className="grid grid-cols-2 gap-2">
                      <input {...register(`details.${i}.numCheque`)} className={inputCls} placeholder="N° chèque" />
                      <input {...register(`details.${i}.dateVersement`)} type="date" className={inputCls} />
                    </div>
                  )}
                  {type === 'VIREMENT' && (
                    <input {...register(`details.${i}.numVirement`)} className={inputCls} placeholder="N° virement" />
                  )}
                </div>
              );
            })}
          </div>

          {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Enregistrement...' : 'Créer l\'encaissement'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
