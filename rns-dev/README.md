# RIF Marketplace - RNS dev env

RNS development environment for RIF Marketplace.

## Setup

```
git clone https://github.com/rsksmart/rif-marketplace-rns-dev-env.git
cd rif-marketplace-rns-dev-env
npm i
```

> Works ok with Node v10.20.1. Install it with `nvm install v10` and `nvm use v10`

## Run with Ganache

1. Start Ganache, using [docker](https://github.com/rsksmart/rif-marketplace-dev), terminal or the desktop app.

For the terminal: `npm i -g ganache-cli` and `ganache-cli`

2. Migrate the contracts

```
npx truffle migrate --network ganache
```

3. The configuration is written in:

```
./out/ganache.json
```

## RSK Regtest

1. Run an `rskj` regtest instance. [Here](https://developers.rsk.co/quick-start/step1-install-rsk-local-node/) how to.

2. Migrate the contracts

```
npx truffle migrate --network regtest
```

3. The configuration is written in:

```
./out/regtest.json
```
