'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/modal';
import { Field, inputCls, selectCls } from '@/components/ui/form-field';
import { api } from '@/lib/api';

const schema = z.object({
  typeClient: z.enum(['PERSONNE_PHYSIQUE', 'ENTREPRISE']),
  nomComplet: z.string().min(1, 'Nom requis'),
  cin: z.string().optional(),
  ice: z.string().optional(),
  dateNaissance: z.string().optional(),
  contacts: z.array(z.object({
    typeContact: z.enum(['TELEPHONE', 'EMAIL', 'ADRESSE']),
    valeur: z.string().min(1, 'Valeur requise'),
  })).optional(),
});

type Form = z.infer<typeof schema>;

export default function ClientsPage() {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<Form[]>([]);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, watch, control, reset, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { typeClient: 'PERSONNE_PHYSIQUE', contacts: [{ typeContact: 'TELEPHONE', valeur: '' }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'contacts' });
  const typeClient = watch('typeClient');

  async function onSubmit(data: Form) {
    setServerError('');
    try {
      const res = await api.post('/clients', data);
      setClients((prev) => [res.data, ...prev]);
      reset();
      setOpen(false);
    } catch (e: any) {
      setServerError(e.response?.data?.message ?? 'Erreur serveur');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          + Nouveau client
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          <p className="text-4xl mb-3">👤</p>
          <p className="font-medium">Aucun client pour le moment</p>
          <p className="text-sm mt-1">Créez votre premier client pour commencer</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm divide-y">
          {clients.map((c: any, i) => (
            <div key={c.id ?? i} className="px-6 py-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
                {c.nomComplet?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{c.nomComplet}</p>
                <p className="text-xs text-gray-400">{c.typeClient === 'ENTREPRISE' ? 'Entreprise' : 'Personne physique'} {c.cin ? `· CIN ${c.cin}` : ''}{c.ice ? `· ICE ${c.ice}` : ''}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Nouveau client">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Type de client" required>
            <select {...register('typeClient')} className={selectCls}>
              <option value="PERSONNE_PHYSIQUE">Personne physique</option>
              <option value="ENTREPRISE">Entreprise</option>
            </select>
          </Field>

          <Field label="Nom complet" error={errors.nomComplet?.message} required>
            <input {...register('nomComplet')} className={inputCls} placeholder="Nom et prénom / Raison sociale" />
          </Field>

          {typeClient === 'PERSONNE_PHYSIQUE' && (
            <Field label="CIN" error={errors.cin?.message}>
              <input {...register('cin')} className={inputCls} placeholder="AA123456" />
            </Field>
          )}

          {typeClient === 'ENTREPRISE' && (
            <Field label="ICE" error={errors.ice?.message}>
              <input {...register('ice')} className={inputCls} placeholder="ICE de l'entreprise" />
            </Field>
          )}

          {typeClient === 'PERSONNE_PHYSIQUE' && (
            <Field label="Date de naissance">
              <input {...register('dateNaissance')} type="date" className={inputCls} />
            </Field>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Contacts</label>
              <button type="button" onClick={() => append({ typeContact: 'TELEPHONE', valeur: '' })}
                className="text-xs text-blue-600 hover:underline">+ Ajouter</button>
            </div>
            {fields.map((f, i) => (
              <div key={f.id} className="flex gap-2 mb-2">
                <select {...register(`contacts.${i}.typeContact`)} className={`${selectCls} w-36`}>
                  <option value="TELEPHONE">Téléphone</option>
                  <option value="EMAIL">Email</option>
                  <option value="ADRESSE">Adresse</option>
                </select>
                <input {...register(`contacts.${i}.valeur`)} className={`${inputCls} flex-1`} placeholder="Valeur" />
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 px-1">✕</button>
                )}
              </div>
            ))}
          </div>

          {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Enregistrement...' : 'Créer le client'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
