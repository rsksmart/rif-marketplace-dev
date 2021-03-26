const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const Migrations = artifacts.require("Migrations");
const NotificationsManager = artifacts.require("NotificationsManager");
const Staking = artifacts.require("Staking");

module.exports = async function(deployer) {
  await deployer.deploy(Migrations);

  console.log("Deploying Triggers Suite");

  console.log("Deploying Notifications Manager Contract");
  const notificationsContract = await deployProxy(NotificationsManager, [], { deployer });

  console.log("Deploying Staking Contract");
  await deployer.deploy(
      Staking, notificationsContract.address
  );
};
