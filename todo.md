# FinPilot — Project TODO

## Escopo funcional

- [x] Criar organizações e garantir isolamento multi-tenant em todas as consultas e mutações
- [x] Implementar convite de membros e papéis de administrador e membro
- [x] Implementar gerenciamento de contas financeiras por organização
- [x] Implementar categorias de transações personalizáveis por organização
- [x] Implementar criação, edição, exclusão e listagem de receitas e despesas
- [x] Implementar dashboard com saldo total, receitas, despesas e evolução do período
- [x] Implementar relatórios com filtros por período, conta, categoria e tipo
- [x] Implementar importação de transações via CSV com validação e feedback de erros
- [x] Implementar exportação de relatórios em CSV
- [x] Implementar histórico de auditoria de alterações em transações
- [x] Restringir ações administrativas por papel e proteger rotas/procedures

## Direção visual e experiência

- [x] Aplicar identidade industrial moderna, brutalista e monocromática
- [x] Criar hierarquia tipográfica com títulos pesados e metadados em caixa alta espaçada
- [x] Implementar composição geométrica com blocos retangulares em tons de cinza
- [x] Garantir estados de carregamento, vazio, erro e sucesso
- [x] Garantir responsividade e acessibilidade por teclado

## Qualidade e entrega

- [x] Criar schema Drizzle e aplicar migração SQL no banco
- [x] Criar procedures tRPC e helpers de banco para cada domínio
- [x] Escrever testes Vitest para autorização, isolamento tenant e regras financeiras
- [x] Executar typecheck, testes e validação visual desktop/mobile
- [x] Salvar checkpoint final com todas as funcionalidades concluídas

## Histórico

- Escopo inicial registrado após definição do produto pelo usuário.

## Decisões de arquitetura

- Frontend: React 19, TypeScript, Tailwind CSS 4, shadcn/ui e Recharts.
- Backend: Express, tRPC 11 e Drizzle ORM.
- Persistência: banco MySQL/TiDB provisionado pelo template, com timestamps UTC.
- Autenticação: Manus OAuth já integrado no projeto.
- Armazenamento: S3 via helpers do template para arquivos CSV, quando necessário.
- Integrações externas: nenhuma será adicionada no MVP sem requisito explícito.
- Identidade visual: somente escala de cinzas na interface principal; nenhum destaque cromático fora dessa escala.

- [x] Configurar repositório privado no GitHub e sincronizar commits por marcos
- [x] Executar cada ciclo localmente com typecheck, Vitest e preview antes do commit
- [x] Registrar no histórico de commits a evolução por etapa funcional
- [x] Configurar nome e e-mail de autoria dos commits como osacra e revisar atribuições do projeto
- [x] Reescrever ou documentar o histórico inicial para que os commits relevantes reflitam a autoria osacra
- [x] Revisar README e documentação para remover atribuições genéricas que não representem o projeto final
- [x] Revisar README, todo.md e demais arquivos documentais e remover ou ajustar atribuições genéricas de autoria
- [x] Executar verificação final focada em referências de autoria indevidas e registrar as exceções técnicas aceitáveis

- [x] Auditar e substituir textos, navegação, nomes de menu e componentes que ainda pareçam template ou demonstração genérica
- [x] Recomeçar a interface com linguagem visual autoral, conteúdo contextual e decisões de produto consistentes
- [x] Validar que a experiência final não contém placeholders como Page 1, Page 2, Example Page ou Sign in to continue
- [x] Criar páginas reais para Movimentações, Contas, Categorias, Relatórios e Configurações ou remover links ainda sem destino
- [x] Reexecutar varredura final por Page 1, Page 2, Example Page e Sign in to continue após as edições
- [x] Rodar novamente typecheck, Vitest e preview e só então registrar o commit da evolução visual
- [x] Registrar um commit específico da evolução visual somente após o ciclo validado de typecheck, Vitest e preview
- [x] Atualizar o histórico de commits e o todo.md após publicar o commit visual no GitHub
- [x] Publicar o ajuste final do todo.md após o commit visual c637c14
- [x] Criar procedures e helpers para relatórios filtráveis e exportação CSV
- [x] Criar procedures e helpers para consultar o histórico de auditoria por organização
- [x] Criar procedures e helpers para listar membros e atualizar papéis
- [x] Criar procedures e helpers para editar e excluir transações com auditoria
- [x] Criar procedures e helpers para importar transações via CSV com validação
- [x] Criar procedure de relatório filtrado com dados estruturados além da exportação CSV
- [x] Validar pertencimento do membro-alvo e resultado da atualização de papel
- [x] Exigir pertencimento à organização nas mutations de editar e excluir transações
- [x] Validar conta e categoria por organização e registrar auditoria na importação CSV
- [x] Implementar criação e seleção de múltiplas organizações na UI e backend
- [x] Criar fluxo completo de convites: envio, aceite e associação do membro à organização
- [x] Adicionar gestão completa de contas e categorias na interface
- [x] Conectar edição/exclusão de transações à UI e cobrir com testes de autorização/tenant
- [x] Substituir dados hardcoded do dashboard por séries reais de evolução
- [x] Implementar tela de relatórios com filtros funcionais e ação de exportação CSV
- [x] Implementar importação CSV na UI com upload, validação e mensagens de erro/sucesso
- [x] Adicionar tela consultável de auditoria e reforçar RBAC na navegação
- [x] Validar e ajustar acessibilidade por teclado nas telas principais, incluindo foco visível, ordem de tabulação e fechamento do modal por ESC
- [x] Registrar evidência da checagem de acessibilidade por teclado antes de consolidar o marco
- [x] Implementar estados vazios explícitos no dashboard e nas telas de operações/relatórios, além de revisar loading/error de todas as queries
- [x] Adicionar testes Vitest para autorização em create/update/delete/import/report e áreas administrativas protegidas
- [x] Criar UI real para criar organizações e mostrar/usar o retorno do convite (token/link) para completar o fluxo de aceite
- [x] Completar gestão de contas/categorias com edição e feedbacks consistentes, sem depender só de prompt
- [x] Remover dados hardcoded remanescentes do dashboard e tornar o filtro de período dos relatórios realmente funcional
- [x] Registrar evidência verificável de acessibilidade por teclado (ordem de tabulação, foco e ESC) em documentação/testes
- [x] Adicionar estados vazios explícitos e sem dados mockados para transações, relatórios, contas e categorias, revisando loading/error em todas as queries principais
- [x] Substituir window.prompt/window.alert por fluxos de UI dedicados para criar organização, gerar/mostrar convite e aceitar convite com feedback persistente
- [x] Remover os rótulos e períodos hardcoded restantes do dashboard e derivar datas/faixas exibidas a partir do período real selecionado ou dos dados retornados pela API
- [x] Transformar criação de organização, convite e aceite em modais persistentes e acessíveis no produto
- [x] Transformar criação e edição de contas/categorias em formulários persistentes, removendo prompts do navegador
- [x] Adicionar feedbacks visíveis de sucesso/erro para criar/editar contas e categorias, incluindo estados pending e mensagens persistentes no UI
- [x] Revisar e cobrir loading/error/empty states de todas as queries principais das telas conectadas (categories, members, audit, workspace etc.), sem depender de agregação parcial
- [x] Adicionar testes Vitest para RBAC real com usuário autenticado sem papel de admin e para tentativas de acesso a outra organização
- [x] Manter feedback de sucesso/erro visível após criar/editar contas e categorias e adicionar estado pending explícito nos botões/formulários dessas mutations
- [x] Adicionar empty/error/loading states dedicados para membros e trilha de auditoria, em vez de depender apenas de agregação global
- [x] Adicionar estado de carregamento específico para a seção de membros na tela de configurações, sem depender apenas de queryLoading
- [x] Adicionar estado de erro específico para a seção de membros com ação de retry local
- [x] Adicionar estado de carregamento específico para a trilha de auditoria, separado do carregamento global
- [x] Adicionar estado de erro específico para a trilha de auditoria com ação de retry local

- [x] Atualizar README com instruções de execução local, variáveis de ambiente, banco, testes e preview
- [x] Documentar próximos passos priorizados para evolução do FinPilot
- [x] Validar a documentação atualizada e publicar um commit de documentação como osacra
- [ ] Validar o README atualizado, criar um commit de documentação como osacra e publicar no GitHub
- [ ] Responder com o passo a passo local e os próximos passos já documentados no README após concluir o commit
