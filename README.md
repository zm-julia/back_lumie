# LUMIÉ - Beauty & Professionals (12 Tabelas)

Projeto full-stack: Node.js + Express + Sequelize (MySQL) no backend, HTML/CSS/JS puro no frontend.
Backend e frontend são publicados **separadamente**: o backend no **Railway**, o frontend
como site estático no **Vercel**.

```
ecom_3B_7_tab-main/
├── backend/     # API (Node.js + Express + Sequelize) -> deploy no Railway
├── frontend/    # HTML, CSS e JS puro -> deploy no Vercel
├── diagramas_UML/
└── documentacao/
```

## 1. Pré-requisitos

- Node.js 18+ instalado (precisa da versão 18 pra cima por causa do `fetch` nativo usado em `utils/consultaCep.js`)
- MySQL rodando localmente (ou acesso a um servidor MySQL)

## 2. Rodando o BACKEND localmente

1. Entre na pasta `backend`:
   ```
   cd backend
   ```
2. Instale as dependências:
   ```
   npm install
   ```
3. Copie o arquivo de variáveis de ambiente de exemplo e ajuste com os dados do seu banco:
   ```
   cp var_ambiente_env_exemplo.txt .env
   ```
   Edite o `.env` com o usuário/senha do seu MySQL local. Não é obrigatório mudar o `JWT_SECRET`
   para rodar localmente, mas em produção isso deve ser trocado por uma string aleatória forte.

4. Crie o banco de dados vazio no MySQL (o nome deve bater com `DB_NAME` do `.env`):
   ```sql
   CREATE DATABASE db_ecom;
   ```

5. Sincronize as tabelas e popule dados de teste:
   ```
   npm run sync   # cria as 12 tabelas a partir dos models
   npm run seed   # cadastra categorias, produtos, profissionais e um usuário admin de teste
   ```

   Login do admin criado pelo seed:
   - **E-mail:** admin@lumie.com
   - **Senha:** admin123

6. Suba o servidor:
   ```
   npm run dev     # com nodemon (recarrega sozinho a cada alteração)
   # ou
   npm start       # sem nodemon
   ```

   A API sobe em `http://localhost:3000` — agora ela é só API, não serve mais o frontend.

## 3. Rodando o FRONTEND localmente

O frontend é HTML/CSS/JS puro, não precisa de `npm install` nem build. Abra a pasta
`frontend/` com a extensão **Live Server** do VS Code (ou qualquer servidor estático)
e acesse `index.html`.

O arquivo `frontend/js/api.js` já detecta automaticamente se está rodando em `localhost`
e aponta pro backend local (`http://localhost:3000`) — não precisa mudar nada pra testar
localmente.

## 4. Testando a API

Use o arquivo `backend/rest_client.http` (extensão **REST Client** do VS Code) para testar
as rotas sem precisar do frontend. Depois de fazer login, copie o `token` retornado e cole
na variável `@token` no topo do arquivo.

## 5. Estrutura de pastas do backend

```
backend/
├── controllers/    # regras de negócio de cada entidade
├── db/             # conexão com o MySQL (Sequelize)
├── middlewares/    # auth.js (JWT) e isAdmin.js
├── models/         # as 12 entidades + relacionamentos (rel.js)
├── routes/         # rotas Express de cada entidade
├── utils/          # validaCpf.js e consultaCep.js
├── server.js       # ponto de entrada da API
├── sync.js         # recria as tabelas no banco
└── seed.js         # popula dados de teste
```

As 12 tabelas: `Usuario`, `Categoria`, `Produto`, `Estoque`, `Pedido`, `ItemPedido`,
`Entrega` (as 7 obrigatórias) + `Profissional`, `Servico`, `Localizacao`, `Agendamento`,
`Avaliacao` (as 5 novas da LUMIÉ).

## 6. Deploy

### Backend no Railway

1. Crie um novo projeto no Railway e conecte o repositório (ou faça upload do código).
2. Configure:
   - **Root Directory:** `backend`
   - **Start Command:** `npm start`
3. Clique em **"+ New" → "Database" → "Add MySQL"** dentro do mesmo projeto. O Railway sobe
   um banco MySQL e gera sozinho uma variável chamada **`MYSQL_URL`** (algo como
   `mysql://root:senha@host.railway.internal:3306/railway`), sem você precisar preencher nada.
4. No serviço do **backend** (não no serviço do banco), vá em **Variables** e adicione:
   - `MYSQL_URL` → clique em "Add Reference" e selecione a `MYSQL_URL` do serviço MySQL
     que você acabou de criar (o Railway deixa referenciar a variável de um serviço no outro,
     sem copiar e colar o valor).
   - `JWT_SECRET` → uma string aleatória forte
   - `JWT_EXPIRES_IN` → ex: `3h`
   - `BCRYPT_SALT_ROUNDS` → ex: `10`

   Repare que **não precisa** configurar `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_HOST` nem
   `DB_PORT` no Railway — o `db/conn.js` detecta a `MYSQL_URL` automaticamente e usa ela no
   lugar dessas variáveis separadas (que continuam servindo só pra rodar local, via `.env`).
5. Depois do primeiro deploy, rode `npm run sync` e `npm run seed` (pela aba **Shell/Terminal**
   do próprio serviço no Railway) para criar as tabelas e os dados iniciais no banco de produção.
6. Copie a URL pública gerada pelo Railway pro seu backend (em **Settings → Networking →
   Generate Domain**), algo como `https://ecom-lumie-production.up.railway.app`.

### Frontend no Vercel

1. Crie um novo projeto no Vercel e conecte o repositório.
2. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Other / nenhum (é HTML estático puro, sem build)
3. **Antes de publicar**, edite `frontend/js/api.js` e troque `SEU-BACKEND-AQUI` pela URL
   real do backend copiada do Railway.
4. Publique. O Vercel vai servir os arquivos `.html` diretamente (ex: `/login.html`,
   `/carrinho.html`), sem precisar de nenhuma configuração de rotas.

> O `cors()` já está habilitado no `server.js`, então o backend aceita chamadas vindas
> do domínio do Vercel sem configuração extra.
