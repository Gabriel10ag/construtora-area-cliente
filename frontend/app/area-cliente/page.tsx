'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AreaClienteDashboard() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/login');
      return;
    }

    // só pra mostrar algo simpático
    const storedName = localStorage.getItem('userName');
    setUserName(storedName);

    setCheckingAuth(false);
  }, [router]);

  if (checkingAuth) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Bem-vindo à sua área do cliente</h2>
      {userName && (
        <p className="text-sm text-gray-700">
          Olá, <strong>{userName}</strong>!
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white p-4 rounded shadow text-sm">
          <h3 className="font-semibold mb-2">Resumo do contrato</h3>
          <p>Em breve: contrato principal, bloco, unidade...</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-sm">
          <h3 className="font-semibold mb-2">Próxima parcela</h3>
          <p>Em breve: valor, data, botão para ver detalhes.</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-sm">
          <h3 className="font-semibold mb-2">Acompanhamento da obra</h3>
          <p>Em breve: porcentagem da obra e últimas atualizações.</p>
        </div>
      </div>
    </div>
  );
}
