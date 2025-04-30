# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# 1) Installer les dépendances
COPY package.json package-lock.json* ./
RUN npm install

# 2) Copier le code Prisma et générer le client
COPY prisma ./prisma
RUN npx prisma generate

# 3) Copier le reste du code
COPY . .

# 4) Préparer le dossier d’uploads
RUN mkdir -p uploads

# 5) Ouvrir le port
EXPOSE 4000

# 6) Démarrer en mode dev (nodemon)
CMD ["npm", "run", "dev"]
