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
const networks = ["ganache", "regtest"];
const rnsConfig = {};
const storageConfig = {};
var rnsAdminFilePath;

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

 }

  // Storage Config File
  if (args.includes('storage')) {
     const storageConfigPath = "./storage-dev/out/";
     const file = storageConfigPath + network + ".json";
     if (fs.existsSync(file))
       storageConfig[network] = JSON.parse(fs.readFileSync(file));
   }

    // Create UI config
    const uiConfig = require("./templates/uiConfig.json");
    const uiOutfile = "./out/ui-config.json";
    // RNS
    if (rnsConfig[network]) {
      uiConfig[network].contractAddresses.rif = rnsConfig[network].rif;
      uiConfig[network].contractAddresses.rnsDotRskOwner = rnsConfig[network].rnsDotRskOwner;
      uiConfig[network].contractAddresses.marketplace = rnsConfig[network].marketplace;
      uiConfig[network].services.push("rns");
    }
    // Storage
    if (storageConfig[network]) {
      uiConfig[network].contractAddresses.storageManager = storageConfig[network].storageManager;
      uiConfig[network].contractAddresses.storageStaking = storageConfig[network].staking;
      uiConfig[network].services.push("storage");
    }
    fs.writeFileSync(uiOutfile, JSON.stringify(uiConfig, null, 4));


    // Create the cache config
     const cacheConfig = require("./templates/cacheConfig.json");
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
       const storagePinningConfig = require("./templates/storagePinning.json");
       const storagePinningOutFile = "./out/storagePinning-" + network + "-config.json";
       storagePinningConfig.blockchain.provider = providers[network];
       storagePinningConfig.blockchain.contractAddress = storageConfig[network].storageManager;
       fs.writeFileSync(storagePinningOutFile, JSON.stringify(storagePinningConfig, null, 4));
     }
     fs.writeFileSync(cacheOutFile, JSON.stringify(cacheConfig, null, 4));
});
