# RIF Marketplace developers guide

This project provides an easy to use developers environment for the **RIF Marketplace** project. If contains a multitude of scripts in the `package.json` file. It installs and sets up all the required components to run the **RNS Name Services**, **Storage Pinning Services** and **Notifier Services (wip)**.

### Table of content:
- [Dependencies](#dependencies)
    - [Prerequisities](#prerequisities)
    - [Part of tutorial](#part-of-tutorial)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
    1. [Developers Environment](#developers-environment)
        1. [Starting local blockchain](#11-starting-local-blockchain)
        2. [Deploying smart contracts](#12-deploying-smart-contracts)
        3. [Browser wallet](#13-browser-wallet)
        4. [IPFS Nodes](#14-ipfs-nodes)
    2. [RIF Communications Pubsub BootNode](#2-rif-communications-pubsub-bootnode)
    3. [RIF Marketplace Cache](#3-rif-marketplace-cache)
    4. [RIF Marketplace Upload Service](#4-rif-marketplace-upload-service)
    5. [RIF Marketplace UI](#5-rif-marketplace-ui)
    6. [RNS Manager](#6-rns-manager)
    7. [RIF Storage Pinning service](#7-rif-storage-pinning-service)
    8. [RIF Notifier Service](#8-rif-notifier-service)
- Using the RIF Marketplace
    - [Registering domains using RNS](#registering-domains-using-rns)
- [Troubleshooting](#troubleshooting) 


# Dependencies

## Prerequisities
0. node v10 (or [nvm](https://github.com/nvm-sh/nvm) or [n](https://github.com/tj/n) with node v10 installed (**to be upgraded**))
1. [meta](https://github.com/mateodelnorte/meta) is used for bulk repo and tasks management. `npm i -g meta`
2. [pm2](https://github.com/Unitech/pm2) is used for processes and logs management in the local environment. `npm i -g pm2`
3. [IPFS](https://ipfs.io/) The recommended way to install IPFS is using [ipfs-update](https://github.com/ipfs/ipfs-update) but there are other ways described [here](https://github.com/ipfs/go-ipfs#install) as well. Recommended is to run the latest version but required is at least `0.7.0`. (used for the storage setup only)
4. [Docker](https://www.docker.com/) (optional, only if you use docker setup)
5. [Docker compose](https://docs.docker.com/compose/install/) (optional, only if you use docker setup)

## Part of tutorial
These repositories will be cloned and installed during the tutorial

1. [RIF Marketplace Developer Environment](https://github.com/rsksmart/rif-marketplace-dev/) project  
1. **(Disabled)** [RIF Comms Pubsub BootNode](https://github.com/rsksmart/rif-communications-pubsub-bootnode) project  
1. [RIF Marketplace Cache](https://github.com/rsksmart/rif-marketplace-cache/) project
1. [RIF Marketplace Upload Service](https://github.com/rsksmart/rif-marketplace-upload-service/) project
1. [RIF Storage Pinning Service](https://github.com/rsksmart/rif-storage-pinner/) project
1. [RIF Marketplace UI](https://github.com/rsksmart/rif-marketplace-ui/) project
1. [RNS Manager Project](https://github.com/rnsdomains/rns-manager-react)
1. [RIF Notifier Service](https://github.com/rsksmart/rif-notifier) project

# Quick Start

1. `meta git clone git@github.com:rsksmart/rif-marketplace-dev.git` - will clone the meta dev repository and recursively clone the nested ones. In case you cloned the repo with the standard git command, simply execute - `meta git update` inside of the repo.
2. Execute `npm run all` or `npm run mkp`
- `npm run all` - will install all the dependencies, configure project with default options for the local setup, and start services and applications via `pm2` manager.
- `npm run mkp` - will do the same, but only for the contracts, cache and dapp.
3. Use `pm2` to see the list of running processes (`pm2 list`), logs(`pm2 logs <id|name>`), etc.
You should see the result similar to this one
![pm2-list](/assets/images/pm2-list.png)


`meta` tool provides a convenient interface to work with multiple repositories simultaneously. There are different plugins for bulk operations, including `git` and `npm`. Some examples are:
- `meta git status`, `meta git status --include-only dir1,dir2`
- `meta git update`
- `meta git -b checkout branch-name`
- `meta npm install`
- `meta exec "<any-command>"`

Please refer to the documentation for more details.


# Detailed Setup:
## 1. Developers Environment
Download and setup the RIF Marketplace Developer Environment
```
meta git clone git@github.com:rsksmart/rif-marketplace-dev.git

cd rif-marketplace-dev
```

### 1.1. Starting local blockchain
Now you can start local blockchain in terminal, pm2 or docker with
```
npm run ganache-cli or npm run ganache-cli:mining or npm run ganache-cli:pm2
```

Docker
```
docker-compose up
```

The Ganache blockchain will now run and it is available to deploy the corresponding Smart Contracts.


### 1.2. Deploying smart contracts

To deploy all the contracts and start a local blockchain in pm2, execute
```
npm run contracts:config
```

To only deploy the contracts:
```
npm run contracts:deploy
```

To re-deploy the contracts:
```
npm run contracts:redeploy
```

If you want to deploy to other chain than local, use an appropriate script: `npm run contracts:*`. For more detailed setup refer to the contracts folders.

The `contracts:create-config` will generate the files below and  copy the contract addresses to all other repositories.

- `ui-config.json` - the configuration file for the [RIF Marketplace UI](https://github.com/rsksmart/rif-marketplace-ui). This contains information for all the networks which are deployed. This should be put in the `rif-marketplace-ui/src/ui-config.json`.
- `cache-[network]-config.json` - Specific per network configuration file for the [RIF Marketplace Cache](https://github.com/rsksmart/rif-marketplace-cache) service. The configuration should be in `rif-marketplace-cache/config/local.json`.
- `rnsAdmin-[network]-config.json` - Per network conguration file for the [RNS Domains Manager](https://github.com/rnsdomains/rns-manager-react). The configuration should be in `rns-manager-react/src/config/contracts.local.json`.
- `rooms-[network].json` - Rooms attribute for the [RIF Communications Pubsub Bootnode](https://github.com/rsksmart/rif-communications-pubsub-bootnode) configuration file.

**Attention: the scripts automatically copy addresses to all repo folders. Don't push those files if you re-deployed locally with different addresses or if you deployed to a non-local chain as a non-release process.**

### 1.2. Browser wallet
In MetaMask or Nifty import the first address from `keys.txt` file. The private key is `0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d`

Connect to the local ganache network (Localhost 8545 in the network dropdown). You should now see a balance of 99 ETH (or close to that - some gas was already used to deploy the Contracts)

Now we will add RIF token. Click on `Add Token` -> `Custom Token` and input the token address that is in `./out/ui-config.json` under the `rif` attribute (should be `0x67B5656d60a809915323Bf2C40A8bEF15A152e3e` if this is your first deployment). You should now see your RIF tokens balance of 997 RIF.

You can similarly add more accounts to your wallet if needed.

### 1.4. IPFS Nodes

For this setup you will need at least two running instances of **IPFS**. These can be spawned and ran easily through the **RIF Storage Pinning** repository, which will provide two instances already configured and ready to be used by the **RIF Marketplace**.

> The nodes are automatically started via the main setup. If you want to run them in the terminal or with pm2 on your own, execute the commands `npm run pinner:ipfs:*` from the `package.json`. For the detailed setup, please refer to the pinner repository.


Download and setup the Pinning service
```
$ git clone git@github.com:rsksmart/rif-storage-pinner.git
$ cd rif-storage-pinner
$ npm ci
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

You can use NPM's scripts `npm run ipfs:consumer` and `npm run ipfs:provider` to interact with each IPFS node. These take the same arguments as the `ipfs` command.

You should now have two instances of **IPFS** running on ports `5002` and `5003`.


## 2. RIF Communications Pubsub Bootnode

**Temprarily disabled and not downloaded. libp2p communication has been potsponed. Skip this paragraph.**


Download and setup the RIF Communications Pubsub Bootnode
```
git clone git@github.com:rsksmart/rif-communications-pubsub-bootnode.git

cd rif-communications-pubsub-bootnode
```

Install the dependencies
```
npm ci
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

> Cache is automatically started via the main setup. If you want to run them in the terminal, execute `npm run cache` or with pm2 `npm run cache:start:pm2`. Other basic commands are available under `npm run cache:*`. For the detailed setup, please refer to the cache repository.


Download and setup the RIF Marketplace Cache

```
git clone git@github.com:rsksmart/rif-marketplace-cache.git

cd rif-marketplace-cache
```

Install the dependencies

```
npm ci
```

Create the DB using the following command:
```
npm run bin -- db-migration --up
```

Run Precache process for the RNS Service (for ganache network)
```
NODE_ENV=ganache npm run bin precache rns storage
```

Run the cache for the RNS Service with
```
NODE_ENV=ganache npm run bin -- start --enable rns storage --log=debug
```

## 4. RIF Marketplace Upload Service

> Upload Service is automatically started via the main setup. If you want to run them in the terminal, execute `npm run upload-service` or with pm2 `npm run upload-service:start:pm2`. Other basic commands are available under `npm run upload-service:*`. For the detailed setup, please refer to the repository.


Download and setup the RIF Marketplace Upload Service
```
git clone git@github.com:rsksmart/rif-marketplace-upload-service.git

cd rif-marketplace-upload-service
```

Install the dependencies
```
npm ci
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

> UI is automatically started via the main setup. If you want to run them in the terminal, execute `npm run dapp` or with pm2 `npm run dapp:start:pm2`. For the detailed setup, please refer to the repository.


Download and setup the RIF Marketplace UI
```
git clone git@github.com:rsksmart/rif-marketplace-ui.git

cd rif-marketplace-ui
```

Install the dependencies

```
npm ci
```

Run the UI (Will be available on http://localhost:3000/)
```
npm start
```


## 6. RNS Manager

> RNS Manager is automatically started via the main setup. If you want to run them in the terminal, execute `npm run rns-manager` or with pm2 `npm run rns-manager:start:pm2`. For the detailed setup, please refer to the repository.


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

> Pinner Service is automatically started via the main setup. If you want to run it in the terminal, execute `npm run pinner` or with pm2 `npm run pinner:start:pm2`. Other basic commands are available under `npm run pinner:*`. For the detailed setup, please refer to the repository.


Download and setup the Pinning service (already done when running **IPFS** nodes)
```
$ git clone git@github.com:rsksmart/rif-storage-pinner.git
$ cd rif-storage-pinner
$ npm ci
```

Make sure you have **IPFS** installed. We will use one of the previously deployed instances of **IPFS**.

To interact with pinning service use the `npm run bin` script. To start Pinning service run:

```
npm run bin -- init --offerId={your_account} --db=./db.sqlite
```

This will provide the `peerId` that should be used in the *RIF Marketplace UI*  to create the Storage offer. You can create the offer on `http://localhost:3000/storage/sell?peerId={your_peer_id}`.

Once the offer is created in the UI you can run the service using:

```
NODE_ENV=ganache npm run bin daemon -- --log=debug --db=./db.sqlite
```

You should see in logs when new Agreements are detected and pinned. 

## 8. RIF Notifier service

RIF Notifier is a service that listens to events on the blockchain and notifies its users of the blockchain events using one of the supported notification methods (API/SMS/EMAIL)

RIF Notifier is automatically started via the main setup. If you want to run it in the terminal, execute `npm run notifier` or with pm2 `npm run notifer:start:pm2`. Other basic commands are available under `npm run notifer:*`. For the detailed setup, please refer to the repository.

Download and setup the rif-notifier service

```
$ git clone git@github.com:rsksmart/rif-notifier.git
$ cd rif-notifier
```

1. To install java, maven and mysql for first time run the script, and input password values when prompted for mysql. If you have already installed mysql, skip to step 3.

```
$ bin/meta-install.sh
```

2. To secure the mysql installation for first time, run the script

```
$ bin/mysqlunattended.sh
```

3. For existing mysql installation, use the script to create notifier_user
```
$ bin/install.sh
```

4. Install notifier-prov-cli using steps in https://github.com/rsksmart/rif-notifier/tree/master/notifier-prov-cli

5. To configure rif-notifier with other required parameters, see the help for command below. (Ensure all the required parameters are set. For sample configuration see ```config/config-ganache.json```)

```
notifier-prov-cli configure --help
```
6. To start rif-notifier
``` 
notifier-prov-cli start 
```

In case of permission issues, run using `sudo`

For more information about usage of rif-notifier see https://github.com/rsksmart/rif-notifier

**See help pages for details on the parameters and additional commands!!!**

# Using the RIF Marketplace

## Registering domains using RNS
Go through the normal RNS registration flow but each time you make transaction you need to create new block as it requires at least 1 confirmation. You can do that with:

```sh
sh forward.sh
```

Alternatively, you can start a mining local blockchain with the command `npm run ganache-cli:mining`. It will mine a block every 15 seconds.

# Troubleshooting
### RNS manager missmatch between networks
Solution: switch back and forth a network on MetaMask/Nifty. If that does not work make sure you have setup correctly the network id in the RNS step.

If you encounter more issues, please refer to the [Troubleshooting Guide](https://hackmd.io/@rsk-infra-protocols/HJeABR-T_)