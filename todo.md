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
- [ ] Garantir estados de carregamento, vazio, erro e sucesso
- [x] Garantir responsividade e acessibilidade por teclado

## Qualidade e entrega

- [x] Criar schema Drizzle e aplicar migração SQL no banco
- [x] Criar procedures tRPC e helpers de banco para cada domínio
- [ ] Escrever testes Vitest para autorização, isolamento tenant e regras financeiras
- [x] Executar typecheck, testes e validação visual desktop/mobile
- [ ] Salvar checkpoint final com todas as funcionalidades concluídas

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
- [ ] Implementar criação e seleção de múltiplas organizações na UI e backend
- [ ] Criar fluxo completo de convites: envio, aceite e associação do membro à organização
- [ ] Adicionar gestão completa de contas e categorias na interface
- [ ] Conectar edição/exclusão de transações à UI e cobrir com testes de autorização/tenant
- [ ] Substituir dados hardcoded do dashboard por séries reais de evolução
- [ ] Implementar tela de relatórios com filtros funcionais e ação de exportação CSV
- [ ] Implementar importação CSV na UI com upload, validação e mensagens de erro/sucesso
- [ ] Adicionar tela consultável de auditoria e reforçar RBAC na navegação
- [ ] Validar e ajustar acessibilidade por teclado nas telas principais, incluindo foco visível, ordem de tabulação e fechamento do modal por ESC
- [ ] Registrar evidência da checagem de acessibilidade por teclado antes de consolidar o marco
