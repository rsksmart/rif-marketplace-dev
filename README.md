# RIF Marketplace developers guide

This project provides an easy to use developers environment for the RIF Marketplace project.

### Table of content:
- [Dependencies](#dependencies)
    - [Prerequisities](#prerequisities)
    - [Part of tutorial](#part-of-tutorial)
- Setup
    1. Developers Environment
        1. [Starting docker](#11-starting-docker)
        2. [Deploying smart contracts](#12-deploying-smart-contracts)
        3. [Browser wallet](#13-browser-wallet)
    2. [RIF Marketplace Cache](#2-rif-marketplace-cache)
    3. [RIF Marketplace UI](#3-rif-marketplace-ui)
    4. [RNS Manager](#4-rns-manager)
    5. [RIF Storage Development CLI](#5-rif-storage-developmen-cli)
    6. [RIF Storage Pinning service](#6-rif-storage-pinning-service)
- Using the RIF Marketplace
    - [Registering domains using RNS](#registering-domains-using-rns)
- [Troubleshooting](#troubleshooting) 


# Dependencies

## Prerequisities
0. node v10 (or [nvm](https://github.com/nvm-sh/nvm) with node v10 installed)
1. [Docker](https://www.docker.com/)
2. [Docker compose](https://docs.docker.com/compose/install/)

## Part of tutorial
These will be installed during the tutorial

1. [RIF Marketplace Developer Environment](https://github.com/rsksmart/rif-marketplace-dev/) project
1. [RIF Marketplace Cache](https://github.com/rsksmart/rif-marketplace-cache/) project
1. [RIF Marketplace UI](https://github.com/rsksmart/rif-marketplace-ui/) project
1. [RNS Manager Project](https://github.com/rnsdomains/rns-manager-react)
1. [RIF Storage Development CLI](https://github.com/rsksmart/rif-storage-cli) project
1. [RIF Storage Pinning Service](https://github.com/rsksmart/rif-storage-ipfs-pinner/) project

# Setup:
## 1. Developers Environment
Download and setup the RIF Marketplace Developer Environment
```
git clone git@github.com:rsksmart/rif-marketplace-dev.git

cd rif-marketplace-dev
```

### 1.1. Starting docker
Now you can start docker with
```
docker-compose up
```

The Ganache blockchain will now run and it is available to deploy the corresponding Smart Contracts.


### 1.2. Deploying smart contracts
First, install the dependencies (make sure to **use node v10**, you can switch using `nvm use 10`). 

```
sh install.sh rns storage
```

Run the deployment script for the RNS and Marketplace contracts deploying to ganache network
```
sh deploy.sh rns storage
```

This will create `./out` folder with a number of configuration files:

- `ui-config.json` - the configuration file for the [RIF Marketplace UI](https://github.com/rsksmart/rif-marketplace-ui). This contains information for all the networks which are deployed. This should be put in the `rif-marketplace-ui/src/ui-config.json`.
- `cache-[network]-config.json` - Specific per network configuration file for the [RIF Marketplace Cache](https://github.com/rsksmart/rif-marketplace-cache) service. The configuration should be in `rif-marketplace-cache/config/local.json`.
- `storageCli-[network]-config.json` - Specific per network configuration file for the [RIF Storage Development CLI](https://github.com/rsksmart/rif-storage-cli) project. The configuration should be in `rif-storage-cli/config/local.json`.
- `rnsAdmin-[network]-config.json` - Per network conguration file for the [RNS Domains Manager](https://github.com/rnsdomains/rns-manager-react). The configuration should be in `rns-manager-react/src/config/contracts.local.json`.



### 1.3. Browser wallet
In MetaMask or Nifty import the first address from `keys.txt` file. The private key is `0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d`

Connect to the local ganache network (Localhost 8545 in the network dropdown). You should now see a balance of 99 ETH (or close to that - some gas was already used to deploy the Contracts)

Now we will add RIF token. Click on `Add Token` -> `Custom Token` and input the token address that is in `./out/ui-config.json` under the `rif` attribute (should be `0x67B5656d60a809915323Bf2C40A8bEF15A152e3e` if this is your first deployment). You should now see your RIF tokens balance of 997 RIF.

You can similarly add more accounts to your wallet if needed.

## 2. RIF Marketplace Cache
Download and setup the RIF Marketplace Cache
```
git clone git@github.com:rsksmart/rif-marketplace-cache.git

cd rif-marketplace-cache
```

Install the dependencies

```
npm i
```

Copy the configuration file generated in step [1.2](#1.2.Deploying-smart-contracts) from `rif-marketplace-dev/out/cache-ganache-config.json` into `rif-marketplace-cache/config/local.json`.

Create the DB using the following command:
```
npm run bin db-sync
```

Run Precache process for the RNS Service
```
npm run bin precache rns rates
```

Run the cache for the RNS Service with
```
npm run bin -- start --enable rns --log=debug
```

## 3. RIF Marketplace UI
Download and setup the RIF Marketplace UI
```
git clone git@github.com:rsksmart/rif-marketplace-ui.git

cd rif-marketplace-ui
```

Install the dependencies

```
npm i
```

Copy the configuration file generated in step [1.2](#1.2.Deploying-smart-contracts) from `rif-marketplace-dev/out/ui-config.json` into `rif-marketplace-ui/src/ui-config.json`. (You should replace the file if already exists)

Run the UI (Will be available on http://localhost:3000/)
```
npm start
```


## 4. RNS Manager
Download and setup the RNS Manager
```
git clone git@github.com:rnsdomains/rns-manager-react.git

cd rns-manager-react
```

Install the dependencies

```
npm i
```

Copy the configuration file generated in step [1.2](#1.2.Deploying-smart-contracts) from `rif-marketplace-dev/out/rnsAdmin-ganache-config.json` into `rns-manager-react/src/config/contracts.local.json`.

Now you can start the UI (You may need to switch to another port such as http://localhost:3001 if you are already running the RIF Marketplace UI)

```
npm start
```

## 5. RIF Storage Development CLI

> This is a development CLI to interact with the Storage SC

The first account `0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1` is used for Provider and the second account `0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b` for Consumer.

Download and setup the CLI

```
$ git clone git@github.com:rsksmart/rif-storage-cli.git
$ cd rif-storage-cli
$ npm i
```

Copy the `./out/storageCli-[provider]-config.json` to `rif-storage-cli/out/local.json`.

Now you should be able create an Offer with:

```
$ npm run bin -- offer -c 1000000000 -p 600:10
```

And Agreement with:

```
$ npm run bin -- agreement:create -r 600 -s 50 -p 100000 /ipfs/QmcaCNFLMkiEXJJGBdfshnwRXgyyDdjE3aWM7ULme5Mfc1
```

You can create as many Agreements per Consumer account as you like, but for each Agreement there has to be different hash (the `/ipfs/Qm...` part).
Also, if you are trying to use this with the Pinning service then you should use hash that the Consumer has pinned, otherwise the Pinning Service will 

You can create new hash for example with (in the Pinning service repo!): 

```
echo "Testing file $(date)" | npm run ipfs:consumer -- add --stdin-name='test_file.txt'
```

**See help pages for details on the parameters and additional commands!!!**

## 6. RIF Storage Pinning service

> This is a service that listens on blockchain events and when new Agreement is created it pins a file to the configured IPFS node.

Download and setup the Pinning service
```
$ git clone git@github.com:rsksmart/rif-storage-ipfs-pinner.git
$ cd rif-storage-ipfs-pinner
$ npm i
```

Install IPFS. Recommended way is using [ipfs-update](https://github.com/ipfs/ipfs-update) but there are other ways described [here](https://github.com/ipfs/go-ipfs#install) as well. Recommended is to run the latest version but required is at least `0.5.0`.

Initialize development repos that are placed in `.repos`.  This folder can be anytime removed and the `init` command rerun. All data will be purged though.

```
$ npm run init
```

Span IPFS daemons

```
$ npm run ipfs:consumer daemon
$ npm run ipfs:provider daemon
```

You can use NPM's scripts `npm run ipfs:consumer` and `npm run ipfs:provider` to interact with each IPFS nodes. It has the same commands like `ipfs` command.

To interact with pinning service use the `npm run bin` script. To start Pinning service run:

```
$ npm run bin -- --offerId 0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1 --log=verbose
```

You should see in logs when new Agreements are detected and pinned. You can also use the `npm run ipfs:provider pin ls` to see if the hash was indeed pinned. 

**See help pages for details on the parameters and additional commands!!!**

# Using the RIF Marketplace

## Registering domains using RNS
Go through the normal RNS registration flow but each time you make transaction you need to create new block as it requires at least 1 confirmation. You can do that with:

```sh
sh forward.sh
```

# Troubleshooting
### RNS manager missmatch between networks
Solution: switch back and forth a network on MetaMask/Nifty. If that does not work make sure you have setup correctly the network id in the RNS step.
