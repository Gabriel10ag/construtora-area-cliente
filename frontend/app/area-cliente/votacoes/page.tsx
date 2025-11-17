"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:4000";

type PollOptionView = {
  id: number;
  label: string;
  sortOrder: number;
  votes: number;
};

type PollView = {
  id: number;
  title: string;
  description?: string | null;
  status: string;
  expiresAt?: string | null;
  options: PollOptionView[];
  userVoteOptionId: number | null;
};

export default function VotacoesPage() {
  const router = useRouter();
  const [tokenChecked, setTokenChecked] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const [polls, setPolls] = useState<PollView[]>([]);
  const [loading, setLoading] = useState(false);
  const [votingPollId, setVotingPollId] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, number | null>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const storedToken =
      typeof window !== "undefined"
        ? window.localStorage.getItem("token")
        : null;

    if (!storedToken) {
      router.replace("/login");
      return;
    }

    setToken(storedToken);
    setTokenChecked(true);
  }, [router]);

  async function loadPolls(authToken: string) {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/polls`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Não foi possível carregar as votações.");
      }

      const data: PollView[] = await res.json();
      setPolls(data);

      const initialSelected: Record<number, number | null> = {};
      data.forEach((p) => {
        initialSelected[p.id] = p.userVoteOptionId;
      });
      setSelectedOptions(initialSelected);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao carregar votações.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!tokenChecked || !token) return;
    loadPolls(token);
  }, [tokenChecked, token]);

  async function handleVote(pollId: number) {
    if (!token) return;

    const optionId = selectedOptions[pollId];
    if (!optionId) {
      setError("Selecione uma opção antes de votar.");
      return;
    }

    try {
      setVotingPollId(pollId);
      setError(null);
      setSuccess(null);

      const res = await fetch(`${API_BASE_URL}/polls/${pollId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ optionId }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Erro ao registrar voto.");
      }

      setSuccess("Voto registrado com sucesso!");
      await loadPolls(token);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao registrar voto.");
    } finally {
      setVotingPollId(null);
    }
  }

  function getTotalVotes(poll: PollView) {
    return poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
  }

  function getOptionPercent(poll: PollView, option: PollOptionView) {
    const total = getTotalVotes(poll);
    if (!total) return 0;
    return Math.round((option.votes / total) * 100);
  }

  if (!tokenChecked) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Votações</h1>
        <p className="text-sm text-gray-600">
          Participe das enquetes e ajude a construtora a tomar decisões melhores
          para você e para o seu empreendimento.
        </p>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 text-sm text-red-800 p-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-sm text-green-800 p-3 rounded">
          {success}
        </div>
      )}

      <section className="space-y-4">
        {loading ? (
          <p className="text-sm text-gray-500">Carregando votações...</p>
        ) : polls.length === 0 ? (
          <p className="text-sm text-gray-500">
            No momento não há votações disponíveis.
          </p>
        ) : (
          polls.map((poll) => {
            const totalVotes = getTotalVotes(poll);
            const selectedOptionId = selectedOptions[poll.id] ?? null;
            const userHasVoted = poll.userVoteOptionId !== null;

            return (
              <div
                key={poll.id}
                className="bg-white rounded-lg shadow-sm p-4 md:p-6 space-y-4"
              >
                <div>
                  <h2 className="text-sm font-semibold">{poll.title}</h2>
                  {poll.description && (
                    <p className="text-xs text-gray-600 mt-1">
                      {poll.description}
                    </p>
                  )}
                  {poll.expiresAt && (
                    <p className="text-[11px] text-gray-500 mt-1">
                      Disponível até{" "}
                      {new Date(poll.expiresAt).toLocaleString("pt-BR")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  {poll.options.map((opt) => {
                    const percent = getOptionPercent(poll, opt);
                    const isSelected = selectedOptionId === opt.id;
                    const isUserVote = poll.userVoteOptionId === opt.id;

                    return (
                      <label
                        key={opt.id}
                        className="block text-xs cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="radio"
                            name={`poll-${poll.id}`}
                            className="h-3 w-3"
                            checked={isSelected}
                            onChange={() =>
                              setSelectedOptions((prev) => ({
                                ...prev,
                                [poll.id]: opt.id,
                              }))
                            }
                          />
                          <span className="font-medium">{opt.label}</span>
                          {isUserVote && (
                            <span className="text-[10px] text-blue-600 border border-blue-200 rounded px-1 py-[1px]">
                              Seu voto
                            </span>
                          )}
                        </div>

                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 bg-blue-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                          <span>{opt.votes} voto(s)</span>
                          <span>{percent}%</span>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-gray-500">
                    Total: {totalVotes} voto(s)
                  </span>

                  <button
                    type="button"
                    onClick={() => handleVote(poll.id)}
                    disabled={votingPollId === poll.id}
                    className="px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {votingPollId === poll.id
                      ? "Enviando voto..."
                      : userHasVoted
                      ? "Atualizar voto"
                      : "Votar"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
