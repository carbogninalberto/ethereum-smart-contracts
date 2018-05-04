pragma solidity ^0.4.18;

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
	address contract_address;
    address owner;
    address winner;
    bool isActive;

	//Building Dictionary of partecipants
  	mapping(address => bool) partecipants;

    mapping(address => uint) targetTrack;

	//Constructor
	constructor(
		string initialName,
		string initialDescription,
		uint initialPrize,
		uint initialFee,
		uint initialTarget,
		string initialTargetDescription,
        address initialOwner,
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

    function isPartecipant(address partecipant) public constant returns(bool state) {
        if (partecipants[partecipant]) {
            return true;
        } else {
            return false;
        }
    }

    function getFee() public constant returns(uint cost) {
        return fee;
    }

    function isActiveStatus() public constant returns(bool active) {
        return isActive;
    }


    function getOwner() public constant returns(address theOwner) {
        return owner;
    }

    function getWinner() public constant returns(address theWinner) {
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