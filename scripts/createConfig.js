const JSON5 = require('json5');
var args = process.argv.slice(2);

// Check at least one service specified
if (!args.length) {
  console.log("Please specify the services to deploy. Services available: \"rns\" \"storage\".");
  process.exit();
}

const fs = require("fs");
const providers = {
  ganache: "ws://127.0.0.1:8545/",
  regtest: "ws://127.0.0.1:4445/websocket/"
};
const networks = ["ganache", "rskdevnet", "rsktestnet", "rskmainnet"];
const networkIds = {
  ganache: "8545",
  regtest: "4445"
};
const rnsConfig = {};
const storageConfig = {};
const notifierConfig = {};
var rnsAdminFilePath;
var storageContractAddress;

fs.mkdirSync("out", { recursive: true });

// Process each network
networks.forEach(network => {

  // RNS Config File
  if (args.includes('rns')) {

    const rnsConfigPath = "./rns-dev/out/";
    const file = rnsConfigPath + network + ".json";
    if (fs.existsSync(file))
      rnsConfig[network] = JSON.parse(fs.readFileSync(file));

    // Create RNS Admin config
    rnsAdminFilePath = rnsConfigPath + "rnsAdmin-" + network + ".json";
    if (!rnsConfig[network] || !fs.existsSync(rnsAdminFilePath)) return;
    const outFile = "./out/rnsAdmin-" + network + "-config.json";
    fs.copyFileSync(rnsAdminFilePath, outFile);

    if (network === 'ganache') {
      fs.copyFileSync(rnsAdminFilePath, './rns-manager/src/config/contracts.local.json');
    } else if (network === 'rsktestnet') {
      fs.copyFileSync(rnsAdminFilePath, './rns-manager/src/config/contracts.testnet.json');
    } else if (network === 'rskmainnet') {
      fs.copyFileSync(rnsAdminFilePath, './rns-manager/src/config/contracts.json');
    }
    // TODO: add rskdevnet when needed
  }

  // Storage Config File
  if (args.includes('storage')) {
    const storageConfigPath = "./storage-dev/out/";
    const file = storageConfigPath + network + ".json";
    if (fs.existsSync(file))
      storageConfig[network] = JSON.parse(fs.readFileSync(file));
  }

  // Triggers config
  if (args.includes('notifier')) {
    const notifierConfigPath = "./notifier-dev/out/";
    const file = notifierConfigPath + network + ".json";
    if (fs.existsSync(file))
      notifierConfig[network] = JSON.parse(fs.readFileSync(file));
  }

// RIF Notifier config
  if (args.includes('rif-notifier')) {
    const notifierConfigPath = "./notifier/config/config-";
    const file = notifierConfigPath + network + ".json";
    if (fs.existsSync(file))
      configTemplateJson = JSON.parse(fs.readFileSync(file));
      configTemplateJson.notificationmanagercontract = notifierConfig[network].notifierManager
      fs.writeFileSync('./out/rif-notifier-config.json', JSON.stringify(configTemplateJson, null, 4));
  }


  /**
   UI CONFIG
   */
  // Create UI config
  const uiRepoFile = "./dapp/src/ui-config.json";
  const uiConfig = JSON.parse(fs.readFileSync(uiRepoFile));
  const uiOutfile = "./out/ui-config.json";
  const serviceProps = { tokens: ["rbtc", "rif"] };
  // RNS
  if (rnsConfig[network]) {
    uiConfig[network].contractAddresses.rif = rnsConfig[network].rif;
    uiConfig[network].contractAddresses.rnsDotRskOwner = rnsConfig[network].rnsDotRskOwner;
    uiConfig[network].contractAddresses.marketplace = rnsConfig[network].marketplace;
    uiConfig[network].services.rns = serviceProps;
  }
  // Storage
  if (storageConfig[network]) {
    uiConfig[network].contractAddresses.storageManager = storageConfig[network].storageManager;
    uiConfig[network].contractAddresses.storageStaking = storageConfig[network].staking;
    uiConfig[network].services.storage = serviceProps;
  }
  // Notifier
  if (notifierConfig[network]) {
    uiConfig[network].contractAddresses.notifierManager = notifierConfig[network].notifierManager;
    uiConfig[network].contractAddresses.notifierStaking = notifierConfig[network].staking;
    uiConfig[network].services.notifier = serviceProps;
  }
  fs.writeFileSync(uiOutfile, JSON.stringify(uiConfig, null, 4));
  fs.writeFileSync(uiRepoFile, JSON.stringify(uiConfig, null, 4));

  /**
    CACHE CONFIG
  */
  // Create the cache config
  const cacheRepoFile = `./cache/config/${network}.json5`;
  const cacheConfig = JSON5.parse(fs.readFileSync(cacheRepoFile));
  const cacheOutFile = "./out/cache-" + network + "-config.json";
  cacheConfig.blockchain.provider = providers[network];

  // RNS
  if (rnsConfig[network]) {
    const rnsManagerConfig = JSON.parse(fs.readFileSync(rnsAdminFilePath));
    cacheConfig.rns.enabled = true;
    cacheConfig.rns.registrar.contractAddress = rnsManagerConfig.registrar;
    cacheConfig.rns.fifsAddrRegistrar.contractAddress = rnsManagerConfig.fifsAddrRegistrar;
    cacheConfig.rns.owner.contractAddress = rnsManagerConfig.rskOwner;
    cacheConfig.rns.reverse.contractAddress = rnsManagerConfig.nameResolver;
    cacheConfig.rns.placement.contractAddress = rnsConfig[network].marketplace;
  }
  // Storage
  if (storageConfig[network]) {
    cacheConfig.storage.enabled = true;
    cacheConfig.storage.storageManager.contractAddress = storageConfig[network].storageManager;
    cacheConfig.storage.staking.contractAddress = storageConfig[network].staking;

    // Pinning Service
    const pinnerNetworkName = network.startsWith('rsk') ? network.substr('rsk'.length) : network;
    console.log(pinnerNetworkName);
    const storagePinningRepoFile = `./pinner/config/${pinnerNetworkName}.json5`;
    const storagePinningConfig = JSON5.parse(fs.readFileSync(storagePinningRepoFile));
    const storagePinningOutFile = "./out/storagePinning-" + network + "-config.json";
    storagePinningConfig.blockchain.provider = providers[network];
    storagePinningConfig.blockchain.contractAddress = storageConfig[network].storageManager;
    fs.writeFileSync(storagePinningOutFile, JSON.stringify(storagePinningConfig, null, 4));
    fs.writeFileSync(storagePinningRepoFile, JSON5.stringify(storagePinningConfig, null, 4));

    // Rooms config for Pubsub Node
    // DISABLED FOR NOW:
    // const roomsConfig = require("./templates/roomsConfig.json");
    // const roomsOutFile = "./out/rooms-" + network + ".json";
    // storageContractAddress = storageConfig[network].storageManager.toLowerCase();
    // roomsConfig.rooms = [
    //   networkIds[network] + ":" + storageContractAddress + ":" + "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1".toLowerCase(),
    //   networkIds[network] + ":" + storageContractAddress + ":" + "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0".toLowerCase(),
    //   networkIds[network] + ":" + storageContractAddress + ":" + "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b".toLowerCase(),
    //   networkIds[network] + ":" + storageContractAddress + ":" + "0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d".toLowerCase()
    // ];
    // fs.writeFileSync(roomsOutFile, JSON.stringify(roomsConfig, null, 4));
  }
  
  if (notifierConfig[network]) {
    cacheConfig.notifier.enabled = true;
    cacheConfig.notifier.notifierManager.contractAddress = notifierConfig[network].notifierManager;
    cacheConfig.notifier.staking.contractAddress = notifierConfig[network].staking;
  }

  fs.writeFileSync(cacheOutFile, JSON.stringify(cacheConfig, null, 4));
  fs.writeFileSync(cacheRepoFile, JSON5.stringify(cacheConfig, null, 4));
});
