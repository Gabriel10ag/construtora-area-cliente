// frontend/app/area-cliente/agendamentos/page.tsx
'use client';

import React, { useEffect, useState } from 'react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Appointment {
  id: number;
  type?: string | null;
  scheduledFor: string;
  status: string;
  notes?: string | null;
  contract: {
    id: number;
    contractNumber?: string | null;
  };
  createdAt: string;
}

export default function AgendamentosPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [contractId, setContractId] = useState('');
  const [type, setType] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [notes, setNotes] = useState('');
  const [creating, setCreating] = useState(false);

  const token =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('token')
      : null;

  async function loadAppointments() {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Falha ao carregar agendamentos');
      }

      const data = await res.json();
      setAppointments(data);
    } catch (err: any) {
      console.error('Erro ao carregar agendamentos', err);
      setError('Não foi possível carregar seus agendamentos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) return;
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleCreateAppointment(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    if (!contractId || !scheduledFor) {
      setError('Informe o contrato e a data/hora desejada.');
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const body = {
        contractId: Number(contractId),
        type: type || undefined,
        scheduledFor, // ex: '2025-11-20T15:00'
        notes: notes || undefined,
      };

      const res = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        console.error('Erro ao criar agendamento', errBody);
        throw new Error(errBody.message || 'Falha ao criar agendamento');
      }

      setContractId('');
      setType('');
      setScheduledFor('');
      setNotes('');

      await loadAppointments();
    } catch (err: any) {
      setError(err.message || 'Não foi possível criar o agendamento.');
    } finally {
      setCreating(false);
    }
  }

  async function handleCancelAppointment(id: number) {
    if (!token) return;
    if (!confirm('Deseja realmente cancelar este agendamento?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${id}/cancel`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        console.error('Erro ao cancelar agendamento', errBody);
        throw new Error(errBody.message || 'Falha ao cancelar agendamento');
      }

      await loadAppointments();
    } catch (err: any) {
      setError(err.message || 'Não foi possível cancelar o agendamento.');
    }
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleString('pt-BR');
  }

  if (!token && typeof window !== 'undefined') {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Agendamentos</h1>
        <p className="text-sm text-gray-600">
          Você precisa estar logado para acessar esta página.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Agendamentos de Visita</h1>
        <p className="text-sm text-gray-600">
          Confira seus agendamentos e solicite novas visitas ou vistorias no
          seu empreendimento.
        </p>
      </header>

      {error && (
        <div className="px-4 py-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Formulário de novo agendamento */}
      <section className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <h2 className="text-sm font-semibold mb-4">
          Solicitar novo agendamento
        </h2>

        <form
          onSubmit={handleCreateAppointment}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
              Contrato (ID)
            </label>
            <input
              type="number"
              min={1}
              className="border rounded-md px-3 py-2 text-sm"
              placeholder="Ex: 1"
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              required
            />
            <span className="text-[11px] text-gray-500">
              Use o ID mostrado na tela de contratos.
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
              Tipo de visita
            </label>
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="VISITA_OBRA">Visita à obra</option>
              <option value="VISTORIA_ENTREGA">Vistoria de entrega</option>
              <option value="REUNIAO_ATENDIMENTO">Reunião com atendimento</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
              Data e hora desejadas
            </label>
            <input
              type="datetime-local"
              className="border rounded-md px-3 py-2 text-sm"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-xs font-medium text-gray-700">
              Observações
            </label>
            <textarea
              className="border rounded-md px-3 py-2 text-sm min-h-[80px]"
              placeholder="Ex: Prefiro aos sábados de manhã, preciso de vaga de estacionamento próxima, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {creating ? 'Enviando...' : 'Solicitar agendamento'}
            </button>
          </div>
        </form>
      </section>

      {/* Lista de agendamentos */}
      <section className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">Meus agendamentos</h2>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Carregando agendamentos...</p>
        ) : appointments.length === 0 ? (
          <p className="text-sm text-gray-500">
            Você ainda não possui agendamentos cadastrados.
          </p>
        ) : (
          <div className="space-y-3">
            {appointments.map((a) => (
              <div
                key={a.id}
                className="border rounded-md px-3 py-3 flex flex-col gap-1 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <div className="text-sm font-medium">
                    {a.type || 'Agendamento'}
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Contrato:</span>{' '}
                    {a.contract?.contractNumber ||
                      `#${a.contract?.id ?? 'N/D'}`}
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Data/hora:</span>{' '}
                    {formatDate(a.scheduledFor)}
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Status:</span>{' '}
                    <span
                      className={
                        a.status === 'SCHEDULED'
                          ? 'text-blue-600 font-semibold'
                          : a.status === 'CANCELLED'
                          ? 'text-red-600 font-semibold'
                          : 'text-green-600 font-semibold'
                      }
                    >
                      {a.status}
                    </span>
                  </div>
                  {a.notes && (
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Obs.:</span> {a.notes}
                    </div>
                  )}
                </div>

                {a.status === 'SCHEDULED' && (
                  <div className="mt-2 md:mt-0 flex md:flex-col gap-2">
                    <button
                      onClick={() => handleCancelAppointment(a.id)}
                      className="px-3 py-1 rounded-md text-xs font-medium border border-red-500 text-red-600 hover:bg-red-50"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
