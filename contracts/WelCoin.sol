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

    function Owned() public {
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

  //Building Dictrionary for Balances Account
  mapping(address => uint) balances;

  //events to track operations in real time
  //indexed is needed in order to find events using indexed parameters as filter
  event Transfer(address indexed from, address indexed to, uint tokens);

  //Constructor
  function WelCoin(
    string initialName,
    string initalSymbol,
    uint8 initalDecimals,
    uint initialEtherTokenRate,
    bool initialIsRateActive,
    bool initialAutomaticIssue
    ) public {
      name = initialName;
      symbol = initalSymbol;
      totalSupply = initialSupply * 10**uint(18);
      etherTokenRate = initialEtherTokenRate;
      isRatActivee = initialIsRateActive;
      automaticIssue = initialAutomaticIssue;

      //updating initial balances
      balances[owner] = totalSupply;

      //fire up Transfer event
      emit Transfer(address(0), owner, totalSupply);
  }

  //return the balance of a Token Owner
  function balanceOf(address tokenOwner) public constant returns(uint balance) {
    return balance[tokenOwner];
  }

  //Create New Account 
  function newAccount(address newTokenOwner) public payable returns(bool success){
    //Checking if there is a positive amount of ether sended
    //Checking if the Exchange Rate is Active
    require (msg.value >= 0);
    require (isRateActive == true);

    if (msg.value == 0) {
      //user is opening a zero deposit account
      balances[newTokenOwner] = 0;
    }
    else {
      //user is using etherTokenExchange rate on newDeposit
      uint exchangableToken = msg.value * etherTokenRate;

      //Checking if there is enough remaining unused supply
      if (balances[owner].sub(exchangableToken) >= 0)) {
        //write transfer function
        balances[owner] = balances[owner].sub(exchangableToken);
        balances[newTokenOwner] = exchangableToken;
      }
      else {
        if (automaticIssue) {
          // the totalSupply is equal to totalSupply + unissued supply
          uint newIssuedSupply = exchangableToken.sub(balances[owner]);
          totalSupply = totalSupply.add(newIssuedSupply);
          balances[owner] = 0;
          balances[newTokenOwner] = exchangableToken;
        }
      }
    }
    return true;
  }

  //Transfer tokens from account to another


}