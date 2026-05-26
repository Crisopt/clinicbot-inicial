# 🏥 ClinicBot — Sistema de Lembretes WhatsApp

Painel administrativo com backend completo para gerenciar pacientes, agendamentos e envio automático de lembretes via WhatsApp.

---

## ✅ Pré-requisito único

Instale o **Docker Desktop**:
- Windows/Mac: https://www.docker.com/products/docker-desktop
- Linux: https://docs.docker.com/engine/install

---

## 🚀 Como rodar (3 passos)

**1. Configure o .env**
```bash
cp .env.example .env
```
Abra o arquivo `.env` e preencha:
```
WHATSAPP_TOKEN=seu_token_da_meta
WHATSAPP_PHONE_ID=seu_phone_id
MASTER_PHONE=5511999999999
```
> **Sem token?** Tudo bem! O sistema funciona em modo simulado — os envios aparecem no console do worker.

**2. Suba todos os serviços**
```bash
docker compose up --build
```
Na primeira vez pode demorar ~2 minutos para baixar as imagens.

**3. Acesse o painel**

Abra no navegador: **http://localhost:3000**

---

## 📦 O que sobe com o Docker

| Serviço | Descrição | Porta |
|---------|-----------|-------|
| `api` | Backend NestJS | 3000 |
| `worker` | Worker BullMQ | — |
| `postgres` | Banco de dados | 5432 |
| `redis` | Fila de jobs | 6379 |

---

## 🤖 Regras de automação

| Regra | Quando dispara | Destinatário | Mensagem |
|-------|---------------|--------------|---------|
| Admin | 2 dias após cadastro | MASTER_PHONE | "O paciente X possui consulta em 2 dias" |
| Paciente | 2 dias antes da consulta | Telefone do paciente | "Olá X, sua consulta é em 2 dias" |

---

## 🛠 Comandos úteis

```bash
# Ver logs em tempo real
docker compose logs -f

# Ver só o worker (envios)
docker compose logs -f worker

# Parar tudo
docker compose down

# Parar e apagar os dados
docker compose down -v

# Reiniciar só a API
docker compose restart api
```

---

## 📁 Estrutura do projeto

```
clinicbot/
├── docker-compose.yml      ← Orquestra todos os serviços
├── .env.example            ← Modelo de configuração
├── Dockerfile              ← Container da API
├── Dockerfile.worker       ← Container do Worker
├── prisma/
│   └── schema.prisma       ← Modelo do banco de dados
├── frontend/
│   └── index.html          ← Painel web
└── src/
    ├── main.ts
    ├── app.module.ts
    ├── prisma/
    ├── queues/
    ├── workers/
    │   └── reminder.worker.ts
    └── modules/
        ├── patients/
        ├── appointments/
        └── whatsapp/
```

---

## 🔗 API REST

```
POST   /api/patients              Cadastrar paciente
GET    /api/patients              Listar pacientes
DELETE /api/patients/:id          Remover paciente

POST   /api/appointments          Criar agendamento + agendar jobs
GET    /api/appointments          Listar agendamentos
GET    /api/appointments/queue/status  Status da fila BullMQ
DELETE /api/appointments/:id      Cancelar + remover jobs da fila
```

---

## 📱 WhatsApp Cloud API (Meta)

1. Acesse https://developers.facebook.com
2. Crie um app → WhatsApp → Business
3. Copie o **Token de acesso** e o **Phone ID**
4. Cole no `.env`

---

## ⚠️ Problemas comuns

**"API offline" no painel**
→ Rode `docker compose up` e aguarde ~30 segundos

**Porta 3000 em uso**
→ Mude no docker-compose.yml: `"3001:3000"`

**Mensagens não chegam**
→ Verifique WHATSAPP_TOKEN e MASTER_PHONE no .env
→ O número deve ser cadastrado no WhatsApp Business
