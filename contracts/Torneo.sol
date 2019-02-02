pragma solidity ^0.5.0;

// ----------------------------------------------------------------------------
//  Torneo manager
//  tied to WelCoin contract
//  Credit: Alberto Carbognin
// 	LICENSE: MIT
// ----------------------------------------------------------------------------

import "./WelCoin.sol";


contract Torneo {
    using SafeMath for uint;
	string name;
	string description;
	uint prize;
	uint fee;
	uint target;
    uint decimals;
	string targetDescription;
	Torneo contract_address;
    address payable owner;
    address winner;
    bool isActive;

	//Building Dictionary of partecipants
  	mapping(address => bool) partecipants;

    mapping(address => uint) targetTrack;

	//Constructor
	constructor(
		string memory initialName,
		string memory initialDescription,
		uint initialPrize,
		uint initialFee,
		uint initialTarget,
		string memory initialTargetDescription,
        address payable initialOwner,
        uint initialDecimals
	) public {
		name = initialName;
		description = initialDescription;
		prize = initialPrize;
		fee = initialFee;
		target = initialTarget;
        targetDescription = initialTargetDescription;
        owner = initialOwner;
        isActive = true;
        decimals = initialDecimals;
		contract_address = this; //this cointains contract's address information
	}

    function isPartecipant(address partecipant) public view returns(bool state) {
        if (partecipants[partecipant]) {
            return true;
        } else {
            return false;
        }
    }

    function getFee() public view returns(uint cost) {
        return fee;
    }

    function isActiveStatus() public view returns(bool active) {
        return isActive;
    }


    function getOwner() public view returns(address theOwner) {
        return owner;
    }

    function getWinner() public view returns(address theWinner) {
        require (isActive == false);
        
        return winner;
    }

    function partecipate(uint tokens) public returns(bool success) {
        require(tokens == fee);
        partecipants[msg.sender] = true;

        return true;
    }

    function updateTarget(uint data) public returns(bool success) {
        targetTrack[msg.sender] = targetTrack[msg.sender].add(data);
        if (targetTrack[msg.sender] >= target) {
            isActive = false;
            winner = msg.sender;
        }

        return true;
    }

    function issuePrize(address contractadd) public returns(bool success){
        //require (msg.sender == owner);
        if(!isActive) {
            WelCoin cont = WelCoin(contractadd);
            cont.transfer(winner, prize*10**decimals);
            //kill();
        } else {
            return false;
        }

        return true;
    }

    /* Function to recover the funds on the contract */
    function kill() public {
        require(msg.sender == owner);
        selfdestruct(owner);
    }




}