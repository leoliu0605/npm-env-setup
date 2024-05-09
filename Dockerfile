ARG UBUNTU_VERSION=latest

FROM node:18 as builder
WORKDIR /app
COPY . .
RUN npm install -g pnpm && \
    pnpm install --force
RUN npm run build

FROM ubuntu:${UBUNTU_VERSION}
RUN apt-get update && apt-get install -y tzdata
ENV TZ=Asia/Taipei
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
ARG USERNAME=user

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y sudo \
    -o Dpkg::Options::="--force-confold"

RUN useradd -ms /bin/bash ${USERNAME} && \
    echo "${USERNAME}:123456" | chpasswd && \
    echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER ${USERNAME}
WORKDIR /home/${USERNAME}

COPY --from=builder /app/dist /home/${USERNAME}/dist
RUN sudo chmod +x /home/${USERNAME}/dist/env-setup-linux-x64
