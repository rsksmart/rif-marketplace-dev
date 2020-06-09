# RIF Marketplace - STORAGE dev env

Storage development environment for RIF Marketplace.

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