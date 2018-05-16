var ChallengeManager = artifacts.require("./ChallengeManager.sol");

module.exports = function(deployer) {
  deployer.deploy(ChallengeManager, {from: '0x714a4D082D61b3623e712570CB46E4bDCc45c50B'});
};