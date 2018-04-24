var WelCoin = artifacts.require("./WelCoin.sol");


contract("WelCoin", function (accounts) {
  it("Checking Token Creation: [Name, Symbol, Supply, ETH/TOKEN, Exchanging Available, Automatic Issue]", async function () {
    var test_name = "WELLCOIN";
    var test_symbol = "WEL";
    var test_supply = 10000*10**(18);

    const contract = await WelCoin.deployed();
    const data = await contract.getData.call();
    //console.log(data);
    const name = data[0];
    const symbol = data[1];
    const supply = await contract.totalSupply.call();
    //console.log(supply == Number(test_supply));

    assert.isTrue(name === test_name);
    assert.isTrue(symbol === test_symbol);
    assert.equal(supply.toNumber(), Number(test_supply), "Wrong Supply");

  });

});

