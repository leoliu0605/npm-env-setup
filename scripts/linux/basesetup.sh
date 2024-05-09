#!/bin/bash

sudo apt-get install -y software-properties-common apt-transport-https lsb-release
sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get install -y \
    software-properties-common \
    build-essential \
    curl \
    jq \
    libbz2-dev \
    libffi-dev \
    liblzma-dev \
    libncurses5-dev \
    libncursesw5-dev \
    libreadline-dev \
    libsqlite3-dev \
    libssl-dev \
    llvm \
    python3-openssl \
    tk-dev \
    wget \
    xz-utils \
    zlib1g-dev \
    git
