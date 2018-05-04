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