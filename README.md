# BudgetFlow

BudgetFlow est une application de gestion de budget personnel réalisée avec **Vue 3 + Fastify + MongoDB**.

## Fonctionnalités MVP

- Auth: register / login / logout
- Route privée `/users/me`
- Budget mensuel utilisateur
- Création de transaction (revenu/dépense)
- Historique filtrable
- Suppression de transaction
- Endpoint `/transactions/summary` pour le dashboard
- UI avec états loading / error / empty

## Stack

- Front: Vue 3, Vite, Pinia, Vue Router
- Back: Node.js, Fastify, Mongoose, JWT Cookie Auth
- DB: MongoDB

## Structure

- `client/`: frontend Vue
- `server/`: API Fastify

## Lancer en local

### 1) Préparer MongoDB

Option rapide en Docker:

```bash
docker compose up -d
```

### 2) Variables d'environnement

Backend (`server/.env`):

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:35115/budgetflow
JWT_SECRET=change-me
CLIENT_ORIGIN=http://localhost:5173
```

Frontend (`client/.env`):

```env
VITE_API_URL=http://localhost:3000
```

### 3) Installer et lancer

```bash
npm install
npm run dev:server
npm run dev:client
```

Frontend: http://localhost:5173  
Backend: http://localhost:3000

## Endpoints API

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`

### User

- `GET /users/me` (privé)
- `PATCH /users/me/budget` (privé)

### Transactions

- `POST /transactions` (privé)
- `GET /transactions` (privé, filtres: `type`, `from`, `to`, `category`)
- `DELETE /transactions/:transactionId` (privé)
- `GET /transactions/summary?month=YYYY-MM` (privé)

## Déploiement (checklist)

### Backend (Render / Railway)

- [ ] définir `NODE_ENV=production`
- [ ] définir `MONGO_URI`
- [ ] définir `JWT_SECRET`
- [ ] définir `CLIENT_ORIGIN` vers URL frontend
- [ ] vérifier CORS + cookies

### Frontend (Netlify / Vercel)

- [ ] définir `VITE_API_URL` vers URL backend
- [ ] vérifier login/logout en production
- [ ] vérifier que les routes privées redirigent correctement

## Tests

Tests unitaires backend (summary/date range):

```bash
npm run test -w server
```

## Limites connues

- Pas de vérification email (hors MVP)
- Pas de pagination dans l'historique (volontairement reporté)
- Pas de bonus (graph/export) tant que la stabilité MVP n'est pas validée
