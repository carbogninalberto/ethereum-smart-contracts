pragma solidity ^0.5.0;

// ----------------------------------------------------------------------------
//  Manage User Challenge
//  tied to WelCoin contract
//  Code Owned by: Alberto Carbognin
// ----------------------------------------------------------------------------

import "./WelCoin.sol";

contract ChallengeManager is Owned {
	using SafeMath for uint;
	address public contractAddress;	

	// NOT YET SUPPORTED
	// I asked the following question:
	// https://github.com/ethereum/solidity/issues/4115
	//
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
		address payable owner;
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

	// ----------------------------------------------------------------------------
	//  The following function allows user to create a new challenge
	//
	//	NOTE:
	//  This add the new challenge to public array
	//
	//  PARAM:
	//	@nameCreate: The name of the challenge
	//	@descriptionCreate: Description of the challenge
	//	@targetDescriptionCreate: Description of the challenge's goal
	//	@prizeCreate: The Prize amount in Tokens
	//	@targetCreate: The Goal in goal's units
	//	@feeCreate: The amount of Token for subscription to the Challenge
	//	@hash: Unique identifier for the whole challenge
	//	@nowUnix: timestamp as integer 
	// ----------------------------------------------------------------------------

	function createChallenge(
		string memory nameCreate,
		string memory descriptionCreate,
		string memory targetDescriptionCreate,
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
			new address[](0),
			new bool[](0),
			new uint[](0),
			address(0)
			));

		challengesLength++;
	    return true;
	}

	// ----------------------------------------------------------------------------
	//  This function is used to participate to a challenge
	//
	//	NOTE:
	//	- Loop through challenges Array to find the Challenge.
	//	- Transfer Fee tokens from sender to owner
	//	- Add Information of the participant
	//
	//  PARAM:
	//	@contractadd: Address of the Token Contract
	//	@hash: Unique identifier of the challenge
	// ----------------------------------------------------------------------------

	function participateToChallenge(address contractadd, string memory hash) public returns(bool success) {

		for (uint i = 0; i < challenges.length; i++) {
			
			if (challenges[i].challengeHash == keccak256(abi.encodePacked(hash))) {
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

	// ----------------------------------------------------------------------------
	//  This function is used to deposit a certain unit amount of the Goal
	//
	//	NOTE:
	//	- Loop through challenges Array to find the Challenge.
	//	- Loop through participantsAddress to find the participant
	//	- Update goal information and check if the sender is now the winner
	//
	//  PARAM:
	//	@goalUnit: The amount of unit to deposit
	//	@hash: Unique identifier of the challenge
	// ----------------------------------------------------------------------------

	function depositGoalUnit(uint goalUnit, string memory hash) public returns(bool success){

		for (uint i = 0; i < challenges.length; i++) {
			if (challenges[i].challengeHash == keccak256(abi.encodePacked(hash))) {
				for(uint j = 0; j < challenges[i].participantsAddress.length; j++) {

					if (msg.sender == challenges[i].participantsAddress[j]) {
						challenges[i].participantsGoal[j] = challenges[i].participantsGoal[j].add(goalUnit);

						if ((challenges[i].participantsGoal[j] >= challenges[i].target) && (challenges[i].winner == address(0))) {
							challenges[i].winner = msg.sender;
						}
						return true;
					}
				}    		
			}
		}
		return false;
	} 

	// ----------------------------------------------------------------------------
	//  This function is used to issue the prize to the winner
	//
	//	NOTE:
	//	- Loop through challenges Array to find the Challenge.
	//	- Transfer Money from owner to winner deleting Challenge from challenges array
	//
	//  PARAM:
	//	@contractadd: Address of the Token Contract
	//	@hash: Unique identifier of the challenge
	// ----------------------------------------------------------------------------	

	function issuePrize(address contractadd, string memory hash) public returns(bool success){
		
		for (uint i = 0; i < challenges.length; i++) {
			
			if ((msg.sender == challenges[i].owner) && (challenges[i].challengeHash == keccak256(abi.encodePacked(hash)) && (challenges[i].winner != address(0)))) {

				WelCoin(contractadd).virtualDepositTransferFrom(challenges[i].owner, challenges[i].winner, challenges[i].prize);

				if (challengesLength > 1) {
					delete challenges[i];
					challenges[i] = challenges[challenges.length-1];
	    			delete challenges[challenges.length-1];
	    			challenges.length = challenges.length-1;
	    			challengesLength = challenges.length;
	    			
				} else {
					delete challenges[0];
					challenges.length = challenges.length-1;
	    			challengesLength = challenges.length;
				}
				return true;
			}
		}
		return false;
	}  

	// ----------------------------------------------------------------------------
	//  This function returns the deposited goal of the sender
	//
	//	NOTE:
	//	- Loop through challenges Array to find the Challenge.
	//	- Loop through partecipantsAddress Array to find the sender.
	//	- return the deposited goal's unit
	//
	//  PARAM:
	//	@hash: Unique identifier of the challenge
	// ----------------------------------------------------------------------------	

	function getChallengePartecipantsGoal(string memory hash) public view returns(uint goal){

		uint challengeLength = challenges.length;

		for (uint i = 0; i < challengeLength; i++) {
			if (challenges[i].challengeHash == keccak256(abi.encodePacked(hash))) {

				for(uint j = 0; j < challenges[i].participantsAddress.length; j++) {
					if (msg.sender == challenges[i].participantsAddress[j]) {
						return challenges[i].participantsGoal[j];
					}
				} 		
			}
		}

		return 0;
	} 

	// ----------------------------------------------------------------------------
	//  This function set the address of the tied Token
	//
	//  PARAM:
	//	@contAdd: address of Token
	// ----------------------------------------------------------------------------	

	function setContractAddress(address contAdd) public returns(bool success){

		require (msg.sender == owner);
		contractAddress = contAdd;
		return true;
	}

	// these are getter

	function getChallengeParticipantsLength(uint challIndex) public view returns(uint length) {
		return challenges[challIndex].participantsAddress.length;
	}

	function getChallengeParticipants(uint index1, uint index2) public view returns(address participant){
		return challenges[index1].participantsAddress[index2];
	}

	function getChallengeParticipantsGoal(uint index1, uint index2) public view returns(uint participant){
		return challenges[index1].participantsGoal[index2];
	}

	function getChallengeWinner(uint index1) public view returns(address winner){
		return challenges[index1].winner;
	}

}