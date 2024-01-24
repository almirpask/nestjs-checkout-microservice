FROM node:18


WORKDIR /app


COPY . /app

RUN chmod +x /entrypoint.sh