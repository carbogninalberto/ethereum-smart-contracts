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

	struct Challenge {
		string name;
		string description;
		string targetDescription;
		uint256 timestamp;
		uint prize;
		uint target;
		uint fee;
		address owner;
		uint256 challengeHash;
		mapping (address => bool) participants;
	}

	mapping (address => Challenge[]) public ledger;
	mapping (address => uint) public numberOfChallenge;

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
		uint feeCreate
		) public returns(bool success) {

		require (feeCreate >= 0);
		require (prizeCreate >= 0);
		require (targetCreate >= 0);

		Challenge memory newChall = Challenge(
			nameCreate,
			descriptionCreate,
			targetDescriptionCreate,
			now,
			prizeCreate,
			targetCreate,
			feeCreate,
			owner,
			0);

		ledger[msg.sender].push(newChall);

		ledger[msg.sender][ledger[msg.sender].length-1].challengeHash = uint256(keccak256(nameCreate, descriptionCreate, targetDescriptionCreate, now, prizeCreate, targetCreate, feeCreate));
		numberOfChallenge[msg.sender] += 1;

        return true;
    }

    function participateToChallenge(address challOwn, uint256 hash, uint partFee) public returns(bool success) {
    	
    	uint arrleng = ledger[challOwn].length;
    	for (uint i=0; i<arrleng; i++) {

    		if ((ledger[challOwn][i].challengeHash == hash) && (partFee >= ledger[challOwn][i].fee)) {
    			WelCoin cont = WelCoin(challOwn);
    			cont.transferFrom(msg.sender, challOwn, ledger[challOwn][i].fee);
    			ledger[challOwn][i].participants[msg.sender] = true;
    			return true;
    		}
    		i++;
    	}

    	return false;
    }

    function getLedgerLength(address challOwn) public constant returns(uint length) {
    	return ledger[challOwn].length;
    }

    function getChallengeHash(address challOwn, uint id) public constant returns(uint256 hashcode) {
    	return ledger[challOwn][id].challengeHash;
    }
    function getChallengeName(uint id) public constant returns(string namecode) {
    	return ledger[msg.sender][id].name;
    }





}