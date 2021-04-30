const fs = require("fs");
const StorageManager = artifacts.require("StorageManager");
const Staking = artifacts.require("Staking");

const testnetDefaultTokens = ['0x0000000000000000000000000000000000000000', '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe']
const testnetDefaultProviders = ['0x2Bc6F7B98424Deb932ce6366999258bF22eE1a84', '0x7f20650657001d2F2ae4B9cC602Ec8bA959Fbc4B']
const mainnetDefaultTokens = ['0x0000000000000000000000000000000000000000', '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5']
const mainnetDefaultProviders = ['0x4c9619e5c707f3abaf6d5e1be60ba5edda9f486f', '0xca399379b549126aebc8a090849794a66c1d53f3']
const regtestDefaultTokens = ['0x0000000000000000000000000000000000000000']

const whiteListedTokens = process.env['WHITE_LISTED_TOKENS'] ? process.env['WHITE_LISTED_TOKENS'].split(',') : []
const whiteListedProviders = process.env['WHITE_LISTED_PROVIDERS'] ? process.env['WHITE_LISTED_PROVIDERS'].split(',') : []

module.exports = async function(deployer, network, accounts) {
    const marketplaceContract = await StorageManager.deployed();
    const stakingContract = await Staking.deployed()

    const isTestnet = ['testnet', 'testnet-fork'].includes(network);
    const isMainnet = ['mainnet', 'mainnet-fork'].includes(network);
    const isRegtest = ['regtest', 'regtest-fork'].includes(network);
    if (isTestnet || isMainnet || isRegtest) {
        if (isTestnet) {
            whiteListedTokens.push(...testnetDefaultTokens);
            whiteListedProviders.push(...testnetDefaultProviders);
        } else if (isMainnet) {
            whiteListedTokens.push(...mainnetDefaultTokens);
            whiteListedProviders.push(...mainnetDefaultProviders);
        } else if (isRegtest) {
            whiteListedTokens.push(...regtestDefaultTokens);
        }

        for (const token of whiteListedTokens) {
            console.log(`Storage Manager - white listing token ${token}`);
            await marketplaceContract.setWhitelistedTokens(
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
            console.log("Storage Manager - Whitelisting Provider: " + provider);
            await marketplaceContract.setWhitelistedProvider(
                provider,
                true
            );
        }
    } else {
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

        const providers = whiteListedProviders.length
            ? whiteListedProviders
            : [accounts[0], accounts[1], accounts[2], accounts[3]]
        for (const provider of providers) {
            console.log("Storage Manager - Whitelisting Provider: " + provider);
            await marketplaceContract.setWhitelistedProvider(
                provider,
                true
            );
        }

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
