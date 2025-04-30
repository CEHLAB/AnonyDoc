# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# 1) Installer les dépendances
COPY package.json package-lock.json* ./
RUN npm install

# 2) Copier tout le code
COPY . .

# 3) Exposer le port Vite
EXPOSE 5173

# 4) Démarrer Vite en mode dev
CMD ["npm", "run", "dev"]
