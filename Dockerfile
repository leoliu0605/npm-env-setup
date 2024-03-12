FROM ubuntu:20.04
RUN apt-get update && apt-get install -y tzdata
ENV TZ=Asia/Taipei
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ARG USERNAME=user

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y curl gnupg2 git

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y sudo \
    -o Dpkg::Options::="--force-confold"

RUN useradd -ms /bin/bash ${USERNAME} && \
    echo "${USERNAME}:123456" | chpasswd && \
    echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER ${USERNAME}
WORKDIR /home/${USERNAME}

RUN git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.14.0
ENV PATH="/home/${USERNAME}/.asdf/bin:/home/${USERNAME}/.asdf/shims:$PATH"
RUN echo ". $HOME/.asdf/asdf.sh" >> ~/.bashrc && \
    echo ". $HOME/.asdf/completions/asdf.bash" >> ~/.bashrc
RUN /bin/bash -c ". $HOME/.asdf/asdf.sh && \
    asdf plugin-add nodejs && \
    asdf install nodejs 18.18.0 && \
    asdf global nodejs 18.18.0"

COPY . .

RUN npm install -g pnpm && \
    pnpm install --force

CMD ["npm", "test"]
