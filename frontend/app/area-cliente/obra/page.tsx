'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Project {
  id: number;
  name: string;
  city: string | null;
  state: string | null;
  address: string | null;
  status: string;
  stage: string;
  progressPercent: string;
  heroImageUrl: string | null;
}

interface ProjectUpdate {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  createdAt: string;
}

interface ContractProject {
  id: number;
  name: string;
  city: string | null;
  state: string | null;
}

interface ContractUnitBlockProject {
  project: ContractProject | null;
}

interface ContractUnitBlock {
  block: ContractUnitBlockProject | null;
}

interface ContractUnit {
  block: ContractUnitBlock | null;
}

interface Contract {
  id: number;
  contractNumber: string | null;
  unit: {
    number: string;
    floor: number | null;
    block: {
      name: string;
      project: {
        id: number;
        name: string;
        city: string | null;
        state: string | null;
      } | null;
    } | null;
  } | null;
}

export default function ObraPage() {
  const router = useRouter();

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null,
  );
  const [project, setProject] = useState<Project | null>(null);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUpdates, setLoadingUpdates] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1) carregar contratos do cliente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    const loadContracts = async () => {
      try {
        setLoading(true);
        setError(null);

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
        setLoading(false);
      }
    };

    loadContracts();
  }, [router]);

  // 2) sempre que trocar de contrato, buscar o projeto + updates
  useEffect(() => {
    const loadProjectAndUpdates = async () => {
      if (!selectedContract) return;

      const projectId = selectedContract.unit?.block?.project?.id;
      if (!projectId) {
        setProject(null);
        setUpdates([]);
        return;
      }

      try {
        setLoadingUpdates(true);
        setError(null);

        const [projectRes, updatesRes] = await Promise.all([
          fetch(`http://localhost:4000/projects/${projectId}`),
          fetch(`http://localhost:4000/projects/${projectId}/updates`),
        ]);

        if (!projectRes.ok) {
          throw new Error('Erro ao buscar dados da obra');
        }

        if (!updatesRes.ok) {
          throw new Error('Erro ao buscar atualizações da obra');
        }

        const projectData: Project = await projectRes.json();
        const updatesData: ProjectUpdate[] = await updatesRes.json();

        setProject(projectData);
        setUpdates(updatesData);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar informações da obra');
      } finally {
        setLoadingUpdates(false);
      }
    };

    loadProjectAndUpdates();
  }, [selectedContract]);

  const formatDate = (value: string) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('pt-BR');
  };

  const formatPercent = (value: string) => {
    const num = Number(value);
    if (isNaN(num)) return '0%';
    return `${num.toFixed(1)}%`;
  };

  if (loading) {
    return <p>Carregando informações da obra...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-sm">{error}</p>;
  }

  if (!contracts.length) {
    return (
      <p>
        Você ainda não possui contratos para acompanhar o andamento da obra.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Acompanhamento da obra</h2>

      {/* seleção de contrato */}
      <div className="bg-white p-4 rounded shadow text-sm space-y-2">
        <p className="font-semibold mb-2">Selecione o contrato</p>

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
            const proj = c.unit?.block?.project;
            return (
              <option key={c.id} value={c.id}>
                {c.contractNumber || `Contrato #${c.id}`} -{' '}
                {proj ? proj.name : 'Empreendimento'}
              </option>
            );
          })}
        </select>

        {selectedContract && (
          <p className="text-xs text-gray-700 mt-1">
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
        )}
      </div>

      {/* Card principal da obra */}
      <div className="bg-white p-4 rounded shadow text-sm">
        {project ? (
          <div className="space-y-3">
            {project.heroImageUrl && (
              <div className="w-full h-40 md:h-56 mb-2 overflow-hidden rounded">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.heroImageUrl}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{project.name}</p>
                <p className="text-xs text-gray-600">
                  {project.city || ''}{' '}
                  {project.state ? `- ${project.state}` : ''}
                </p>
                {project.address && (
                  <p className="text-xs text-gray-500">{project.address}</p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Estágio atual</p>
                  <p className="text-sm font-semibold">{project.stage}</p>
                </div>
                <div className="w-32">
                  <p className="text-xs text-gray-500 mb-1">
                    Progresso da obra
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-green-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Number(project.progressPercent) || 0,
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {formatPercent(project.progressPercent)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Não foi possível identificar o empreendimento deste contrato.</p>
        )}
      </div>

      {/* Atualizações da obra */}
      <div className="bg-white p-4 rounded shadow text-sm">
        <h3 className="font-semibold mb-3">Atualizações da obra</h3>

        {loadingUpdates && <p>Carregando atualizações...</p>}

        {!loadingUpdates && updates.length === 0 && (
          <p>Ainda não há atualizações cadastradas para este empreendimento.</p>
        )}

        {!loadingUpdates && updates.length > 0 && (
          <div className="space-y-3">
            {updates.map((u) => (
              <div
                key={u.id}
                className="border rounded p-3 flex flex-col md:flex-row gap-3"
              >
                {u.imageUrl && (
                  <div className="w-full md:w-40 h-28 overflow-hidden rounded">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={u.imageUrl}
                      alt={u.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">
                    {formatDate(u.createdAt)}
                  </p>
                  <p className="text-sm font-semibold mb-1">{u.title}</p>
                  <p className="text-xs text-gray-700 whitespace-pre-line">
                    {u.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
