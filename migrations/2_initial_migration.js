var WelCoin = artifacts.require("./WelCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(WelCoin, 'WELLCOIN', 'WELL', 1000000, 1, 3, true, true);
};