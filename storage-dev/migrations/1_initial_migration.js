const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const Migrations = artifacts.require("Migrations");
const StorageManager = artifacts.require("StorageManager");
const Staking = artifacts.require("Staking");

module.exports = async function(deployer) {
  await deployer.deploy(Migrations);

  console.log("Deploying Storage Suite");

  console.log("Deploying Storage Manager Contract");
  const marketplaceContract = await deployProxy(StorageManager, [], { deployer, unsafeAllowCustomTypes: true });

  console.log("Deploying Staking Contract");
  await deployer.deploy(
      Staking, marketplaceContract.address
  );
};
