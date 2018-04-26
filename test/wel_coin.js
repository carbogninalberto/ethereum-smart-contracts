var WelCoin = artifacts.require("./WelCoin.sol");


contract("WelCoin", function (accounts) {
  	
	it("Checking Token Creation: [Name, Symbol, Supply, ETH/TOKEN, Exchanging Available, Automatic Issue]", async function () {
	var test_name = "WELLCOIN";
	var test_symbol = "WEL";
	var test_supply = 20*10**(18);

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


	it("[Partition test] on newAccount() details:", async function () {

		const contract = await WelCoin.deployed();

		//DEPOSIT ETHER PARTITION
		const deposit1 = await contract.depositExchangedEther({
			value:19, 
			from: '0x40AbEB9D9848fd98A1651bc30A81404046F9Ca94'
		});
		const check1 = await contract.balanceOf.call('0xc811D3e8ee4D77D3bcD102a3aD0E8C3CB4018c41');
		console.log("\t" + check1.toNumber());


		const deposit2 = await contract.depositExchangedEther({
			value:1, 
			from: '0x40AbEB9D9848fd98A1651bc30A81404046F9Ca94'
		});
		const check2 = await contract.balanceOf.call('0xc811D3e8ee4D77D3bcD102a3aD0E8C3CB4018c41');
		console.log("\t" + check2.toNumber());
		
		assert.isTrue(check2.toNumber()==0);

	});

	it("[Throw Exception Test] on newAccount() details:", async function () {

		const contract = await WelCoin.deployed();

		contract.depositExchangedEther({
			value:20,
			from: '0x40AbEB9D9848fd98A1651bc30A81404046F9Ca94'
		}).then(function (value) {
			console.log("WRONG BEHAVIOUR " + value.toString());
		}).catch(function(error) {
			if(error.toString().indexOf("revert") != -1) {
				//console.log("\t Worked has expected");
				assert.isTrue(true);
			} else {
				assert(false, error.toString());
			}
		})

	});


});


