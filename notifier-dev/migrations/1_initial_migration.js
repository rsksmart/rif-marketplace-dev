const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const Migrations = artifacts.require("Migrations");
const NotifierManager = artifacts.require("NotifierManager");
const Staking = artifacts.require("Staking");

module.exports = async function (deployer) {
  await deployer.deploy(Migrations);

  console.log("Deploying Triggers Suite");

  console.log("Deploying Notifier Manager Contract");
  const notifierContract = await deployProxy(NotifierManager, [], { deployer });

  console.log("Deploying Staking Contract");
  await deployer.deploy(
    Staking, notifierContract.address
  );
};
