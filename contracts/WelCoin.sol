pragma solidity ^0.5.0;


// ----------------------------------------------------------------------------
//  WELLCOIN implementation
//  based on ERC20 Token
//  https://theethereum.wiki/w/index.php/ERC20_Token_Standard 
//  Code Owned by: Alberto Carbognin
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
//  ERC20 Interface
// ----------------------------------------------------------------------------
contract ERC20Interface {
  function totalSupply() public view returns (uint);
  function balanceOf(address tokenOwner) public view returns (uint balance);
  function allowance(address tokenOwner, address spender) public view returns (uint remaining);
  function transfer(address to, uint tokens) public returns (bool success);
  function approve(address spender, uint tokens) public returns (bool success);
  function transferFrom(address from, address to, uint tokens) public returns (bool success);

  //events to track operations in real time
  //indexed is needed in order to find events using indexed parameters as filter
  event Transfer(address indexed from, address indexed to, uint tokens);
  event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}


// ----------------------------------------------------------------------------
//  Official Implementation
// ----------------------------------------------------------------------------

contract WelCoin is ERC20Interface, Owned {
  //importing library for safe math operations
  using SafeMath for uint;

  //Describing Contract basic informations
  string public name;
  string public symbol;
  uint public totalQuantitySupply;
  uint public decimals;
  uint public stepsTokenRate;
  bool public isRateActive;
  bool public newIssue;
  WelCoin public contract_address;

  //Building Dictionary for Balances Account
  mapping(address => uint) balances;
  //Building Dictionary for allowance per account
  //the first address allows to pay second address of uint amount
  mapping(address => mapping(address => uint)) allowed;


  //Constructor
  constructor(
    string memory initialName,
    string memory initalSymbol,
    uint initialSupply,
    uint initialStepsTokenRate,
    uint initialDecimals,
    bool initialIsRateActive,
    bool initialNewIssue
    ) public {
    name = initialName;
    symbol = initalSymbol;
    decimals = initialDecimals;
    totalQuantitySupply = initialSupply * 10**uint(initialDecimals);
    stepsTokenRate = initialStepsTokenRate;
    isRateActive = initialIsRateActive;
    newIssue = initialNewIssue;
    contract_address = this; //this cointains contract's address information

    //updating initial balances
    balances[owner] = totalQuantitySupply;

    //fire up Transfer event
    emit Transfer(address(0), owner, totalQuantitySupply);
  }

  //return the balance of a Token Owner
  function balanceOf(address tokenOwner) public view returns(uint balance) {
    return balances[tokenOwner];
  }

  //return the balance of Owner
  function balanceOfOwner() public view returns(uint balance) {
    return balances[owner];
  }

  function totalSupply() public view returns(uint supply) {
    return totalQuantitySupply;
  }

  //return balance of the contract 
  function contractBalance() public view returns(uint balance) {
    return address(contract_address).balance;
  }

  //return parameters
  function getData() public view returns(
    string memory nameData,
    string memory symbolData,
    uint totalSupplyData,
    uint stepsTokenRateData,
    bool isRateActiveData,
    bool newIssueData
    ) {
    return (name, symbol, totalQuantitySupply, stepsTokenRate, isRateActive, newIssue);
  }

  //deposit ether as token
  function depositExchangedEther() public payable returns(bool success){
    require(msg.value >= 0);
    require(isRateActive == true);

    //user is using etherTokenExchange rate
    // 1 to change
    uint exchangableToken = msg.value.div(10**11);

    if (balances[owner].sub(exchangableToken) >= 0) {

      //write transfer function
      balances[owner] = balances[owner].sub(exchangableToken);
      balances[msg.sender] = balances[msg.sender].add(exchangableToken);
      //only for demo purpose
      //owner.transfer(contract_address.balance); //gas used 2300

      } else {

        revert();
      }

      return true;

  }

  //Step to token assign
  function depositTokenSteps(uint steps) public payable returns(bool success){

    require (steps >= 0);

    //user is using etherTokenExchange rate
    uint exchangableToken = steps.mul(stepsTokenRate);

    if (balances[owner].sub(exchangableToken) >= 0) {

      //write transfer function
      balances[owner] = balances[owner].sub(exchangableToken);
      balances[msg.sender] = balances[msg.sender].add(exchangableToken);

      } else {
        revert();
      }

      return true;

  }

  // ------------------------------------------------------------------------
  // Virtual Deposit `tokens` from the `from` account to the `to` account
  // ------------------------------------------------------------------------
  function virtualDepositTransferFrom(address from, address to, uint tokens) public returns (bool success) {
    require(balances[from] >= tokens);

    balances[from] = balances[from].sub(tokens);
    balances[to] = balances[to].add(tokens);
    emit Transfer(from, to, tokens);
    return true;
  }


  // ------------------------------------------------------------------------
  // Transfer the balance from token owner's account to `to` account
  // - Owner's account must have sufficient balance to transfer
  // ------------------------------------------------------------------------
  function transfer(address to, uint tokens) public returns (bool success) {
    require(balances[msg.sender] >= tokens);
    balances[msg.sender] = balances[msg.sender].sub(tokens);
    balances[to] = balances[to].add(tokens);
    emit Transfer(msg.sender, to, tokens);
    return true;
  }

  // ------------------------------------------------------------------------
  // Token owner can approve for `spender` to transferFrom(...) `tokens`
  // from the token owner's account
  // ------------------------------------------------------------------------
  function approve(address spender, uint tokens) public returns (bool success) {
    allowed[msg.sender][spender] = tokens;
    emit Approval(msg.sender, spender, tokens);
    return true;
  }

  // ------------------------------------------------------------------------
  // Transfer `tokens` from the `from` account to the `to` account
  // ------------------------------------------------------------------------
  function transferFrom(address from, address to, uint tokens) public returns (bool success) {
    uint256 allowance = allowed[from][msg.sender];
    require(balances[from] >= tokens && allowance >= tokens);

    balances[from] = balances[from].sub(tokens);
    allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);
    balances[to] = balances[to].add(tokens);
    emit Transfer(from, to, tokens);
    return true;
  }


  // ------------------------------------------------------------------------
  // Returns the amount of tokens approved by the owner that can be
  // transferred to the spender's account
  // ------------------------------------------------------------------------
  function allowance(address tokenOwner, address spender) public view returns (uint remaining) {
    return allowed[tokenOwner][spender];
  }

  // ------------------------------------------------------------------------
  //  New Token Issuing
  // ------------------------------------------------------------------------
  function issueTokens(uint amount) public returns (bool success) {
    require(msg.sender == owner);
    if (newIssue) {
      balances[owner] = balances[owner].add(amount);
      totalQuantitySupply = totalQuantitySupply.add(amount);
      emit Transfer(address(0), owner, amount);
      } else {
        revert();
      }

      return true;
    }

}