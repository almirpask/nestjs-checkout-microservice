FROM node:18

RUN npm install -g @nestjs/cli

WORKDIR /app


COPY . .

RUN chmod +x ./entrypoint.sh