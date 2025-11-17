'use client';

import { FormEvent, useState } from 'react';

const API_URL = 'http://localhost:4000';

interface Delivery {
  id: number;
  unit_id: number;
  recipient_id?: number | null;
  description: string;
  carrier?: string;
  status: 'pending' | 'notified' | 'picked_up' | string;
  picked_up_at?: string | null;
  created_at: string;
}

export default function EncomendasPage() {
  const [unitIdFilter, setUnitIdFilter] = useState('');
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadDeliveries(e?: FormEvent) {
    if (e) e.preventDefault();

    if (!API_URL) {
      setError('API_URL não configurada (NEXT_PUBLIC_API_URL).');
      return;
    }
    if (!unitIdFilter) {
      setError('Informe o ID da unidade para buscar.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${API_URL}/deliveries/unit/${Number(unitIdFilter)}`,
        {
          credentials: 'include',
        },
      );

      if (!res.ok) {
        let msg = 'Erro ao carregar encomendas.';
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch {
          //
        }
        throw new Error(msg);
      }

      const data = await res.json();
      setDeliveries(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar encomendas.');
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold mb-1">Encomendas</h1>
        <p className="text-sm text-gray-600">
          Consulte as encomendas e correspondências registradas para a sua unidade.
        </p>
      </header>

      {error && (
        <div className="text-sm text-red-600 border border-red-300 rounded p-2">
          {error}
        </div>
      )}

      {/* Filtro por unidade */}
      <section className="border rounded-lg p-4 space-y-4 bg-white/70">
        <h2 className="text-lg font-medium">Buscar encomendas</h2>

        <form
          onSubmit={loadDeliveries}
          className="flex flex-col md:flex-row gap-3 items-start md:items-end"
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Unidade (ID)
            </label>
            <input
              type="number"
              value={unitIdFilter}
              onChange={(e) => setUnitIdFilter(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
              placeholder="Ex: 101"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>
      </section>

      {/* Lista de encomendas */}
      <section className="border rounded-lg p-4 bg-white/70">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">Encomendas da unidade</h2>
          {deliveries.length > 0 && (
            <span className="text-xs text-gray-500">
              {deliveries.length} registro(s)
            </span>
          )}
        </div>

        {loading ? (
          <p className="text-sm text-gray-600">Carregando...</p>
        ) : deliveries.length === 0 ? (
          <p className="text-sm text-gray-600">
            Nenhuma encomenda encontrada para a unidade informada.
          </p>
        ) : (
          <ul className="space-y-3">
            {deliveries.map((d) => (
              <li
                key={d.id}
                className="border rounded-md p-3 text-sm flex flex-col gap-1 bg-white"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    #{d.id} — {d.description}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">
                    {d.status === 'pending'
                      ? 'Pendente'
                      : d.status === 'notified'
                      ? 'Notificada'
                      : d.status === 'picked_up'
                      ? 'Retirada'
                      : d.status}
                  </span>
                </div>

                <span className="text-xs text-gray-500">
                  Unidade: {d.unit_id} ·{' '}
                  {new Date(d.created_at).toLocaleString()}
                </span>

                {d.carrier && (
                  <span className="text-xs text-gray-500">
                    Transportadora: {d.carrier}
                  </span>
                )}

                {d.picked_up_at && (
                  <span className="text-xs text-green-700">
                    Retirada em:{' '}
                    {new Date(d.picked_up_at).toLocaleString()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
