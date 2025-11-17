// app/page.tsx

const features = [
  {
    title: 'Acompanhe a obra em tempo real',
    description: 'Status por etapa, registro fotográfico e linha do tempo da sua unidade sempre atualizados.',
    badge: 'Obra',
    icon: '🏗️'
  },
  {
    title: 'Financeiro sem dor de cabeça',
    description: 'Boletos, histórico de pagamentos, extrato e notificações de vencimento em um só lugar.',
    badge: 'Financeiro',
    icon: '💰'
  },
  {
    title: 'Documentos sempre à mão',
    description: 'Contratos, plantas, regulamentos e comunicados oficiais organizados e disponíveis 24/7.',
    badge: 'Documentos',
    icon: '📄'
  },
  {
    title: 'Condomínio inteligente',
    description: 'Reservas de áreas comuns, ocorrências, visitantes e encomendas integrados ao seu condomínio.',
    badge: 'Condomínio',
    icon: '🏢'
  },
];

const steps = [
  {
    label: 'Acesse sua conta',
    text: 'Entre com seu CPF e senha enviados pela construtora no primeiro acesso.',
  },
  {
    label: 'Conecte-se ao seu empreendimento',
    text: 'Visualize sua unidade, contratos, cronograma de obra e dados financeiros.',
  },
  {
    label: 'Acompanhe tudo em um só lugar',
    text: 'Use o painel para se organizar: obras, pagamentos, documentos e condomínio.',
  },
];

const stats = [
  { value: '24/7', label: 'Disponível' },
  { value: '100%', label: 'Seguro' },
  { value: 'Em tempo', label: 'Real' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950">
      <div className="app-shell">
        {/* HEADER */}
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" />
            <span className="text-lg font-semibold text-white">Construtora</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Funcionalidades</a>
            <a href="#how-to" className="text-slate-300 hover:text-white transition-colors">Como usar</a>
            <a href="#faq" className="text-slate-300 hover:text-white transition-colors">Dúvidas</a>
          </nav>
        </header>

        {/* HERO SECTION */}
        <section className="w-full py-12 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-center">
            {/* LEFT COLUMN */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 backdrop-blur-sm">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Portal da construtora · acesso exclusivo para clientes
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                    Bem-vindo à{' '}
                    <span className="bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
                      Área do Cliente
                    </span>
                  </h1>
                  <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                    Acompanhe a evolução da sua obra, consulte boletos, documentos,
                    agende visitas e organize sua vida no condomínio com um painel
                    feito sob medida para você.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="/login"
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5"
                  >
                    Acessar área do cliente
                  </a>
                  <a
                    href="/area-cliente"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-600/60 bg-slate-900/50 px-5 py-3 text-base font-medium text-slate-100 transition-all hover:bg-slate-800/50 hover:border-slate-500/60"
                  >
                    Ver painel (já logado)
                  </a>
                </div>
              </div>

              {/* STATS */}
              <div className="flex flex-wrap gap-8 pt-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN - DEMO CARD */}
            <div className="card-elevated p-6 lg:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                    Visão geral do cliente
                  </p>
                  <p className="text-base text-slate-200 font-medium">
                    Exemplo do seu painel personalizado
                  </p>
                </div>
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400 border border-blue-500/20">
                  Demonstração
                </span>
              </div>

              <div className="grid gap-4">
                <div className="rounded-xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Obra
                    </p>
                  </div>
                  <p className="text-sm font-medium text-white mb-2">
                    Condomínio Residencial Vida Nova
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Progresso da obra</span>
                      <span>68%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
                        style={{ width: '68%' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Financeiro
                    </p>
                  </div>
                  <p className="text-sm font-medium text-white">
                    2 parcelas em aberto
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Próximo vencimento: 10/12
                  </p>
                  <p className="text-xs text-emerald-400 mt-2">
                    Pagamentos em dia garantem o andamento da obra.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 rounded-full bg-purple-500" />
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Reservas
                      </p>
                    </div>
                    <p className="text-sm font-medium text-white">
                      1 reserva ativa
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Salão de festas
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Ocorrências
                      </p>
                    </div>
                    <p className="text-sm font-medium text-white">
                      Nenhuma
                    </p>
                    <p className="text-[10px] text-emerald-400 mt-1">
                      Tudo certo 👌
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-slate-500 text-center border-t border-slate-800/50 pt-4">
                Este é apenas um exemplo ilustrativo. Ao acessar sua conta, você
                verá os dados reais do seu empreendimento.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Tudo o que você precisa em um só lugar
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Uma plataforma completa para acompanhar seu investimento com 
              transparência e segurança em todas as etapas.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-900/70 hover:-translate-y-2"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-2xl">{feature.icon}</div>
                  <div className="rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
                    {feature.badge}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </section>

        {/* HOW TO SECTION */}
        <section id="how-to" className="py-16">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Comece agora mesmo
                </h2>
                <p className="text-slate-400">
                  Em poucos passos você terá acesso completo a todas as 
                  funcionalidades da plataforma.
                </p>
              </div>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step.label}
                    className="group flex gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 transition-all hover:border-slate-700/80 hover:bg-slate-900/70"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-sm font-bold text-white shadow-lg shadow-blue-500/25">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {step.label}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ SECTION */}
            <div id="faq" className="space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Dúvidas frequentes
                </h2>
                <p className="text-slate-400">
                  Encontre respostas para as perguntas mais comuns sobre a plataforma.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6">
                  <h3 className="font-semibold text-white mb-3">
                    Não recebi meus dados de acesso. E agora?
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Entre em contato com a construtora ou com a administração do
                    condomínio para validar seus dados e receber suas credenciais
                    de acesso. O atendimento está disponível de segunda a sexta,
                    das 8h às 18h.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6">
                  <h3 className="font-semibold text-white mb-3">
                    Posso acessar do celular?
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Sim. O portal é totalmente responsivo e funciona perfeitamente
                    em celular, tablet ou computador com acesso à internet.
                    Você também pode salvar o site na tela inicial do seu celular
                    para acesso rápido.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6">
                  <h3 className="font-semibold text-white mb-3">
                    Com que frequência as informações são atualizadas?
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    As informações financeiras são atualizadas em tempo real.
                    O andamento da obra é atualizado semanalmente pela equipe
                    da construtora, com fotos e relatórios detalhados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-16 text-center">
          <div className="card-elevated rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Pronto para começar?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
              Acesse agora sua área do cliente e tenha controle total sobre 
              seu empreendimento na palma da sua mão.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                Acessar minha conta
              </a>
              <a
                href="/contato"
                className="inline-flex items-center justify-center rounded-xl border border-slate-600/60 bg-slate-900/50 px-6 py-4 text-base font-medium text-slate-100 transition-all hover:bg-slate-800/50 hover:border-slate-500/60"
              >
                Preciso de ajuda
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-8 border-t border-slate-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" />
              <span className="font-semibold text-white">Construtora</span>
            </div>
            <div className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Construtora. Todos os direitos reservados.
            </div>
            <div className="flex gap-4 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Contato</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}