'use client';

import { FormEvent, useEffect, useState } from 'react';

const API_URL = 'http://localhost:4000';

interface Occurrence {
  id: number;
  unit_id: number;
  title: string;
  description: string;
  category?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | string;
  created_at: string;
}

export default function OcorrenciasPage() {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [unitId, setUnitId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  async function loadOccurrences() {
    if (!API_URL) {
      setError('API_URL não configurada (NEXT_PUBLIC_API_URL).');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/occurrences/my`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Erro ao carregar ocorrências.');
      }

      const data = await res.json();
      setOccurrences(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar ocorrências.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOccurrences();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!API_URL) {
      setError('API_URL não configurada (NEXT_PUBLIC_API_URL).');
      return;
    }
    if (!unitId || !title || !description) {
      setError('Preencha unidade, título e descrição.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const body = {
        unitId: Number(unitId),
        title,
        description,
        category: category || undefined,
      };

      const res = await fetch(`${API_URL}/occurrences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let msg = 'Erro ao criar ocorrência.';
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch {
          //
        }
        throw new Error(msg);
      }

      // Limpa o formulário
      setUnitId('');
      setTitle('');
      setDescription('');
      setCategory('');

      // Recarrega lista
      await loadOccurrences();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar ocorrência.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold mb-1">Ocorrências</h1>
        <p className="text-sm text-gray-600">
          Registre e acompanhe ocorrências do seu apartamento/condomínio.
        </p>
      </header>

      {/* Formulário de nova ocorrência */}
      <section className="border rounded-lg p-4 space-y-4 bg-white/70">
        <h2 className="text-lg font-medium">Registrar nova ocorrência</h2>

        {error && (
          <div className="text-sm text-red-600 border border-red-300 rounded p-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Unidade (ID)
              </label>
              <input
                type="number"
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
                placeholder="Ex: 101"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Categoria (opcional)
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
                placeholder="Ex: barulho, limpeza, portaria..."
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
              placeholder="Ex: Barulho após horário"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded px-3 py-2 text-sm min-h-[90px]"
              placeholder="Descreva o que está acontecendo..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? 'Enviando...' : 'Registrar ocorrência'}
          </button>
        </form>
      </section>

      {/* Lista de ocorrências */}
      <section className="border rounded-lg p-4 bg-white/70">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">Minhas ocorrências</h2>
          <button
            type="button"
            onClick={loadOccurrences}
            className="text-sm border rounded px-3 py-1 hover:bg-gray-50"
          >
            Atualizar
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-600">Carregando...</p>
        ) : occurrences.length === 0 ? (
          <p className="text-sm text-gray-600">
            Você ainda não registrou nenhuma ocorrência.
          </p>
        ) : (
          <ul className="space-y-3">
            {occurrences.map((o) => (
              <li
                key={o.id}
                className="border rounded-md p-3 text-sm flex flex-col gap-1 bg-white"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    #{o.id} — {o.title}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">
                    {o.status}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  Unidade: {o.unit_id} ·{' '}
                  {new Date(o.created_at).toLocaleString()}
                </span>
                {o.category && (
                  <span className="text-xs text-gray-500">
                    Categoria: {o.category}
                  </span>
                )}
                <p className="text-gray-700 mt-1">{o.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
