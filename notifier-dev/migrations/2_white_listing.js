const fs = require("fs");
const NotifierManager = artifacts.require("NotifierManager");
const Staking = artifacts.require("Staking");

const testnetDefaultTokens = ['0x0000000000000000000000000000000000000000', '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe']
const testnetDefaultProviders = ['0x2Bc6F7B98424Deb932ce6366999258bF22eE1a84', '0x7f20650657001d2F2ae4B9cC602Ec8bA959Fbc4B']
const mainnetDefaultTokens = ['0x0000000000000000000000000000000000000000', '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5']
const mainnetDefaultProviders = ['0x4c9619e5c707f3abaf6d5e1be60ba5edda9f486f', '0xca399379b549126aebc8a090849794a66c1d53f3']
const regtestDefaultTokens = ['0x0000000000000000000000000000000000000000', '0x1Af2844A588759D0DE58abD568ADD96BB8B3B6D8']
const regtestDefaultProviders = [
    '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1', // keys.tx[0]
    '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0', // keys.tx[1]
    '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b', // keys.tx[2]
    '0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d', // keys.tx[3]
    '0xa39Dc1b0A69bF8E8E01573e38b1F63178356105F', // artem
    '0xf3e42e9F4F4B59E0D2052DB57b90Af7af0fDDfBf', // ricardo
    '0x2dD60bfA3Bde0F9C2654B5c0166b568b2cF17312'  // ricardo
]

const whiteListedTokens = process.env['WHITE_LISTED_TOKENS'] ? process.env['WHITE_LISTED_TOKENS'].split(',') : []
const whiteListedProviders = process.env['WHITE_LISTED_PROVIDERS'] ? process.env['WHITE_LISTED_PROVIDERS'].split(',') : []

module.exports = async function (deployer, network, accounts) {
    const notifierContract = await NotifierManager.deployed();
    const stakingContract = await Staking.deployed();

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
            whiteListedProviders.push(...regtestDefaultProviders);
        }

        for (const token of whiteListedTokens) {
            console.log(`Notifier Manager - white listing token ${token}`);
            await notifierContract.setWhitelistedTokens(
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
            console.log("Notifier Manager - Whitelisting Provider: " + provider);
            await notifierContract.setWhitelistedProvider(
                provider,
                true
            );
        }
    } else {
        console.log("Notifier Manager - Enabling RBTC Payments");
        await notifierContract.setWhitelistedTokens(
            "0x0000000000000000000000000000000000000000",
            true
        );

        console.log("Notifier Manager - Enabling RIF Payments");
        await notifierContract.setWhitelistedTokens(
            "0x67B5656d60a809915323Bf2C40A8bEF15A152e3e",
            true
        );

        const providers = whiteListedProviders.length
            ? whiteListedProviders
            : [accounts[0], accounts[1], accounts[2], accounts[3]]
        for (const provider of providers) {
            console.log("Notifier Manager - Whitelisting Provider: " + provider);
            await notifierContract.setWhitelistedProvider(
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
        notifierManager: notifierContract.address,
        staking: stakingContract.address
    };

    const file = "./out/" + network + ".json";
    await fs.mkdirSync("out", { recursive: true });
    await fs.writeFileSync(file, JSON.stringify(configuration, null, 4));

    console.log("Configuration written to file: ", file);
    console.log(JSON.stringify(configuration, null, 4));

    const notifierAdminConf = "./out/notifier-" + network + ".json";

    const notifierConfig = {};
    notifierConfig.notifierManager = notifierContract.address;
    notifierConfig.staking = stakingContract.address;


    await fs.writeFileSync(notifierAdminConf, JSON.stringify(notifierConfig, null, 4));
};
