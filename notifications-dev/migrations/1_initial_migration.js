const fs = require("fs");
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const Migrations = artifacts.require("Migrations");
const NotificationsManager = artifacts.require("NotificationsManager");
const Staking = artifacts.require("Staking");

const whiteListedTokens = process.env['WHITE_LISTED_TOKENS'] ? process.env['WHITE_LISTED_TOKENS'].split(',') : []
const whiteListedProviders = process.env['WHITE_LISTED_PROVIDERS'] ? process.env['WHITE_LISTED_PROVIDERS'].split(',') : []

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(Migrations);

  console.log("Deploying Triggers Suite");

  console.log("Deploying Notifications Manager Contract");
  const notificationsContract = await deployProxy(NotificationsManager, [], { deployer });

  console.log("Deploying Staking Contract");
  const stakingContract = await deployer.deploy(
      Staking, notificationsContract.address
  );

  if (['mainnet', 'testnet', 'testnet-fork', 'mainnet-fork'].includes(network)) {
    for (const token of whiteListedTokens) {
      console.log(`Notifications Manager - white listing token ${token}`);
      await notificationsContract.setWhitelistedTokens(
          token,
          true
      );

      console.log(`Staking - white listing token ${token}`);
      await stakingContract.setWhitelistedTokens(
          token,
          true
      );
    }

    for (const provider of whiteListedProviders) {
      console.log("Notifications Manager - Whitelisting Provider: " + provider);
      await notificationsContract.setWhitelistedProvider(
          provider,
          true
      );
    }
  } else {
    console.log("Notifications Manager - Enabling RBTC Payments");
    await notificationsContract.setWhitelistedTokens(
        "0x0000000000000000000000000000000000000000",
        true
    );

    console.log("Notifications Manager - Enabling RIF Payments");
    await notificationsContract.setWhitelistedTokens(
        "0x67B5656d60a809915323Bf2C40A8bEF15A152e3e",
        true
    );

    console.log("Notifications Manager - Whitelisting Provider: " + accounts[0]);
    await notificationsContract.setWhitelistedProvider(
        accounts[0],
        true
    );

    console.log("Notifications Manager - Whitelisting Provider: " + accounts[1]);
    await notificationsContract.setWhitelistedProvider(
        accounts[1],
        true
    );

    console.log("Notifications Manager - Whitelisting Provider: " + accounts[2]);
    await notificationsContract.setWhitelistedProvider(
        accounts[2],
        true
    );

    console.log("Notifications Manager - Whitelisting Provider: " + accounts[3]);
    await notificationsContract.setWhitelistedProvider(
        accounts[3],
        true
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
  }

  const configuration = {
    notificationsManager: notificationsContract.address,
    staking: stakingContract.address
  };

  const file = "./out/" + network + ".json";
  await fs.mkdirSync("out", { recursive: true });
  await fs.writeFileSync(file, JSON.stringify(configuration, null, 4));

  console.log("Configuration written to file: ", file);
  console.log(JSON.stringify(configuration, null, 4));

  const notificationAdminConf = "./out/notifications-" + network + ".json";

  const notificationConfig = {};
  notificationConfig.notificationsManager = notificationsContract.address;
  notificationConfig.staking = stakingContract.address;


  await fs.writeFileSync(notificationAdminConf, JSON.stringify(notificationConfig, null, 4));

};
