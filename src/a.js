App.contracts.WelCoin.deployed().then( async function(instance) {

        WelCoinInstance = instance;

        var deployed = await WelCoinInstance.deployChallenge.sendTransaction('100000 STEP CHALLENGE', 'Reach 100000 steps to win 250 tokens', 250, 1, 100000, "number of steps", {to: instance.address, 
          from: web3.eth.accounts[selectedNumber], gasPrice: 100, gas: 900000});
        console.log(deployed);

      });


App.contracts.WelCoin.deployed().then( async function(instance) {

        WelCoinInstance = instance;

        var deployed = await WelCoinInstance.partecipateToChallengeOf.sendTransaction('0xb61e4014eAEc6BAC156C24E8b2bea4AAE814Ee70', 1, {to: instance.address, 
          from: web3.eth.accounts[2], gasPrice: 2, gas: 5000000});
        console.log(deployed);

      });


App.contracts.WelCoin.deployed().then( async function(instance) {

        WelCoinInstance = instance;

        var deployed = await WelCoinInstance.depositDataChallenge.sendTransaction('0xb61e4014eAEc6BAC156C24E8b2bea4AAE814Ee70', 100002, {to: instance.address, 
          from: web3.eth.accounts[2], gasPrice: 2, gas: 5000000});
        console.log(deployed);

      });

App.contracts.WelCoin.deployed().then( async function(instance) {

        WelCoinInstance = instance;

        WelCoinInstance.prizeIssue.sendTransaction( {to: instance.address, 
          from: web3.eth.accounts[1], gasPrice: 2, gas: 6000000}).then(function (res){ console.log(res);})

      });


if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);


$.getJSON('ChallengeManager.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var ChallengeManager = data;
      App.contracts.ChallengeManager = TruffleContract(ChallengeManager);
      // Set the provider for our contract
      App.contracts.ChallengeManager.setProvider(App.web3Provider);
      // Use our contract to retrieve and mark the adopted pets
    });


App.contracts.ChallengeManager.deployed().then( async function(instance) {

        WelCoinInstance = instance;

        var deployed = await instance.createChallenge.sendTransaction('Prova', 'ddd', 'dfdsfds', 200, 50000, 0, {to: instance.address, 
          from: web3.eth.accounts[1], gasPrice: 2, gas: 5000000});
        console.log(deployed);

      });


App.contracts.ChallengeManager.deployed().then( async function(instance) {

        WelCoinInstance = instance;
		var hashing = await instance.getChallengeHash.call(web3.eth.accounts[1], 0, {to: instance.address, 
          from: web3.eth.accounts[1], gasPrice: 2, gas: 10000000});

		var part = await instance.participateToChallenge.call(web3.eth.accounts[1], hashing.toString(), 10, {to: instance.address, from: web3.eth.accounts[1], gasPrice: 2, gas: 10000000});
		console.log(part);
        });