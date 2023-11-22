# Etape de construction
FROM node:18 as build
WORKDIR /usr/src/app

# Copie des fichiers de configuration
COPY package.json .
COPY package-lock.json .
COPY . .

# Installation des dépendances et génération des fichiers Prisma
RUN npm install
RUN npm uninstall bcrypt
RUN npm install bcrypt
RUN npm install bcryptjs
RUN npm run prisma:generate
RUN npm run build

# Etape de production
FROM node:18-slim
RUN apt update && apt install libssl-dev dumb-init -y --no-install-recommends
WORKDIR /usr/src/app

# Copie des fichiers de l'étape de construction
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/.env .env
COPY --chown=node:node --from=build /usr/src/app/package.json .
COPY --chown=node:node --from=build /usr/src/app/package-lock.json .

# Installation des dépendances de production
RUN npm install --omit=dev

# Copie du dossier .prisma/client généré
COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma/client  ./node_modules/.prisma/client

# Configuration de l'environnement
ENV NODE_ENV production

# Exposition du port
EXPOSE 3000

# Utilisation de dumb-init pour une meilleure gestion des signaux
CMD ["npm", "run","start:prod"]
