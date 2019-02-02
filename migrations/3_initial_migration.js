var ChallengeManager = artifacts.require("./ChallengeManager.sol");

module.exports = function(deployer) {
  deployer.deploy(ChallengeManager, {from: '0x7eAc4440f60b4Dd25c0Ea81Ba8EE2baAa2601E70'});
};