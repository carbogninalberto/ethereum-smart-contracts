pragma solidity ^0.4.18;


// ----------------------------------------------------------------------------
//  Manage User Challenge
//  tied to WelCoin contract
//  Credit: Alberto Carbognin
// 	LICENSE: MIT
// ----------------------------------------------------------------------------

import "./WelCoin.sol";

contract ChallengeManager is Owned {
	using SafeMath for uint;
	address public contractAddress;

	struct Challenge {
		string name;
		string description;
		string targetDescription;
		uint256 timestamp;
		uint prize;
		uint target;
		uint fee;
		address owner;
		bytes32 challengeHash;
		address[] participants;
	}

	Challenge[] public challenges;
	uint public challengesLength;

	event Creation(address own);

	constructor() public {
		emit Creation(owner);
	}


	function createChallenge(
		string nameCreate,
		string descriptionCreate,
		string targetDescriptionCreate,
		uint prizeCreate,
		uint targetCreate,
		uint feeCreate,
		bytes32 hash,
		uint256 nowUnix
		) public returns(bool success) {

		require (feeCreate >= 0);
		require (prizeCreate >= 0);
		require (targetCreate >= 0);

		challenges.push(Challenge(
			nameCreate,
			descriptionCreate,
			targetDescriptionCreate,
			nowUnix,
			prizeCreate,
			targetCreate,
			feeCreate,
			msg.sender,
			hash,
			new address[](0)
			));

		challengesLength++;

        return true;
    }

    function participateToChallenge(address contracadd, string hash) public returns(bool success) {

    	uint challengeLength = challenges.length;
    	for (uint i = 0; i < challengeLength; i++) {
    		
    		if (challenges[i].challengeHash == keccak256(hash)) {
    			//WelCoin cont = WelCoin(contracadd);
    			WelCoin(contracadd).virtualDepositTransferFrom(msg.sender, challenges[i].owner, challenges[i].fee);
    			challenges[i].participants.push(msg.sender);

    			return true;
    		}
    	}

    	/*
    	uint arrleng = ledger[challOwn].length;
    	for (uint i=0; i<arrleng; i++) {

    		if ((ledger[challOwn][i].challengeHash == hash) && (partFee >= ledger[challOwn][i].fee)) {
    			WelCoin cont = WelCoin(contractAddress);
    			cont.transferFrom(msg.sender, challOwn, ledger[challOwn][i].fee);
    			ledger[challOwn][i].participants[msg.sender] = true;
    			return true;
    		}
    		i++;
    	}
    	*/

    	return false;
    }

    /*

    function getLedgerLength(address challOwn) public constant returns(uint length) {
    	return ledger[challOwn].length;
    }

    function getChallengeHash(address challOwn, uint id) public constant returns(uint256 hashcode) {
    	return ledger[challOwn][id].challengeHash;
    }
    function getChallengeName(uint id) public constant returns(string namecode) {
    	return ledger[msg.sender][id].name;
    }

    */

    function setContractAddress(address contAdd) public returns(bool success){

    	require (msg.sender == owner);
    	contractAddress = contAdd;
    	return true;
    }

    function getChallengeParticipantsLength(uint challIndex) public constant returns(uint length) {
    	return challenges[challIndex].participants.length;
    }

    function getChallengeParticipants(uint index1, uint index2) public returns(address participant){
    	return challenges[index1].participants[index2];
    }





}