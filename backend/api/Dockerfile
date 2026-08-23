FROM node:20

WORKDIR /app

COPY ./backend/api/package*.json ./
RUN npm install

COPY ./shared-sql /shared-sql
COPY ./backend/api .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/backend/api/src/main.js"]