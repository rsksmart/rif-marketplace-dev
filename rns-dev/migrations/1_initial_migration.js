const fs = require("fs");

const Migrations = artifacts.require("Migrations");
const erc1820 = require("erc1820");
const RNSSuite = require("@rsksmart/rns-suite");
const ERC721SimplePlacements = artifacts.require("ERC721SimplePlacements");

module.exports = async function(deployer, network) {
  await deployer.deploy(Migrations);

  console.log("Deploying ERC-1820");
  await erc1820.deploy(web3);

  console.log("Deploying RNS Suite");
  const rns = await RNSSuite(
    web3.currentProvider,
    ["alice", "bob", "charlie"],
    ["david", "eve", "frank"]
  );

  console.log("Deploying Simple Placements marketplace");
  const marketplaceContract = await deployer.deploy(
    ERC721SimplePlacements,
    rns.rskOwner.options.address
  );

  console.log("Enabling RIF Payments");
  await marketplaceContract.setWhitelistedPaymentToken(
    rns.rif.options.address,
    true,
    true,
    false
  );

  const configuration = {
    rif: rns.rif.options.address,
    rns: rns.rskOwner.options.address,
    marketplace: marketplaceContract.address
  };

  await fs.mkdirSync("out", { recursive: true });
  await fs.writeFileSync(
    "./out/" + network + ".conf",
    JSON.stringify(configuration, null, 4)
  );
  console.log("Configuration written to file: ", "./out/" + network + ".json");
  console.log(JSON.stringify(configuration, null, 4));
};
