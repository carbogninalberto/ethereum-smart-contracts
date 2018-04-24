var WelCoin = artifacts.require("./WelCoin.sol");


contract("WelCoin", function (accounts) {
  it("Check Token: [Name, Symbol, Supply]", async function () {
    var test_name = "CiaoCoin";
    var test_symbol = "HLLC";
    var test_supply = 10000*10**(18);

    const contract = await Token.deployed();
    const name = await contract.coinName.call();
    const symbol = await contract.coinSymbol.call();
    const supply = await contract.totalSupply.call();

    assert.isTrue(name === test_name);
    assert.isTrue(symbol === test_symbol);
    assert.equal(Number(supply), Number(test_supply), "Wrong Supply");

  });

  it("Check balanceOf", async function () {
    var test_balance = 10000*10**(18);
    var test_address = '0x63a0a140deb7f791700e90258f3317d4116525da';
    const contract = await Token.deployed();
    const balance = await contract.balanceOf.call(test_address);

    console.log(balance);

    assert.equal(Number(balance), Number(test_balance), "Wrong Balance");

  });

  it("Check Transfer to DAO[1]", async function () {
    var test_balance = 100;
    var test_address_2 = '0x8e5c8bc9fe0921c4d9e2ad9d880096a15b5324d6';
    var token;

    return Token.deployed().then(function(instance){
      token = instance;
      return token.transfer.call(test_address_2, test_balance);
    }).then(function(result){
        console.log(result);
        assert.equal(result, true, "Error on Transaction");
    });

  });

  it("Allowance Spending Token from DAO[1] => DAO[2]", async function () {
    var test_balance = 1000;
    var test_address_1 = '0x63a0a140deb7f791700e90258f3317d4116525da';
    var test_address_2 = '0x8e5c8bc9fe0921c4d9e2ad9d880096a15b5324d6';

    const contract = await Token.deployed();
    const approve1 = await contract.approve.call(test_address_1, test_balance);
    const allowance = await contract.allowance.call(test_address_1, test_address_1)
    //const msgSender = await contract.msgSender.call();
    console.log(Number(allowance));
    //console.log("check allowance for DAO[1]");
    //const allowance = await contract.allowance.call(test_address_1, test_address_2);
    //const approve2 = await contract.approve.call(test_address_2, test_balance);
    //console.log("TOTAL ALLOWANCE: " + allowance);
    assert.equal(approve1, true, "Error on Approving");

  });



  it("Transfer from DAO[1] => DAO[2]", async function () {
    var test_balance = 50;
    var test_address_1 = '0x63a0a140deb7f791700e90258f3317d4116525da';
    var test_address_2 = '0x8e5c8bc9fe0921c4d9e2ad9d880096a15b5324d6';

    const contract = await Token.deployed();
    const trasferFrom = await contract.transferFrom.call(test_address_1, test_address_2, test_balance);

    assert.equal(trasferFrom, true, "Error on Transfer From");

  });

    /*
    return Token.deployed().then(function(instance){
      token = instance;
      return token.balanceOf.call(test_address_2);
    }).then(function(result) {
      initial_balance = result;
      return token.transferFrom.call(test_address_1, test_address_2, test_balance);

    }).then(function(transfer){
        //const balance_of_2 = await contract.balanceOf.call(test_address_2);
        //console.log(balance);

        assert.equal(transfer, true, "Error on Transaction");
        //assert.isTrue(balance_of_2 == (balance_of_2_before+10));
      });
    });
    */

    //const contract = await Token.deployed();
    //const balance_of_2_before = await contract.balanceOf.call(test_address_2);
    //aggiungere la quantità di gas
    //return contract.transferFrom.call(test_address_1, test_address_2, test_balance).then(function(result){
    //  const balance_of_2 = await contract.balanceOf.call(test_address_2);
      //console.log(balance);

      //assert.equal(result, true, "Error on Transaction");
    //  assert.isTrue(balance_of_2 == (balance_of_2_before+10));
    //});


  //});



});

