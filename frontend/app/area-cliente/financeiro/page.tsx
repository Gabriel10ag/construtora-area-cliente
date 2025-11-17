'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Project {
  id: number;
  name: string;
  city: string | null;
  state: string | null;
}

interface Block {
  id: number;
  name: string;
  project: Project | null;
}

interface Unit {
  id: number;
  number: string;
  floor: number | null;
  bedrooms: number | null;
  privateAreaM2: string | null;
  block: Block | null;
}

interface Contract {
  id: number;
  contractNumber: string | null;
  status: string;
  totalValue: string;
  signedAt: string | null;
  unit: Unit | null;
}

interface Installment {
  id: number;
  number: number;
  dueDate: string; // yyyy-mm-dd
  amount: string;
  status: string;
  paidAt: string | null;
  documentUrl: string | null;
}

export default function FinanceiroPage() {
  const router = useRouter();

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null,
  );
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [loadingContracts, setLoadingContracts] = useState(true);
  const [loadingInstallments, setLoadingInstallments] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1) Carrega contratos do cliente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    const loadContracts = async () => {
      try {
        setLoadingContracts(true);
        const res = await fetch('http://localhost:4000/contracts/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Erro ao buscar contratos');
        }

        const data: Contract[] = await res.json();
        setContracts(data);
        setSelectedContract(data[0] || null);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar contratos');
      } finally {
        setLoadingContracts(false);
      }
    };

    loadContracts();
  }, [router]);

  // 2) Carrega parcelas do contrato selecionado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !selectedContract) return;

    const loadInstallments = async () => {
      try {
        setLoadingInstallments(true);
        setError(null);

        const res = await fetch(
          `http://localhost:4000/finance/contracts/${selectedContract.id}/installments`,
        );

        if (!res.ok) {
          throw new Error('Erro ao buscar parcelas');
        }

        const data: Installment[] = await res.json();
        setInstallments(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar parcelas');
      } finally {
        setLoadingInstallments(false);
      }
    };

    loadInstallments();
  }, [selectedContract]);

  if (loadingContracts) {
    return <p>Carregando informações financeiras...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-sm">{error}</p>;
  }

  if (!contracts.length) {
    return <p>Você ainda não possui contratos para exibir o financeiro.</p>;
  }

  const project = selectedContract?.unit?.block?.project || null;

  // Próxima parcela = primeira com status diferente de "PAGO" (ajuste conforme sua regra)
  const nextInstallment = installments.find(
    (i) => i.status !== 'PAGO' && i.status !== 'QUITADO',
  );

  const formatCurrency = (value: string) =>
    `R$ ${Number(value).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (value: string | null) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Financeiro</h2>

      {/* Seleção de contrato */}
      <div className="bg-white p-4 rounded shadow text-sm space-y-2">
        <p className="font-semibold mb-2">Contrato</p>

        <select
          className="border rounded px-2 py-1 text-sm"
          value={selectedContract?.id || ''}
          onChange={(e) => {
            const id = Number(e.target.value);
            const c = contracts.find((ct) => ct.id === id) || null;
            setSelectedContract(c);
          }}
        >
          {contracts.map((c) => {
            const prj = c.unit?.block?.project;
            return (
              <option key={c.id} value={c.id}>
                {c.contractNumber || `Contrato #${c.id}`} -{' '}
                {prj ? prj.name : 'Empreendimento'}
              </option>
            );
          })}
        </select>

        {selectedContract && (
          <div className="mt-2 text-xs text-gray-700 space-y-1">
            <p>
              Empreendimento:{' '}
              <strong>{project ? project.name : '—'}</strong>
            </p>
            <p>
              Unidade:{' '}
              <strong>
                {selectedContract.unit
                  ? `${selectedContract.unit.number}${
                      selectedContract.unit.floor != null
                        ? ` • Andar ${selectedContract.unit.floor}`
                        : ''
                    }`
                  : '—'}
              </strong>
            </p>
            <p>
              Valor total:{' '}
              <strong>{formatCurrency(selectedContract.totalValue)}</strong>
            </p>
            {selectedContract.signedAt && (
              <p>Assinado em: {formatDate(selectedContract.signedAt)}</p>
            )}
          </div>
        )}
      </div>

      {/* Próxima parcela */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white p-4 rounded shadow text-sm">
          <h3 className="font-semibold mb-2">Próxima parcela</h3>
          {loadingInstallments && <p>Carregando parcelas...</p>}
          {!loadingInstallments && !nextInstallment && (
            <p>Não há parcelas pendentes.</p>
          )}
          {!loadingInstallments && nextInstallment && (
            <div className="space-y-1">
              <p>
                Parcela{' '}
                <strong>
                  #{nextInstallment.number}
                </strong>
              </p>
              <p>Vencimento: {formatDate(nextInstallment.dueDate)}</p>
              <p>Valor: {formatCurrency(nextInstallment.amount)}</p>
              <p>
                Status:{' '}
                <span
                  className={
                    'px-2 py-1 rounded text-xs ' +
                    (nextInstallment.status === 'PENDENTE'
                      ? 'bg-yellow-100 text-yellow-700'
                      : nextInstallment.status === 'ATRASADO'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700')
                  }
                >
                  {nextInstallment.status}
                </span>
              </p>
              {nextInstallment.documentUrl && (
                <p>
                  <a
                    href={nextInstallment.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    Ver boleto
                  </a>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Resumo geral */}
        <div className="bg-white p-4 rounded shadow text-sm">
          <h3 className="font-semibold mb-2">Resumo das parcelas</h3>
          {installments.length === 0 && !loadingInstallments && (
            <p>Não há parcelas cadastradas para este contrato.</p>
          )}

          {installments.length > 0 && (
            <div className="space-y-1 text-xs">
              <p>
                Total de parcelas: <strong>{installments.length}</strong>
              </p>
              <p>
                Pagas:{' '}
                <strong>
                  {
                    installments.filter(
                      (i) => i.status === 'PAGO' || i.status === 'QUITADO',
                    ).length
                  }
                </strong>
              </p>
              <p>
                Pendentes:{' '}
                <strong>
                  {
                    installments.filter(
                      (i) => i.status !== 'PAGO' && i.status !== 'QUITADO',
                    ).length
                  }
                </strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tabela de parcelas */}
      <div className="bg-white p-4 rounded shadow text-sm">
        <h3 className="font-semibold mb-3">Todas as parcelas</h3>
        {loadingInstallments && <p>Carregando parcelas...</p>}
        {!loadingInstallments && installments.length === 0 && (
          <p>Não há parcelas cadastradas.</p>
        )}

        {!loadingInstallments && installments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-2">#</th>
                  <th className="text-left py-2 pr-2">Vencimento</th>
                  <th className="text-left py-2 pr-2">Valor</th>
                  <th className="text-left py-2 pr-2">Status</th>
                  <th className="text-left py-2 pr-2">Pago em</th>
                  <th className="text-left py-2 pr-2">Boleto</th>
                </tr>
              </thead>
              <tbody>
                {installments.map((i) => (
                  <tr key={i.id} className="border-b">
                    <td className="py-2 pr-2">{i.number}</td>
                    <td className="py-2 pr-2">{formatDate(i.dueDate)}</td>
                    <td className="py-2 pr-2">
                      {formatCurrency(i.amount)}
                    </td>
                    <td className="py-2 pr-2">
                      <span className="px-2 py-1 rounded bg-gray-100">
                        {i.status}
                      </span>
                    </td>
                    <td className="py-2 pr-2">
                      {i.paidAt ? formatDate(i.paidAt) : '—'}
                    </td>
                    <td className="py-2 pr-2">
                      {i.documentUrl ? (
                        <a
                          href={i.documentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          Abrir
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
