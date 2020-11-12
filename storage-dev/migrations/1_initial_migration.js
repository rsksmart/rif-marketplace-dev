const fs = require("fs");
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const Migrations = artifacts.require("Migrations");
const StorageManager = artifacts.require("StorageManager");
const Staking = artifacts.require("Staking");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(Migrations);

  console.log("Deploying Storage Suite");

  console.log("Deploying Storage Manager Contract");
  const marketplaceContract = await deployProxy(StorageManager, [], { deployer, unsafeAllowCustomTypes: true });
  
  console.log("Storage Manager - Enabling RBTC Payments");
  await marketplaceContract.setWhitelistedTokens(
    "0x0000000000000000000000000000000000000000",
    true
  );

  console.log("Storage Manager - Enabling RIF Payments");
  await marketplaceContract.setWhitelistedTokens(
    "0x67B5656d60a809915323Bf2C40A8bEF15A152e3e",
    true
  );

  console.log("Storage Manager - Whitelisting Provider: " + accounts[0]);
  await marketplaceContract.setWhitelistedProvider(
    accounts[0],
    true
  );

  console.log("Storage Manager - Whitelisting Provider: " + accounts[1]);
  await marketplaceContract.setWhitelistedProvider(
    accounts[1],
    true
  );

  console.log("Storage Manager - Whitelisting Provider: " + accounts[2]);
  await marketplaceContract.setWhitelistedProvider(
    accounts[2],
    true
  );

  console.log("Storage Manager - Whitelisting Provider: " + accounts[3]);
  await marketplaceContract.setWhitelistedProvider(
    accounts[3],
    true
  );

  console.log("Deploying Staking Contract");
  const stakingContract = await deployer.deploy(
    Staking, marketplaceContract.address
  );
  
  console.log("Staking - Enabling RBTC Payments");
  await stakingContract.setWhitelistedTokens(
    "0x0000000000000000000000000000000000000000",
    true
  );

  console.log("Staking - Enabling RIF Payments");
  await stakingContract.setWhitelistedTokens(
    "0x67B5656d60a809915323Bf2C40A8bEF15A152e3e",
    true
  );

  const configuration = {
    storageManager: marketplaceContract.address,
    staking: stakingContract.address
  };

  const file = "./out/" + network + ".json";
  await fs.mkdirSync("out", { recursive: true });
  await fs.writeFileSync(file, JSON.stringify(configuration, null, 4));

  console.log("Configuration written to file: ", file);
  console.log(JSON.stringify(configuration, null, 4));

  const storageAdminConf = "./out/storage-" + network + ".json";

  const storageConfig = {};
  storageConfig.storageManager = marketplaceContract.address;
  storageConfig.staking = stakingContract.address;
  
  
  await fs.writeFileSync(storageAdminConf, JSON.stringify(storageConfig, null, 4));

};
