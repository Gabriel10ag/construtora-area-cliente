'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DocumentItem {
  id: number;
  title: string;
  description: string | null;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

export default function DocumentosPage() {
  const router = useRouter();
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/login');
      return;
    }

    fetch('http://localhost:4000/documents/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((d) => setDocs(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando documentos...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Meus Documentos</h2>

      {docs.length === 0 && <p>Nenhum documento disponível.</p>}

      {docs.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-4 rounded shadow text-sm"
            >
              <p className="font-semibold">{doc.title}</p>
              {doc.description && (
                <p className="text-xs text-gray-600 mb-2">
                  {doc.description}
                </p>
              )}

              <p className="text-xs text-gray-500">
                Enviado em:{' '}
                {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}
              </p>

              <a
                href={`http://localhost:4000/${doc.fileUrl}`}
                target="_blank"
                className="text-blue-600 text-sm mt-2 inline-block"
              >
                📄 Baixar arquivo
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
