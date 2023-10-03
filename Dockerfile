# Use uma imagem base do Node.js
FROM node

# Crie e defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o arquivo package.json e yarn.lock para o diretório de trabalho
COPY package.json package-lock.json ./

# Instale as dependências do projeto usando o npm
RUN npm install

RUN npm install -g next

# Copie todos os arquivos do projeto para o diretório de trabalho
COPY . .

RUN npm run build

# Exponha a porta em que a aplicação será executada (a porta padrão do Next.js é 3000)
EXPOSE 3000

# Comando para iniciar o aplicativo React
CMD ["npm", "start"]
