# FinPilot — Project TODO

## Escopo funcional

- [ ] Criar organizações e garantir isolamento multi-tenant em todas as consultas e mutações
- [ ] Implementar convite de membros e papéis de administrador e membro
- [ ] Implementar gerenciamento de contas financeiras por organização
- [ ] Implementar categorias de transações personalizáveis por organização
- [ ] Implementar criação, edição, exclusão e listagem de receitas e despesas
- [ ] Implementar dashboard com saldo total, receitas, despesas e evolução do período
- [ ] Implementar relatórios com filtros por período, conta, categoria e tipo
- [ ] Implementar importação de transações por CSV com validação e feedback de erros
- [ ] Implementar exportação de relatórios em CSV
- [ ] Implementar histórico de auditoria de alterações em transações
- [ ] Restringir ações administrativas por papel e proteger rotas/procedures

## Direção visual e experiência

- [ ] Aplicar identidade industrial moderna, brutalista e monocromática
- [ ] Criar hierarquia tipográfica com títulos pesados e metadados em caixa alta espaçada
- [ ] Implementar composição geométrica com blocos retangulares em tons de cinza
- [ ] Garantir estados de carregamento, vazio, erro e sucesso
- [ ] Garantir responsividade e acessibilidade por teclado

## Qualidade e entrega

- [x] Criar schema Drizzle e aplicar migração SQL no banco
- [x] Criar procedures tRPC e helpers de banco para cada domínio
- [ ] Escrever testes Vitest para autorização, isolamento tenant e regras financeiras
- [ ] Executar typecheck, testes e validação visual desktop/mobile
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
