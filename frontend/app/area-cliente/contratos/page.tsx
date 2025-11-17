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

export default function MeusContratosPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    const loadContracts = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:4000/contracts/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Erro ao buscar contratos');
        }

        const data = await res.json();
        setContracts(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar contratos');
      } finally {
        setLoading(false);
      }
    };

    loadContracts();
  }, [router]);

  if (loading) {
    return <p>Carregando contratos...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-sm">{error}</p>;
  }

  if (!contracts.length) {
    return <p>Você ainda não possui contratos cadastrados.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Meus Contratos</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {contracts.map((c) => {
          const project = c.unit?.block?.project || null;

          return (
            <div key={c.id} className="bg-white p-4 rounded shadow text-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">
                  Contrato #{c.contractNumber || c.id}
                </span>
                <span
                  className={
                    'px-2 py-1 rounded text-xs ' +
                    (c.status === 'ATIVO'
                      ? 'bg-green-100 text-green-700'
                      : c.status === 'QUITADO'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700')
                  }
                >
                  {c.status}
                </span>
              </div>

              <p className="font-semibold mb-1">
                {project ? project.name : 'Empreendimento não definido'}
              </p>

              <p className="text-xs text-gray-600 mb-1">
                Unidade:{' '}
                {c.unit
                  ? `${c.unit.number}${
                      c.unit.floor != null ? ` • Andar ${c.unit.floor}` : ''
                    }`
                  : '—'}
              </p>

              {project && (
                <p className="text-xs text-gray-600 mb-1">
                  Localização: {project.city || ''}{' '}
                  {project.state ? `- ${project.state}` : ''}
                </p>
              )}

              <p className="text-xs text-gray-600 mb-1">
                Valor total:{' '}
                <strong>
                  R$
                  {Number(c.totalValue).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </strong>
              </p>

              {c.signedAt && (
                <p className="text-xs text-gray-500">
                  Assinado em:{' '}
                  {new Date(c.signedAt).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
