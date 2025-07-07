# === Étape 1: Base ===
# Utilisation d'une image Node.js légère et sécurisée.
FROM node:18-alpine AS base

# === Étape 2: Dépendances ===
# Installation de TOUTES les dépendances, y compris les devDependencies
# nécessaires pour le build.
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# === Étape 3: Builder ===
# Construction de l'application Next.js.
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Déclaration des arguments qui seront passés par docker-compose.
ARG DATABASE_URL
ARG JWT_SECRET

# Exposition de ces arguments comme variables d'environnement pour la commande `npm run build`.
ENV DATABASE_URL=${DATABASE_URL}
ENV JWT_SECRET=${JWT_SECRET}

# Lancement du build de production.
RUN npm run build

# === Étape 4: Production ===
# Création de l'image finale, optimisée et sécurisée.
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Création d'un utilisateur non-root pour des raisons de sécurité.
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copie des fichiers de l'application depuis l'étape "builder".
# Grâce à `output: 'standalone'`, on ne copie que le strict nécessaire.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 3000

# Commande pour démarrer le serveur Next.js.
CMD ["node", "server.js"]

# === Étape de développement ===
# Configuration spécifique pour l'environnement de développement.
FROM base AS development
WORKDIR /app

# Copier les fichiers de dépendances d'abord pour optimiser le cache Docker
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# (Gardez la commande de démarrage par défaut, elle sera surchargée par docker-compose en dev)
