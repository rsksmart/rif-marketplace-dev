const fs = require("fs");

const rnsConfigPath = "./rns-dev/out/";
const providers = {
  ganache: "ws://127.0.0.1:8545/",
  regtest: "ws://127.0.0.1:4445/websocket/"
};
const networks = ["ganache", "regtest"];

const rnsConfig = {};
networks.forEach(network => {
  const file = rnsConfigPath + network + ".json";
  if (fs.existsSync(file))
    rnsConfig[network] = JSON.parse(fs.readFileSync(file));
});

// Create UI config
const file = "./out/ui-config.json";
fs.mkdirSync("out", { recursive: true });
fs.writeFileSync(file, JSON.stringify(rnsConfig, null, 4));

// Create RNS Admin config
networks.forEach(network => {
  const configFilePath = rnsConfigPath + "rnsAdmin-" + network + ".json";
  if (!rnsConfig[network] || !fs.existsSync(configFilePath)) return;

  const outFile = "./out/rnsAdmin-" + network + "-config.json";
  fs.copyFileSync(configFilePath, outFile);

  // Create the cache config
  const rnsManagerConfig = JSON.parse(fs.readFileSync(configFilePath));

  const cacheConfig = require("./templates/cacheConfig.json");
  const cacheOutFile = "./out/cache-" + network + "-config.json";

  cacheConfig.blockchain.provider = providers[network];
  cacheConfig.rns.registrar.contractAddress = rnsManagerConfig.registrar;
  cacheConfig.rns.fifsAddrRegistrar.contractAddress = rnsManagerConfig.fifsAddrRegistrar;
  cacheConfig.rns.owner.contractAddress = rnsManagerConfig.rskOwner;
  cacheConfig.rns.reverse.contractAddress = rnsManagerConfig.nameResolver;
  cacheConfig.rns.placement.contractAddress = rnsConfig[network].marketplace;
  fs.writeFileSync(cacheOutFile, JSON.stringify(cacheConfig, null, 4));
});
