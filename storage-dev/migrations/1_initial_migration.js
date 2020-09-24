const fs = require("fs");
const Migrations = artifacts.require("Migrations");
const StorageManager = artifacts.require("@rsksmart/rif-marketplace-storage/StorageManager");

module.exports = async function(deployer, network) {
  await deployer.deploy(Migrations);

  console.log("Deploying Storage Suite");

  console.log("Deploying Storage Manager Contract");
  const marketplaceContract = await deployer.deploy(
    StorageManager
  );
  
  console.log("Enabling RBTC Payments");
  await marketplaceContract.setWhitelistedTokens(
    "0x0000000000000000000000000000000000000000",
    true
  );
  
  const configuration = {
    storageManager: marketplaceContract.address
  };

  const file = "./out/" + network + ".json";
  await fs.mkdirSync("out", { recursive: true });
  await fs.writeFileSync(file, JSON.stringify(configuration, null, 4));

  console.log("Configuration written to file: ", file);
  console.log(JSON.stringify(configuration, null, 4));

  const storageAdminConf = "./out/storage-" + network + ".json";

  const storageConfig = {};
  storageConfig.storageManager = marketplaceContract.address;
  
  await fs.writeFileSync(storageAdminConf, JSON.stringify(storageConfig, null, 4));

};
