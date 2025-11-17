// app/page.tsx
export default function HomePage() {
  return (
    <section className="w-full">
      <div className="grid gap-8 md:grid-cols-2 items-center">
        {/* Texto principal */}
        <div className="space-y-5">
          <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
            Portal da Construtora
          </p>

          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
            Bem-vindo à&nbsp;
            <span className="text-blue-600">
              Área do Cliente
            </span>
          </h1>

          <p className="text-sm md:text-base text-gray-600">
            Acompanhe a evolução da sua obra, consulte boletos, documentos,
            agende visitas e muito mais em um só lugar, de forma simples e segura.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="/login"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Acessar área do cliente
            </a>
            <a
              href="/area-cliente"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded border border-slate-200 hover:bg-slate-50"
            >
              Ver painel (já logado)
            </a>
          </div>

          <ul className="text-xs md:text-sm text-gray-500 space-y-1">
            <li>• Acompanhamento da obra em tempo real</li>
            <li>• Documentos, contratos e boletos sempre à mão</li>
            <li>• Reservas de áreas comuns, ocorrências, visitas e encomendas</li>
          </ul>
        </div>

        {/* Bloco “card” de preview */}
        <div className="hidden md:block">
          <div className="border rounded-2xl bg-white shadow-sm p-4 space-y-3">
            <p className="text-xs font-medium text-gray-500">
              Visão geral do cliente
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="border rounded-lg p-3 bg-slate-50/80">
                <p className="font-semibold mb-1">Obra</p>
                <p className="text-gray-600">
                  Condomínio Residencial Vida Nova
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  Progresso: <span className="font-semibold">68%</span>
                </p>
              </div>

              <div className="border rounded-lg p-3 bg-slate-50/80">
                <p className="font-semibold mb-1">Financeiro</p>
                <p className="text-gray-600">
                  2 parcelas em aberto
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  Próximo vencimento: 10/12
                </p>
              </div>

              <div className="border rounded-lg p-3 bg-slate-50/80">
                <p className="font-semibold mb-1">
                  Reservas &amp; áreas comuns
                </p>
                <p className="text-gray-600">
                  1 reserva confirmada para o salão de festas.
                </p>
              </div>

              <div className="border rounded-lg p-3 bg-slate-50/80">
                <p className="font-semibold mb-1">Ocorrências</p>
                <p className="text-gray-600">
                  Nenhuma ocorrência em aberto no momento.
                </p>
              </div>
            </div>

            <p className="text-[11px] text-gray-400">
              As informações exibidas acima são apenas ilustrativas.
              Acesse sua conta para ver seus dados reais.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
