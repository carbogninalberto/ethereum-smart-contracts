var Migrations = artifacts.require("./Migrations.sol");
var WelCoin = artifacts.require("./WelCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(WelCoin, 'WELLCOIN', 'WEL', 20, 10**18, true, true);
};


