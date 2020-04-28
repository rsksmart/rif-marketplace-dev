# Local development environment for RIF Marketplace services

This project provides easy to use developers environment for the RIF Marketplace project.

## Prerequisities

- [Docker](https://www.docker.com/)
- [Docker compose](https://docs.docker.com/compose/install/)
- [node v10](https://nodejs.org/)
- npm

## Usage

### Start docker compose

```ssh
docker-compose up
```

This will download and and run container with following services:

- RSKj node running regtest network on http://localhost:4444
- Ganache node running on http://localhost:8545
- Postgres Database
- Postgres Admin interface on http://localhost:8080

### Install dependencies for smart contract

Before deploying smart contract, please install all the dependencies with:

```
sh install.sh
```

**Important: this project only works with node v10**

### Deploy smart contracts

Deploy smart contracts and create configuration files

```
sh deploy.sh
```

This will create `./out` folder which contains files:

- `ui-config.json` - the configuration file for the [RIF Marketplace UI](https://github.com/rsksmart/rif-marketplace-ui). This contains information for all the networks which are deployed. This should be put in the `rif-marketplace-ui/src/ui-config.json`.
- `cache-[network]-config.json` - Specific per network configuration file for the [RIF Marketplace Cache](https://github.com/rsksmart/rif-marketplace-cache) service. The configuration should be in `rif-marketplace-cache/config/local.json`.
- `rnsAdmin-[network]-config.json` - Per network conguration file for the [RNS Domains Manager](https://github.com/rnsdomains/rns-manager-react). The configuration should be in `rns-manager-react/src/config/contracts.local.json`.

## Data folders

The folder `./data` contains the current mounted file system for each service:

- /db - current Postgres DB files
- /ganache
  - /database - ganache blockchain DB files
- /rskj
  - /database - rskj blockchain DB files
  - /logs - contains the logs

> You can remove the data folder for a fresh start.
