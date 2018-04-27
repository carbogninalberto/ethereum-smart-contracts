var Migrations = artifacts.require("./Migrations.sol");
var WelCoin = artifacts.require("./WelCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(WelCoin, 'WELLCOIN', 'WEL', 20, 1, true, true);
};


