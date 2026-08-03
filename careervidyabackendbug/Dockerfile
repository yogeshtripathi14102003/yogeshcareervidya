FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"] 
# (Yahan index.js ki jagah apni main file ka naam likhein)