# FinPilot

**FinPilot** é uma plataforma web de gestão financeira multi-tenant para organizações. O projeto é desenvolvido e mantido por **osacra** e segue uma direção industrial, monocromática e brutalista, com foco em isolamento entre organizações, rastreabilidade e operações financeiras verificáveis.

> O projeto está em estágio de MVP. A interface e os contratos principais estão implementados, mas os fluxos autenticados devem ser validados com um banco preenchido e uma configuração válida de OAuth.

## Stack

| Camada | Tecnologia |
|---|---|
| Interface | React 19, TypeScript, Vite, Tailwind CSS 4, shadcn/ui e Recharts |
| API | Express, tRPC 11 e SuperJSON |
| Persistência | MySQL/TiDB com Drizzle ORM |
| Autenticação | Manus OAuth integrado ao template |
| Testes | Vitest |
| Arquivos | S3-compatible storage para arquivos e referências de upload |
| Versionamento | Git e GitHub, com commits atribuídos a `osacra` |

## Executar localmente

### Pré-requisitos

Tenha instalado **Node.js 22 ou superior**, `pnpm` 10 ou superior, Git e um banco MySQL ou TiDB. Para executar fluxos autenticados, você também precisará das variáveis de ambiente do Manus OAuth e de uma conexão válida com o banco.

### Instalação

```bash
git clone https://github.com/osacra/finpilot.git
cd finpilot
pnpm install
```

Crie um arquivo `.env` na raiz do projeto. Ele não deve ser commitado:

```dotenv
DATABASE_URL=mysql://usuario:senha@localhost:3306/finpilot
JWT_SECRET=gere-um-segredo-longo-e-aleatorio
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im
OWNER_OPEN_ID=seu_open_id
OWNER_NAME=osacra
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=seu_token_server
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im
VITE_FRONTEND_FORGE_API_KEY=seu_token_frontend
```

No preview gerenciado do projeto, as variáveis internas são injetadas automaticamente. Em uma instalação fora desse ambiente, substitua os exemplos pelos valores reais da sua configuração de OAuth, banco e serviços internos. Não use credenciais de exemplo em produção.

### Banco de dados

Em um banco novo, revise o `DATABASE_URL` e aplique as migrações:

```bash
pnpm drizzle-kit generate
pnpm db:push
```

As migrações criam a autenticação e as estruturas financeiras: organizações, membros, convites, contas, categorias, transações e auditoria. Em um banco já migrado, não execute comandos destrutivos sem revisar o SQL gerado e comparar o journal de migrações.

### Iniciar o servidor

```bash
pnpm dev
```

Abra a URL exibida no terminal. Normalmente ela será [http://localhost:3000](http://localhost:3000), mas use a porta informada pelo processo caso ela esteja ocupada.

A tela sem login pode exibir um estado vazio ou um aviso de sessão. Para consultar dados reais do workspace, entre pelo fluxo OAuth configurado. O preview gerenciado do projeto também está disponível pelo endereço mostrado no painel do FinPilot.

## Comandos úteis

| Comando | Finalidade |
|---|---|
| `pnpm dev` | Inicia o servidor local com Vite e Express |
| `pnpm check` | Executa o TypeScript sem emitir arquivos |
| `pnpm test` | Executa a suíte Vitest |
| `pnpm build` | Gera o bundle de produção do frontend e servidor |
| `pnpm start` | Inicia o bundle de produção compilado |
| `pnpm drizzle-kit generate` | Gera SQL a partir do schema Drizzle |
| `pnpm db:push` | Aplica as migrações configuradas ao banco local |
| `pnpm format` | Formata os arquivos com Prettier |

Antes de abrir um pull request ou publicar uma evolução, execute:

```bash
pnpm check
pnpm test
pnpm build
```

## Funcionalidades do MVP

O MVP contempla criação e seleção de organizações, membros com papéis de administrador e membro, convites por token, contas financeiras, categorias personalizáveis, receitas, despesas, dashboard com evolução diária, relatórios por período, filtros por conta/categoria/tipo, importação e exportação CSV, auditoria e restrições de acesso por organização.

Todas as procedures financeiras passam por sessão protegida. Quando uma organização é informada explicitamente, o backend rejeita a requisição caso o usuário não tenha membership naquela organização; a aplicação não substitui silenciosamente uma organização não autorizada pelo workspace padrão.

## Estrutura principal

```text
client/
  src/components/DashboardLayout.tsx  # shell, seleção de organização e navegação
  src/pages/Home.tsx                  # dashboard financeiro
  src/pages/Operations.tsx            # operações, contas, categorias, relatórios e configurações
  src/index.css                       # identidade visual monocromática

drizzle/
  schema.ts                            # modelo persistente do domínio
  migrations/                          # SQL gerado pelo Drizzle

server/
  db.ts                                # consultas e regras de persistência
  routers.ts                           # contratos tRPC e autorização
  *.test.ts                            # testes Vitest

docs/
  accessibility-check.md              # checklist de teclado e acessibilidade

todo.md                                # histórico verificável de escopo e evolução
```

## GitHub e autoria

O repositório oficial é [github.com/osacra/finpilot](https://github.com/osacra/finpilot). Para manter os commits vinculados ao seu perfil:

```bash
git config user.name "osacra"
git config user.email "osacra@users.noreply.github.com"
git status
git log --oneline --decorate -10
```

Para cada evolução, altere uma pequena parte do produto, rode `pnpm check` e `pnpm test`, revise o preview local e crie um commit descritivo:

```bash
git add .
git commit -m "feat: descreva a evolução"
git push origin main
```

## Próximos passos recomendados

| Prioridade | Evolução | Resultado esperado |
|---|---|---|
| 1 | Validar os fluxos com login e banco preenchido | Confirmar criação, edição, exclusão, convite e importação no ambiente autenticado |
| 2 | Adicionar notificações por e-mail | Enviar convites e alertas financeiros sem compartilhar tokens manualmente |
| 3 | Implementar conciliação bancária ou OFX | Aproximar o produto de um fluxo financeiro real para pequenas empresas |
| 4 | Criar permissões mais granulares | Separar leitura, lançamento, aprovação e administração por função |
| 5 | Adicionar observabilidade e CI | Monitorar erros e regressões antes de cada publicação |

## Limitações conhecidas do MVP

A criação de convite retorna um token para compartilhamento manual; o envio de e-mail ainda não está integrado. A autenticação depende da configuração do Manus OAuth. O dashboard depende de uma sessão válida e de registros existentes no banco, portanto uma tela sem login ou sem dados pode apresentar estados vazios em vez de números financeiros.

## Licença e autoria

Projeto desenvolvido e mantido por **osacra**.
