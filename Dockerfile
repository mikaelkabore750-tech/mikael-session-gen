# Dockerfile final — léger, rapide, parfait pour ton session-gen
FROM node:20-alpine

WORKDIR /app

# Copie package.json en premier (meilleur cache Docker)
COPY package.json ./

# Installe seulement ce qui est nécessaire en prod
RUN npm install --omit=dev

# Copie tout le code source
COPY . .

# Port (Render, Railway, Koyeb, etc. utilisent $PORT)
EXPOSE 8000

# Démarrage direct avec node (plus rapide que "npm start")
CMD ["node", "index.js"]
