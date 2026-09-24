# Agenda Coworking

MVP acadêmico para entender o fluxo de uma reserva: **agendamento → confirmação pelo usuario → check-in → realização**, com cancelamento quando necessário. O foco é demonstrar Next.js, React, NestJS, REST e `localStorage` de forma simples e organizada.

## Tecnologias e estrutura

- `ppw_client/`: Next.js, React, TypeScript, Tailwind CSS e a interface em `http://localhost:3000`.
- `ppw_server/`: NestJS, TypeScript e API REST em `http://localhost:8000`.
- `iniciar-ambiente.bat`: referência de inicialização dos dois projetos em Windows.

## Execução

Em dois terminais:

```bash
cd ppw_server
npm install
npm run start:dev
```

```bash
cd ppw_client
npm install
npm run dev
```

Abra `http://localhost:3000`. A rota `GET http://localhost:8000` confirma que a API está online.

## Persistência e sincronização

Não existe banco de dados neste projeto. O `localStorage` do navegador é a persistência permanente das reservas, na chave `agenda-clinica-reservas`. O NestJS mantém apenas uma lista temporária em memória.

No primeiro acesso, o frontend chama `GET /reservas` e salva os dados iniciais. Nos acessos seguintes, carrega os dados locais e envia a lista para `PUT /reservas/sincronizar`. Assim, se o backend reiniciar, ele recupera a lista atual antes de uma edição ou mudança de status.

```text
Frontend → api.ts → NestJS → Service → resposta → React → storage.ts → localStorage
localStorage → PUT /reservas/sincronizar → memória do NestJS
```

## Fluxo e regras

```text
AGENDADA → CONFIRMADA → CHECK_IN → REALIZADA
AGENDADA ou CONFIRMADA → CANCELADA
```

- Reservas não são excluídas: cancelar altera o status para `CANCELADA`.
- O mesmo espaço não pode ter duas reservas na mesma data e horário; a API responde `409 Conflict`.
- Reservas canceladas não bloqueiam um horário.
- Transições inválidas de status recebem `400 Bad Request`.

## Arquivos principais

### Backend

- `ppw_server/src/main.ts`: inicia o NestJS, ativa CORS, `ValidationPipe` e porta 8000.
- `ppw_server/src/app/app.module.ts`: reúne os módulos da aplicação.
- `ppw_server/src/reservas/reservas.controller.ts`: recebe as requisições HTTP de reservas.
- `ppw_server/src/reservas/reservas.service.ts`: contém as regras, os dados temporários e a sincronização.
- `ppw_server/src/reservas/dto/`: define os dados recebidos pela API.
- `ppw_server/src/usuarios/` e `ppw_server/src/espacos/`: fornecem catálogos fictícios.

### Frontend

- `ppw_client/src/app/`: páginas do Next.js.
- `ppw_client/src/components/`: provider, navegação e componentes reutilizáveis.
- `ppw_client/src/lib/api.ts`: centraliza a comunicação HTTP.
- `ppw_client/src/lib/storage.ts`: centraliza o acesso ao `localStorage`.
- `ppw_client/src/types/`: tipos TypeScript usados na interface.

## API REST

| Método | Rota | Função |
| --- | --- | --- |
| GET | `/reservas` | Lista reservas |
| GET | `/reservas/:id` | Busca reserva |
| POST | `/reservas` | Cria reserva |
| PATCH | `/reservas/:id` | Edita reserva ou status |
| PUT | `/reservas/sincronizar` | Sincroniza reservas com localStorage |
| GET | `/usuarios` | Lista usuarios |
| GET | `/usuarios/:id` | Busca usuario |
| GET | `/espacos` | Lista espaços |
| GET | `/espacos/:id` | Busca espaço |
