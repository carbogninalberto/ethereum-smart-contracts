var WelCoin = artifacts.require("./WelCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(WelCoin, 'WELLCOIN', 'WELL', 1000000, 1, 3, true, true, {from: '0xb61e4014eAEc6BAC156C24E8b2bea4AAE814Ee70'});
};