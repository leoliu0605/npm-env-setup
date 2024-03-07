FROM ubuntu:20.04

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y curl gnupg2

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs

COPY . .

RUN npm install -g pnpm && \
    pnpm install --force

CMD ["npm", "test"]
