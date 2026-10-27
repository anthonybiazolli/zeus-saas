FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# Instala o typescript globalmente para compilar (garante que funciona)
RUN npm install -g typescript
# Compila o projeto (cria a pasta dist/)
RUN tsc
EXPOSE 3000
# Executa a versão compilada
CMD ["node", "dist/server.js"]