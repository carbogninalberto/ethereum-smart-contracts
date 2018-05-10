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
	

	// NOT YET SUPPORTED
	// Can't initialized Array of Struct inside a Struct.
	// I pivot to a less elegant working solution because of this problem.
	// ------------------------------------------------------------------------
	// My temporary solution is:
	// address[] participantsAddress
	// bool[] participantsStatus
	// uint[] participantsGoal
	// ------------------------------------------------------------------------
	
	struct Participant {
		address participantAddress;
		bool participate;
		uint goal;
	}
	

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

		// these arrays rappresent the same object
		address[] participantsAddress;
		bool[] participantsStatus;
		uint[] participantsGoal;

		//other
		address winner;
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

		// ------------------------------------------------------------------------
		// Don't mind about this
		// ------------------------------------------------------------------------
		// Participant[] storage part;
		// part.push(Participant(msg.sender, false, 0)); //the element 0 is the owner which is not participating
		// ------------------------------------------------------------------------

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
			new address[](0),
			new bool[](0),
			new uint[](0),
			address(0)
			));

		challengesLength++;

        return true;
    }

    function participateToChallenge(address contractadd, string hash) public returns(bool success) {

    	uint challengeLength = challenges.length;
    	for (uint i = 0; i < challengeLength; i++) {
    		
    		if (challenges[i].challengeHash == keccak256(hash)) {
    			//WelCoin cont = WelCoin(contracadd);
    			WelCoin(contractadd).virtualDepositTransferFrom(msg.sender, challenges[i].owner, challenges[i].fee);
    			challenges[i].participantsAddress.push(msg.sender);
    			challenges[i].participantsStatus.push(true);
    			challenges[i].participantsGoal.push(0);

    			return true;
    		}
    	}

    	return false;
    }

	function depositGoalUnit(uint goalUnit, string hash) public returns(bool success){

		uint challengeLength = challenges.length;
    	for (uint i = 0; i < challengeLength; i++) {
    		
    		if (challenges[i].challengeHash == keccak256(hash)) {

    			for(uint j = 0; j < challenges[i].participantsAddress.length; j++) {
    				if (msg.sender == challenges[i].participantsAddress[j]) {
    					challenges[i].participantsGoal[j] += goalUnit;
    					if (challenges[i].participantsGoal[j] >= challenges[i].target) {
    						challenges[i].winner = msg.sender;
    					}
    					return true;
    				}
    			}    		
    		}
    	}

		return false;
	} 


	function issuePrize(address contractadd, string hash) public returns(bool success){

		uint challengeLength = challenges.length;
    	for (uint i = 0; i < challengeLength; i++) {
    		
    		if ((challenges[i].challengeHash == keccak256(hash)) && (msg.sender == challenges[i].owner)) {

    			WelCoin(contractadd).virtualDepositTransferFrom(challenges[i].owner, challenges[i].winner, challenges[i].prize);
    			challenges[i].participantsAddress.push(msg.sender);
    			challenges[i].participantsStatus.push(true);
    			challenges[i].participantsGoal.push(0);

    		}
    	}

		return true;
	}   

    function setContractAddress(address contAdd) public returns(bool success){

    	require (msg.sender == owner);
    	contractAddress = contAdd;
    	return true;
    }

    function getChallengeParticipantsLength(uint challIndex) public constant returns(uint length) {
    	return challenges[challIndex].participantsAddress.length;
    }

    function getChallengeParticipants(uint index1, uint index2) public returns(address participant){
    	return challenges[index1].participantsAddress[index2];
    }

    function getChallengeParticipantsGoal(uint index1, uint index2) public returns(uint participant){
    	return challenges[index1].participantsGoal[index2];
    }





}