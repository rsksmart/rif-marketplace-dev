const fs = require("fs");
const Migrations = artifacts.require("Migrations");
const erc1820 = require("erc1820");
const RNSSuite = require("@rsksmart/rns-suite");
const ProxyFactory = artifacts.require('ProxyFactory');
const ProxyAdmin = artifacts.require('ProxyAdmin');
const RNSSimplePlacementsV1 = artifacts.require('RNSSimplePlacementsV1');
const { encodeCall } = require('@openzeppelin/upgrades');
const assert = require('assert');

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(Migrations);

  console.log("Deploying ERC-1820");
  await erc1820.deploy(web3);

  console.log("Deploying RNS Suite");
  const rns = await RNSSuite(
    web3.currentProvider,
    ["alice", "bob", "charlie"],
    ["david", "eve", "frank"]
  );

  /****************** DEPLOY SIMPLE PLACEMENTS *************************/
  
  const proxyFactory = await deployer.deploy(ProxyFactory);
  const proxyAdmin = await deployer.deploy(ProxyAdmin);
  const simplePlacementsV1 = await deployer.deploy(RNSSimplePlacementsV1);

  const salt = '20';
  const data = encodeCall('initialize', ['address', 'address','address'], [ rns.rskOwner.options.address, accounts[0], rns.rns.options.address ]);
  await proxyFactory.deploy(salt, simplePlacementsV1.address, proxyAdmin.address, data);
 
  const deploymentAddress = await proxyFactory.getDeploymentAddress(salt, accounts[0]);
  const implementationAddress = await proxyAdmin.getProxyImplementation(deploymentAddress);
  
  // Get Marketplace contact through Proxy 
  const marketplaceContract= await RNSSimplePlacementsV1.at(deploymentAddress);

  assert.equal(implementationAddress, simplePlacementsV1.address);
     
  console.log('Proxy factory: ' + proxyFactory.address);
  console.log('Proxy admin: ' + proxyAdmin.address);
  console.log('NFTS Contract implementation: ' + simplePlacementsV1.address);
  console.log('----------------------------');
  console.log('Resulting proxy deployment address: ' + deploymentAddress);
  console.log('Resulting querying implementation address: ' + implementationAddress);
  
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
