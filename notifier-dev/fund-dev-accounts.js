// Addresses to fund
const receivers = [
  '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1', // keys.tx[0]
  '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0', // keys.tx[1]
  '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b', // keys.tx[2]
  '0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d', // keys.tx[3]
  '0xa39Dc1b0A69bF8E8E01573e38b1F63178356105F', // artem
  '0xf3e42e9F4F4B59E0D2052DB57b90Af7af0fDDfBf', // ricardo
  '0x2dD60bfA3Bde0F9C2654B5c0166b568b2cF17312'  // ricardo
];
const amount = web3.utils.toWei("100", 'ether');

module.exports = async function (callback) {

  const addresses = await web3.eth.getAccounts();

  receivers.forEach(receiver => {
    web3.eth.sendTransaction({
      from: addresses[1],
      to: receiver,
      value: amount
    }, callback);
  });

}