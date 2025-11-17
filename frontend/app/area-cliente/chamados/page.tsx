'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type TicketMessage = {
  id: number;
  senderType?: string;
  senderId?: number;
  message?: string;
  createdAt: string;
};

type Ticket = {
  id: number;
  subject?: string;
  category?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function ChamadosPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const [replyMessage, setReplyMessage] = useState('');
  const [creatingTicket, setCreatingTicket] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);

  // Autenticação básica igual à área do cliente
  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      router.replace('/login');
      return;
    }

    setToken(storedToken);
    setCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    if (!checkingAuth && token) {
      fetchTickets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkingAuth, token]);

  async function fetchTickets() {
    try {
      setLoadingTickets(true);
      const res = await fetch(`${API_BASE_URL}/tickets/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error('Erro ao carregar tickets');
        return;
      }

      const data: Ticket[] = await res.json();
      setTickets(data);
      if (data.length > 0 && !selectedTicket) {
        setSelectedTicket(data[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar tickets', error);
    } finally {
      setLoadingTickets(false);
    }
  }

  async function handleCreateTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!newSubject || !newMessage) return;

    try {
      setCreatingTicket(true);
      const res = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: newSubject,
          category: newCategory || undefined,
          message: newMessage,
        }),
      });

      if (!res.ok) {
        console.error('Erro ao criar atendimento');
        return;
      }

      const created: Ticket = await res.json();
      setNewSubject('');
      setNewCategory('');
      setNewMessage('');
      // atualiza lista
      await fetchTickets();
      setSelectedTicket(created);
    } catch (error) {
      console.error('Erro ao criar atendimento', error);
    } finally {
      setCreatingTicket(false);
    }
  }

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTicket || !replyMessage) return;

    try {
      setSendingReply(true);
      const res = await fetch(
        `${API_BASE_URL}/tickets/${selectedTicket.id}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: replyMessage }),
        },
      );

      if (!res.ok) {
        console.error('Erro ao enviar mensagem');
        return;
      }

      const updated: Ticket = await res.json();
      // substitui o ticket atualizado na lista
      setTickets((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t)),
      );
      setSelectedTicket(updated);
      setReplyMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem', error);
    } finally {
      setSendingReply(false);
    }
  }

  if (checkingAuth) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Atendimentos</h2>

      {/* Criar novo atendimento */}
      <section className="bg-white p-4 rounded shadow text-sm">
        <h3 className="font-semibold mb-2">Abrir novo atendimento</h3>
        <form onSubmit={handleCreateTicket} className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1">
              Assunto *
            </label>
            <input
              type="text"
              className="w-full border rounded px-2 py-1 text-sm"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Ex: Dúvida sobre boleto, ajuste de cadastro..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              Categoria (opcional)
            </label>
            <input
              type="text"
              className="w-full border rounded px-2 py-1 text-sm"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Ex: Financeiro, Documentos, Obra..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              Mensagem inicial *
            </label>
            <textarea
              className="w-full border rounded px-2 py-1 text-sm min-h-[80px]"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Explique sua dúvida ou solicitação com detalhes."
            />
          </div>

          <button
            type="submit"
            disabled={creatingTicket}
            className="px-4 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {creatingTicket ? 'Enviando...' : 'Abrir atendimento'}
          </button>
        </form>
      </section>

      {/* Lista + detalhes */}
      <section className="grid gap-4 md:grid-cols-[280px,1fr]">
        {/* Lista de atendimentos */}
        <div className="bg-white p-3 rounded shadow text-xs max-h-[460px] overflow-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Meus atendimentos</h3>
            {loadingTickets && (
              <span className="text-[10px] text-gray-500">Atualizando...</span>
            )}
          </div>

          {tickets.length === 0 && !loadingTickets && (
            <p className="text-gray-500 text-xs">
              Você ainda não possui atendimentos abertos.
            </p>
          )}

          <ul className="space-y-1">
            {tickets.map((ticket) => (
              <li key={ticket.id}>
                <button
                  type="button"
                  onClick={() => setSelectedTicket(ticket)}
                  className={`w-full text-left px-2 py-2 rounded border text-xs mb-1 ${
                    selectedTicket?.id === ticket.id
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">
                      #{ticket.id} {ticket.subject}
                    </span>
                    <span className="text-[10px] uppercase text-gray-500">
                      {ticket.status}
                    </span>
                  </div>
                  {ticket.category && (
                    <p className="text-[11px] text-gray-500">
                      Categoria: {ticket.category}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-400 mt-1">
                    Criado em:{' '}
                    {new Date(ticket.createdAt).toLocaleString('pt-BR')}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Detalhe do atendimento */}
        <div className="bg-white p-4 rounded shadow text-sm flex flex-col max-h-[460px]">
          {!selectedTicket ? (
            <p className="text-xs text-gray-500">
              Selecione um atendimento na lista para ver os detalhes.
            </p>
          ) : (
            <>
              <div className="mb-3 border-b pb-2">
                <h3 className="font-semibold">
                  #{selectedTicket.id} {selectedTicket.subject}
                </h3>
                <p className="text-xs text-gray-500">
                  Status:{' '}
                  <span className="font-medium">
                    {selectedTicket.status}
                  </span>
                </p>
                {selectedTicket.category && (
                  <p className="text-xs text-gray-500">
                    Categoria: {selectedTicket.category}
                  </p>
                )}
              </div>

              <div className="flex-1 overflow-auto border rounded p-2 bg-gray-50 mb-3">
                {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                  <ul className="space-y-2 text-xs">
                    {selectedTicket.messages.map((msg) => (
                      <li key={msg.id} className="bg-white p-2 rounded shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-[11px]">
                            {msg.senderType === 'USER'
                              ? 'Você'
                              : 'Atendimento'}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleString('pt-BR')
                              : ''}
                          </span>
                        </div>
                        <p className="text-[12px] whitespace-pre-line">
                          {msg.message}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500">
                    Nenhuma mensagem registrada ainda.
                  </p>
                )}
              </div>

              {/* Resposta */}
              <form onSubmit={handleSendReply} className="space-y-2">
                <label className="block text-xs font-medium mb-1">
                  Responder atendimento
                </label>
                <textarea
                  className="w-full border rounded px-2 py-1 text-sm min-h-[60px]"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Digite sua mensagem para o atendimento..."
                />
                <button
                  type="submit"
                  disabled={sendingReply || !replyMessage}
                  className="px-4 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-60"
                >
                  {sendingReply ? 'Enviando...' : 'Enviar mensagem'}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
