# RIF Marketplace developers guide

This project provides an easy to use developers environment for the **RIF Marketplace** project. It installs all the required components to run the **RNS Name Services** and **Storage Pinning Services**.

### Table of content:
- [Dependencies](#dependencies)
    - [Prerequisities](#prerequisities)
    - [Part of tutorial](#part-of-tutorial)
- Setup
    1. Developers Environment
        1. [Starting docker](#11-starting-docker)
        2. [Deploying smart contracts](#12-deploying-smart-contracts)
        3. [Browser wallet](#13-browser-wallet)
        4. [IPFS Nodes](#14-ipfs-nodes)
    2. [RIF Communications Pubsub BootNode](#2-rif-communications-pubsub-bootnode)
    3. [RIF Marketplace Cache](#3-rif-marketplace-cache)
    4. [RIF Marketplace Upload Service](#4-rif-marketplace-upload-service)
    5. [RIF Marketplace UI](#5-rif-marketplace-ui)
    6. [RNS Manager](#6-rns-manager)
    7. [RIF Storage Pinning service](#7-rif-storage-pinning-service)
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
1. [RIF Comms Pubsub BootNode](https://github.com/rsksmart/rif-communications-pubsub-bootnode) project   
1. [RIF Marketplace Cache](https://github.com/rsksmart/rif-marketplace-cache/) project
1. [RIF Marketplace Upload Service](https://github.com/rsksmart/rif-marketplace-upload-service/) project
1. [RIF Marketplace UI](https://github.com/rsksmart/rif-marketplace-ui/) project
1. [RNS Manager Project](https://github.com/rnsdomains/rns-manager-react)
1. [RIF Storage Pinning Service](https://github.com/rsksmart/rif-storage-pinner/) project

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
- `rnsAdmin-[network]-config.json` - Per network conguration file for the [RNS Domains Manager](https://github.com/rnsdomains/rns-manager-react). The configuration should be in `rns-manager-react/src/config/contracts.local.json`.
- `rooms-[network].json` - Rooms attribute for the [RIF Communications Pubsub Bootnode](https://github.com/rsksmart/rif-communications-pubsub-bootnode) configuration file.


### 1.3. Browser wallet
In MetaMask or Nifty import the first address from `keys.txt` file. The private key is `0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d`

Connect to the local ganache network (Localhost 8545 in the network dropdown). You should now see a balance of 99 ETH (or close to that - some gas was already used to deploy the Contracts)

Now we will add RIF token. Click on `Add Token` -> `Custom Token` and input the token address that is in `./out/ui-config.json` under the `rif` attribute (should be `0x67B5656d60a809915323Bf2C40A8bEF15A152e3e` if this is your first deployment). You should now see your RIF tokens balance of 997 RIF.

You can similarly add more accounts to your wallet if needed.

### 1.4. IPFS Nodes

Install IPFS. Recommended way is using [ipfs-update](https://github.com/ipfs/ipfs-update) but there are other ways described [here](https://github.com/ipfs/go-ipfs#install) as well. Recommended is to run the latest version but required is at least `0.5.0`.

To complete this setup you will need at least two running instances of **IPFS**. These can be spawned and ran easily through the **RIF Storage Pinning** repository, which will provide two instances already configured and ready to be used by the **RIF Marketplace**.

Download and setup the Pinning service
```
$ git clone git@github.com:rsksmart/rif-storage-pinner.git
$ cd rif-storage-pinner
$ npm i
```

Initialize development repos that are placed in `.repos`.  This folder can be anytime removed and the `init` command rerun. All data will be purged though.
```
$ npm run init
```

Spawn IPFS daemons
```
$ npm run ipfs:consumer daemon
$ npm run ipfs:provider daemon
```

You can use NPM's scripts `npm run ipfs:consumer` and `npm run ipfs:provider` to interact with each IPFS nodes. It has the same commands like `ipfs` command.

You should now have two instances of **IPFS** running on ports `5002` and `5003`.


## 2. RIF Communications Pubsub Bootnode
Download and setup the RIF Communications Pubsub Bootnode
```
git clone git@github.com:rsksmart/rif-communications-pubsub-bootnode.git

cd rif-communications-pubsub-bootnode
```

Install the dependencies
```
npm i
```

Copy the `rooms` attribute from the configuration file generated in step [1.2](#1.2.Deploying-smart-contracts) from `rif-marketplace-dev/out/rooms-ganache.json`. Include this attribute in the `development.json5` file. It should look like:
```
{
  peerId: { ... },
  rooms: [ "8545:0xddb64fe46a91d46ee29420539fc25fd07c5fea3e:0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
           "8545:0xddb64fe46a91d46ee29420539fc25fd07c5fea3e:0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0",
           "8545:0xddb64fe46a91d46ee29420539fc25fd07c5fea3e:0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b",
           "8545:0xddb64fe46a91d46ee29420539fc25fd07c5fea3e:0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d" ]
}
```

Run the Pubsub Bootnode with
```
NODE_ENV=development npm run start
```


## 3. RIF Marketplace Cache
Download and setup the RIF Marketplace Cache
```
git clone git@github.com:rsksmart/rif-marketplace-cache.git

cd rif-marketplace-cache
```

Install the dependencies

```
npm i
```

Create the DB using the following command:
```
npm run bin -- db-migration --up
```

Run Precache process for the RNS Service (for ganache network)
```
NODE_ENV=ganache npm run bin precache rns rates storage
```

Run the cache for the RNS Service with
```
NODE_ENV=ganache npm run bin -- start --enable rns storage --log=debug
```

## 4. RIF Marketplace Upload Service
Download and setup the RIF Marketplace Upload Service
```
git clone git@github.com:rsksmart/rif-marketplace-upload-service.git

cd rif-marketplace-upload-service
```

Install the dependencies
```
npm i
```

Create the DB using the following command:
```
npm run bin -- db-migration --up
```

Run Upload Service (connected to previously deployed IPFS node)
```
NODE_ENV=development npm run bin start -- --log=debug
```


## 5. RIF Marketplace UI
Download and setup the RIF Marketplace UI
```
git clone git@github.com:rsksmart/rif-marketplace-ui.git

cd rif-marketplace-ui
```

Install the dependencies

```
npm i
```

Run the UI (Will be available on http://localhost:3000/)
```
npm start
```


## 6. RNS Manager
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


## 7. RIF Storage Pinning service

> This is a service that listens on blockchain events and when new Agreement is created it pins a file to the configured IPFS node.

Download and setup the Pinning service (already done when running **IPFS** nodes)
```
$ git clone git@github.com:rsksmart/rif-storage-pinner.git
$ cd rif-storage-pinner
$ npm i
```

Make sure you have **IPFS** installed. We will use one of the previously deployed instances of **IPFS**.

To interact with pinning service use the `npm run bin` script. To start Pinning service run:

```
npm run bin -- init --offerId=0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1 --db=./db.sqlite
```

This will provide the `peerId` that should be used in the *RIF Marketplace UI*  to create the Storage offer. Once the offer is created in the UI you can run the service using:

```
NODE_ENV=ganache npm run bin daemon -- --log=debug --db=./db.sqlite
```

You should see in logs when new Agreements are detected and pinned. 

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
