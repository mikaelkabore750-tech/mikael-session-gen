FROM node:20-bullseye

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ffmpeg \
        imagemagick \
        libwebp-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 8000

CMD ["npm", "start"]