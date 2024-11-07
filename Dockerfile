FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN npm run build

ARG PORT
ARG PRINTER_ID
ENV PORT=${PORT}
ENV PRINTER_ID=${PRINTER_ID}

EXPOSE ${PORT}

CMD ["npm", "run", "start:prod"]
