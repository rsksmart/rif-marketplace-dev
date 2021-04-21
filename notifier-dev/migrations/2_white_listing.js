const fs = require("fs");
const NotifierManager = artifacts.require("NotifierManager");
const Staking = artifacts.require("Staking");

const testnetDefaultTokens = ['0x0000000000000000000000000000000000000000', '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe']
const mainnetDefaultTokens = ['0x0000000000000000000000000000000000000000', '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5']
const whiteListedTokens = process.env['WHITE_LISTED_TOKENS'] ? process.env['WHITE_LISTED_TOKENS'].split(',') : []
const whiteListedProviders = process.env['WHITE_LISTED_PROVIDERS'] ? process.env['WHITE_LISTED_PROVIDERS'].split(',') : []

module.exports = async function (deployer, network, accounts) {
    const notifierContract = await NotifierManager.deployed();
    const stakingContract = await Staking.deployed();

    const isTestnet = ['testnet', 'testnet-fork'].includes(network);
    const isMainnet = ['mainnet', 'mainnet-fork'].includes(network);
    if (isTestnet || isMainnet) {
        if (isTestnet) {
            whiteListedTokens.push(...testnetDefaultTokens);
        } else if (isMainnet) {
            whiteListedTokens.push(...mainnetDefaultTokens);
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
            : whiteListedProviders || [accounts[0], accounts[1], accounts[2], accounts[3]]
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
