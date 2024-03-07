# One Line Command to Setup Your New Computer

### Usage

#### Windows

```shell
winget install OpenJS.NodeJS.LTS && npm install @leoli0605/env-setup -g && npx @leoli0605/env-setup
```

#### MacOS

```bash
curl "https://nodejs.org/dist/latest-v20.x/$(curl -s https://nodejs.org/dist/latest-v20.x/ | grep "pkg" | cut -d'"' -f 2)" -o "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/" && /usr/local/bin/npm install @leoli0605/env-setup -g && npx @leoli0605/env-setup
```

#### Linux (Ubuntu 20.04 LTS and later)

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && \
sudo apt-get install -y nodejs && \
npm install @leoli0605/env-setup -g && npx @leoli0605/env-setup
```
