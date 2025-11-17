'use client';

import { FormEvent, useEffect, useState } from 'react';

const API_URL = 'http://localhost:4000';

interface Visitor {
  id: number;
  name: string;
  document?: string;
  phone?: string;
}

interface Visit {
  id: number;
  scheduled_at: string;
  status: string;
  plate?: string;
  notes?: string;
  visitor?: {
    id: number;
    name: string;
    document?: string;
  };
  unit?: {
    id: number;
  };
}

export default function VisitantesPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loadingVisitors, setLoadingVisitors] = useState(true);
  const [loadingVisits, setLoadingVisits] = useState(true);
  const [submittingVisitor, setSubmittingVisitor] = useState(false);
  const [submittingVisit, setSubmittingVisit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form visitante
  const [visitorName, setVisitorName] = useState('');
  const [visitorDocument, setVisitorDocument] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');

  // Form visita
  const [selectedVisitorId, setSelectedVisitorId] = useState('');
  const [visitUnitId, setVisitUnitId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [plate, setPlate] = useState('');
  const [notes, setNotes] = useState('');

  async function loadVisitors() {
    if (!API_URL) {
      setError('API_URL não configurada (NEXT_PUBLIC_API_URL).');
      setLoadingVisitors(false);
      return;
    }

    try {
      setLoadingVisitors(true);
      setError(null);

      const res = await fetch(`${API_URL}/visitors`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Erro ao carregar visitantes.');

      const data = await res.json();
      setVisitors(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar visitantes.');
    } finally {
      setLoadingVisitors(false);
    }
  }

  async function loadMyVisits() {
    if (!API_URL) {
      setError('API_URL não configurada (NEXT_PUBLIC_API_URL).');
      setLoadingVisits(false);
      return;
    }

    try {
      setLoadingVisits(true);
      setError(null);

      const res = await fetch(`${API_URL}/visitors/visits/my`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Erro ao carregar visitas.');

      const data = await res.json();
      setVisits(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar visitas.');
    } finally {
      setLoadingVisits(false);
    }
  }

  useEffect(() => {
    loadVisitors();
    loadMyVisits();
  }, []);

  async function handleCreateVisitor(e: FormEvent) {
    e.preventDefault();
    if (!API_URL) {
      setError('API_URL não configurada.');
      return;
    }
    if (!visitorName) {
      setError('Informe pelo menos o nome do visitante.');
      return;
    }

    try {
      setSubmittingVisitor(true);
      setError(null);

      const body = {
        name: visitorName,
        document: visitorDocument || undefined,
        phone: visitorPhone || undefined,
      };

      const res = await fetch(`${API_URL}/visitors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let msg = 'Erro ao cadastrar visitante.';
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch {
          //
        }
        throw new Error(msg);
      }

      setVisitorName('');
      setVisitorDocument('');
      setVisitorPhone('');

      await loadVisitors();
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar visitante.');
    } finally {
      setSubmittingVisitor(false);
    }
  }

  async function handleCreateVisit(e: FormEvent) {
    e.preventDefault();
    if (!API_URL) {
      setError('API_URL não configurada.');
      return;
    }
    if (!selectedVisitorId || !visitUnitId || !scheduledAt) {
      setError('Selecione visitante, unidade e data/horário.');
      return;
    }

    try {
      setSubmittingVisit(true);
      setError(null);

      const isoDate = new Date(scheduledAt).toISOString();

      const body = {
        visitorId: Number(selectedVisitorId),
        unitId: Number(visitUnitId),
        scheduledAt: isoDate,
        plate: plate || undefined,
        notes: notes || undefined,
      };

      const res = await fetch(`${API_URL}/visitors/visits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let msg = 'Erro ao agendar visita.';
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch {
          //
        }
        throw new Error(msg);
      }

      setSelectedVisitorId('');
      setVisitUnitId('');
      setScheduledAt('');
      setPlate('');
      setNotes('');

      await loadMyVisits();
    } catch (err: any) {
      setError(err.message || 'Erro ao agendar visita.');
    } finally {
      setSubmittingVisit(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold mb-1">Visitantes</h1>
        <p className="text-sm text-gray-600">
          Cadastre visitantes frequentes e agende visitas para facilitar a entrada na portaria.
        </p>
      </header>

      {error && (
        <div className="text-sm text-red-600 border border-red-300 rounded p-2">
          {error}
        </div>
      )}

      {/* Cadastro de visitante */}
      <section className="border rounded-lg p-4 space-y-4 bg-white/70">
        <h2 className="text-lg font-medium">Cadastrar visitante</h2>

        <form
          onSubmit={handleCreateVisitor}
          className="space-y-3"
        >
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Nome</label>
              <input
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
                placeholder="Nome completo"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Documento (opcional)
              </label>
              <input
                type="text"
                value={visitorDocument}
                onChange={(e) => setVisitorDocument(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
                placeholder="RG, CPF..."
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Telefone (opcional)
              </label>
              <input
                type="text"
                value={visitorPhone}
                onChange={(e) => setVisitorPhone(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submittingVisitor}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {submittingVisitor ? 'Salvando...' : 'Salvar visitante'}
          </button>
        </form>

        {/* Lista de visitantes */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Meus visitantes</h3>
            <button
              type="button"
              onClick={loadVisitors}
              className="text-xs border rounded px-2 py-1 hover:bg-gray-50"
            >
              Atualizar
            </button>
          </div>

          {loadingVisitors ? (
            <p className="text-sm text-gray-600">Carregando...</p>
          ) : visitors.length === 0 ? (
            <p className="text-sm text-gray-600">
              Nenhum visitante cadastrado ainda.
            </p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-auto pr-1">
              {visitors.map((v) => (
                <li
                  key={v.id}
                  className="border rounded-md p-2 text-xs flex flex-col gap-0.5 bg-white"
                >
                  <span className="font-medium">
                    #{v.id} — {v.name}
                  </span>
                  {v.document && (
                    <span className="text-gray-600">
                      Doc: {v.document}
                    </span>
                  )}
                  {v.phone && (
                    <span className="text-gray-600">
                      Tel: {v.phone}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Agendar visita */}
      <section className="border rounded-lg p-4 space-y-4 bg-white/70">
        <h2 className="text-lg font-medium">Agendar visita</h2>

        <form
          onSubmit={handleCreateVisit}
          className="space-y-3"
        >
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Visitante
              </label>
              <select
                value={selectedVisitorId}
                onChange={(e) => setSelectedVisitorId(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
              >
                <option value="">Selecione um visitante</option>
                {visitors.map((v) => (
                  <option key={v.id} value={v.id}>
                    #{v.id} — {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Unidade (ID)
              </label>
              <input
                type="number"
                value={visitUnitId}
                onChange={(e) => setVisitUnitId(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
                placeholder="Ex: 101"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Data e hora
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Placa (opcional)
              </label>
              <input
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
                placeholder="ABC-1D23"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Observações (opcional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
                placeholder="Informações para portaria..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submittingVisit}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {submittingVisit ? 'Agendando...' : 'Agendar visita'}
          </button>
        </form>

        {/* Lista de visitas */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Minhas visitas agendadas</h3>
            <button
              type="button"
              onClick={loadMyVisits}
              className="text-xs border rounded px-2 py-1 hover:bg-gray-50"
            >
              Atualizar
            </button>
          </div>

          {loadingVisits ? (
            <p className="text-sm text-gray-600">Carregando...</p>
          ) : visits.length === 0 ? (
            <p className="text-sm text-gray-600">
              Nenhuma visita cadastrada ainda.
            </p>
          ) : (
            <ul className="space-y-2">
              {visits.map((v) => (
                <li
                  key={v.id}
                  className="border rounded-md p-2 text-xs flex flex-col gap-0.5 bg-white"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      #{v.id}{' '}
                      {v.visitor
                        ? `— ${v.visitor.name}`
                        : ''}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-100">
                      {v.status}
                    </span>
                  </div>
                  <span className="text-gray-600">
                    {new Date(v.scheduled_at).toLocaleString()}
                    {v.unit && ` · Unidade ${v.unit.id}`}
                  </span>
                  {v.plate && (
                    <span className="text-gray-600">
                      Placa: {v.plate}
                    </span>
                  )}
                  {v.notes && (
                    <span className="text-gray-600">
                      Obs: {v.notes}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
