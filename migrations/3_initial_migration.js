/*
var Torneo = artifacts.require("./Torneo.sol");

module.exports = function(deployer) {
  deployer.deploy(Torneo, '100000 STEP CHALLENGE', 'Reach 100000 steps to win 250 tokens', 250, 1, 100000, "number of steps");
};

*/

var ChallengeManager = artifacts.require("./ChallengeManager.sol");

module.exports = function(deployer) {
  deployer.deploy(ChallengeManager, {from: '0x714a4D082D61b3623e712570CB46E4bDCc45c50B'});
};