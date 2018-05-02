var WelCoin = artifacts.require("./WelCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(WelCoin, 'WELLCOIN', 'WEL', 1000, 1, true, true);
};