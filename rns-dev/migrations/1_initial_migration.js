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
    rnsDotRskOwner: rns.rskOwner.options.address,
    rnsNameResolver: rns.nameResolver.options.address,
    marketplace: marketplaceContract.address
  };

  const file = "./out/" + network + ".json";
  await fs.mkdirSync("out", { recursive: true });
  await fs.writeFileSync(file, JSON.stringify(configuration, null, 4));

  console.log("Configuration written to file: ", file);
  console.log(JSON.stringify(configuration, null, 4));

  const rnsAdminConf = "./out/rnsAdmin-" + network + ".json";

  const rnsConfig = {};
  rnsConfig.rns = rns.rns.options.address;
  rnsConfig.registrar = rns.auctionRegistrar.options.address;
  rnsConfig.reverseRegistrar = rns.reverseRegistrar.options.address;
  rnsConfig.publicResolver = rns.publicResolver.options.address;
  rnsConfig.nameResolver = rns.nameResolver.options.address;
  rnsConfig.multiChainResolver = rns.multiChainResolver.options.address;
  rnsConfig.rif = rns.rif.options.address;
  rnsConfig.fifsRegistrar = rns.fifsRegistrar.options.address;
  rnsConfig.fifsAddrRegistrar = rns.fifsAddrRegistrar.options.address;
  rnsConfig.rskOwner = rns.rskOwner.options.address;
  rnsConfig.renewer = rns.renewer.options.address;
  rnsConfig.stringResolver = "0x0000000000000000000000000000000000000000";

  await fs.writeFileSync(rnsAdminConf, JSON.stringify(rnsConfig, null, 4));
};
