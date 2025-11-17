import React from 'react';

export default function AreaClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">Minha Construtora</h2>
          <p className="text-xs text-gray-500">Área do Cliente</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 text-sm">
          <a
            href="/area-cliente"
            className="block px-3 py-2 rounded hover:bg-gray-100"
          >
            Dashboard
          </a>
          <a
            href="/area-cliente/contratos"
            className="block px-3 py-2 rounded hover:bg-gray-100"
          >
            Meus Contratos
          </a>
          <a
            href="/area-cliente/financeiro"
            className="block px-3 py-2 rounded hover:bg-gray-100"
          >
            Financeiro
          </a>

           <a
            href="/area-cliente/agendamentos"
            className="block px-3 py-2 rounded hover:bg-gray-100"
          >
            Agendamentos
          </a>
          <a
  href="/area-cliente/obra"
  className="block px-3 py-2 rounded hover:bg-gray-100"
>
  Acompanhamento da obra
</a>

          <a
            href="/area-cliente/documentos"
            className="block px-3 py-2 rounded hover:bg-gray-100"
          >
            Documentos
          </a>
          <a
            href="/area-cliente/chamados"
            className="block px-3 py-2 rounded hover:bg-gray-100"
          >
            Atendimentos
          </a>
          <a
            href="/area-cliente/perfil"
            className="block px-3 py-2 rounded hover:bg-gray-100"
          >
            Meu Perfil
          </a>
        </nav>
      </aside>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm h-14 flex items-center justify-between px-4">
          <h1 className="font-semibold text-sm md:text-base">Área do Cliente</h1>
          <div className="text-xs text-gray-600">
            {/* aqui depois podemos ler o userName do localStorage */}
            Logado
          </div>
        </header>

        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
