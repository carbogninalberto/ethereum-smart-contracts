pragma solidity ^0.4.18;

// ----------------------------------------------------------------------------
//  WELLCOIN implementation
//  based on ERC20 Token
//  https://theethereum.wiki/w/index.php/ERC20_Token_Standard 
//  Created by: Alberto Carbognin
// ----------------------------------------------------------------------------


// ----------------------------------------------------------------------------
// Safe maths
// ----------------------------------------------------------------------------
library SafeMath {
    function add(uint a, uint b) internal pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
    function sub(uint a, uint b) internal pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
    function mul(uint a, uint b) internal pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
    function div(uint a, uint b) internal pure returns (uint c) {
        require(b > 0);
        c = a / b;
    }
}

// ----------------------------------------------------------------------------
// Owned contract
// ----------------------------------------------------------------------------
contract Owned {
    address public owner;
    address public newOwner;

    event OwnershipTransferred(address indexed _from, address indexed _to);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        newOwner = _newOwner;
    }
    function acceptOwnership() public {
        require(msg.sender == newOwner);
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }
}

// ----------------------------------------------------------------------------
// 
// ----------------------------------------------------------------------------

contract WelCoin is Owned {
  //importing library for safe math operations
  using SafeMath for uint;

  //Describing Contract basic informations
  string public name;
  string public symbol;
  uint public totalSupply;
  uint public etherTokenRate;
  bool public isRateActive;
  bool public automaticIssue;
  address public contract_address;

  //Building Dictrionary for Balances Account
  mapping(address => uint) balances;

  //events to track operations in real time
  //indexed is needed in order to find events using indexed parameters as filter
  event Transfer(address indexed from, address indexed to, uint tokens);

  //Constructor
  constructor(
    string initialName,
    string initalSymbol,
    uint initialSupply,
    uint initialEtherTokenRate,
    bool initialIsRateActive,
    bool initialAutomaticIssue
    ) public {
      name = initialName;
      symbol = initalSymbol;
      totalSupply = initialSupply * 10**uint(18);
      etherTokenRate = initialEtherTokenRate;
      isRateActive = initialIsRateActive;
      automaticIssue = initialAutomaticIssue;
      contract_address = this; //this cointains contract's address information

      //updating initial balances
      balances[owner] = totalSupply;

      //fire up Transfer event
      emit Transfer(address(0), owner, totalSupply);
  }

  //return the balance of a Token Owner
  function balanceOf(address tokenOwner) public constant returns(uint balance) {
    return balances[tokenOwner];
  }

  //return the balance of Owner
  function balanceOfOwner() public constant returns(uint balance) {
    return balances[owner];
  }

  function totalSupply() public constant returns(uint supply) {
    return totalSupply;
  }

  //return balance of the contract 
  function contractBalance() public constant returns(uint balance) {
    return contract_address.balance;
  }

  //return parameters
  function getData() public constant returns(
    string nameData,
    string symbolData,
    uint totalSupplyData,
    uint etherTokenRateData,
    bool isRateActiveData,
    bool automaticIssueData
    ) {
    return (name, symbol, totalSupply, etherTokenRate, isRateActive, automaticIssue);
  }

  //deposit ether as token
  function depositExchangedEther() public payable returns(bool success){
    require(msg.value >= 0);
    require(isRateActive == true);

    //user is using etherTokenExchange rate
    uint exchangableToken = msg.value.mul(etherTokenRate);

    if (balances[owner].sub(exchangableToken) >= 0) {

      //write transfer function
      balances[owner] = balances[owner].sub(exchangableToken);
      balances[msg.sender] = balances[msg.sender].add(exchangableToken);
      //only for demo purpose
      owner.transfer(contract_address.balance); //gas used 2300

    } else {

      revert();
    }

    return true;
    
  }

  //Step to token assign
  function depositTokenSteps(uint steps) public payable returns(bool success){

    require (steps >= 0);

    //user is using etherTokenExchange rate
    uint exchangableToken = steps.mul(10**15);

    if (balances[owner].sub(exchangableToken) >= 0) {

      //write transfer function
      balances[owner] = balances[owner].sub(exchangableToken);
      balances[msg.sender] = balances[msg.sender].add(exchangableToken);

    } else {
      revert();
    }

    return true;
    
  }


}