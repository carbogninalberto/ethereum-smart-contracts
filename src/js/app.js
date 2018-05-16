
//decimal for Token
var decimals = 3;

//Selected Account
var selectedNumber;

// Selected Challenge
var selectedChall;

//JSON that contains users
var UsersJSON;

// ------------------------------------------------------------------------
//  Retrieve the value of a url variable
// ------------------------------------------------------------------------

function getQueryVariable(variable)
{
 var query = window.location.search.substring(1);
 var vars = query.split("&");
 for (var i=0;i<vars.length;i++) {
   var pair = vars[i].split("=");
   if(pair[0] == variable){return pair[1];}
 }
 return(false);
}

App = {
  web3Provider: null,
  contracts: {},

  init: function() {

    $.getJSON('../steps.json', function(data) {
      UsersJSON = data;
      var walletRow = $('#walletRow');
      var walletTemplate = $('#walletTemplate');
      var walletSelector = $('#walletSelector');
      var walletDiv = $('#walletAdd');

      if(getQueryVariable("wallet")) {
        selectedNumber = getQueryVariable("wallet");
      } else {
        selectedNumber = 0;
      }

      for (i = 0; i < data.length; i ++) {
        if (selectedNumber == i) {
          var optiontag = '<option class="wallet-address" value="'+i+'"selected="selected">'+data[i].name+'</option>';
        } else {
          var optiontag = '<option class="wallet-address" value="'+i+'"">'+data[i].name+'</option>';
        }
        walletSelector.append(optiontag);
      }

      walletTemplate.find('.panel-title').text(data[selectedNumber].name);
      walletTemplate.find('.panel-sub').text(web3.eth.accounts[selectedNumber]);
      walletTemplate.find('img').attr('src', data[selectedNumber].picture);
      walletTemplate.find('.btn-adopt').attr('data-id', data[selectedNumber].id);

      walletRow.append(walletTemplate.html());
    });
    
    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
   $.getJSON('WelCoin.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var WelCoinArtifact = data;
      App.contracts.WelCoin = TruffleContract(WelCoinArtifact);
      // Set the provider for our contract
      App.contracts.WelCoin.setProvider(App.web3Provider);

      $.getJSON('ChallengeManager.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var ChallengeManager = data;
      App.contracts.ChallengeManager = TruffleContract(ChallengeManager);
      // Set the provider for our contract
      App.contracts.ChallengeManager.setProvider(App.web3Provider);

      App.contracts.ChallengeManager.deployed().then( async function(instance) {
        var deployed;
        var text;
        var challengeRow = $('#challenge-content');
        var challengeTemplate = $('#challenge-created');
        var challengePar = $('#listed-participants');
        var length = await instance.challengesLength.call({to: instance.address, 
          from: web3.eth.accounts[selectedNumber], gasPrice: 2, gas: 5000000});

        var challengeTemplateSelector = $('#challengeSelector');
        var challengeDiv = $('#challengeAdd');

        challengeNumber = await instance.challengesLength.call({to: instance.address, 
          from: web3.eth.accounts[selectedNumber], gasPrice: 2, gas: 5000000});

        console.log("challengeNumber = " + challengeNumber);

        if(getQueryVariable("challenge")) {
          selectedChall = getQueryVariable("challenge");
          console.log(selectedNumber + " is the selectedNumber");
        } else {
          selectedChall = 0;
        }

        for (i = 0; i < parseInt(challengeNumber); i ++) {

          challengeData = await instance.challenges.call(i, {to: instance.address, 
            from: web3.eth.accounts[selectedNumber], gasPrice: 2, gas: 5000000});

          if (selectedChall == i) {
            var optiontag = '<option class="wallet-address" value="'+i+'"selected="selected">'+challengeData[0]+'</option>';
            console.log("okl");
          } else {
            var optiontag = '<option class="wallet-address" value="'+i+'"">'+challengeData[0]+'</option>';
          }
          
          challengeTemplateSelector.append(optiontag);
        }


        if (parseInt(challengeNumber) > 0) {

          deployed = await instance.challenges.call(selectedChall, {to: instance.address, 
            from: web3.eth.accounts[selectedNumber], gasPrice: 2, gas: 5000000});

          partLength = await instance.getChallengeParticipantsLength.call(selectedChall, {to: instance.address, 
            from: web3.eth.accounts[selectedNumber], gasPrice: 2, gas: 5000000});

          for (j = 0; j < partLength.toNumber(); j++) {
            textIneed = await instance.getChallengeParticipants.call(selectedChall, j, {to: instance.address, 
              from: web3.eth.accounts[selectedNumber], gasPrice: 2, gas: 5000000});

            text = "<p>" + textIneed + "</p>";
            challengePar.append(text.toString());
          }

          var timestamp = new Date( deployed[3] *1);

          challengeTemplate.find('#hashit').text(deployed[8]);
          challengeTemplate.find('#nameit').text(deployed[0]);
          challengeTemplate.find('#descriptit').text(deployed[1]);
          challengeTemplate.find('#goalit').text(deployed[5].toNumber());
          challengeTemplate.find('#timstampit').text(timestamp.toLocaleDateString());
          challengeTemplate.find('#goaldescripit').text(deployed[2]);
          challengeTemplate.find('#prizeit').text(deployed[4].toNumber());
          challengeTemplate.find('#feeit').text(deployed[6].toNumber());
          challengeTemplate.find('#ownerit').text(deployed[7]);

          console.log("I AM THE: " + deployed[7]);
          if(web3.eth.accounts[selectedNumber] != deployed[7]) {
            challengeTemplate.find('#issue-prize').prop("disabled", true);
          }
          if(deployed[9].toString() != "0x0000000000000000000000000000000000000000") {
            challengeTemplate.find('#winner-log').show();
            challengeTemplate.find('#winner-log-name').text(deployed[9]);
          }
          challengeRow.append(challengeTemplate.html());
          
        }
      });
    });

return App.showToken();
});

return App.bindEvents();
},

showToken: function(adopters, account) {
  var WelCoinInstance;
  web3.eth.getAccounts(async function(error, accounts) {
    if (error) {
      console.log(error);
    }
    var account = accounts[0];
    App.contracts.WelCoin.deployed().then( async function(instance) {
      WelCoinInstance = instance;

      var tokens = await WelCoinInstance.balanceOf(web3.eth.accounts[selectedNumber]);
        //console.log(tokens.toNumber());
        document.getElementById("tokens").innerHTML = tokens.toNumber()*10**(-decimals) + " WELL";

        var [name, symbol, totalSupply, etherTokenRate, isRateActive, automaticIssue] = await WelCoinInstance.getData();
        var ownerBalance = await WelCoinInstance.balanceOfOwner();
        var contractBalance = await WelCoinInstance.contractBalance();

        //setup Contract Information
        document.getElementById("name-token").innerHTML = name;
        document.getElementById("symbol-token").innerHTML = symbol;
        document.getElementById("supply-token").innerHTML = totalSupply.toNumber()*10**(-decimals) + " " + symbol;
        document.getElementById("owner-token").innerHTML = (ownerBalance.toNumber()*10**(-decimals)).toFixed(8).replace(/\.?0+$/,"") + " " + symbol;
        document.getElementById("contract-token").innerHTML = (contractBalance.toNumber()*10**(-18)).toFixed(8).replace(/\.?0+$/,"") + " ETHER";
        document.getElementById("exchange-token").innerHTML = (isRateActive) ? "Yes" : "No";
        document.getElementById("rate-token").innerHTML = (etherTokenRate.toNumber()*10**(-decimals)).toFixed(8).replace(/\.?0+$/,"")  + " " + symbol;
        document.getElementById("issue-token").innerHTML = (automaticIssue) ? "Yes" : "No";
      });
  });
},

bindEvents: function() {
  $(document).on('click', '.btn-adopt', App.handleSteps);
  $(document).on('click', '.btn-choose-wallet', App.switchWallet);
  $(document).on('click', '.btn-stop', App.stop);
  $(document).on('click', '.btn-buy', App.buy);
  $(document).on('click', '.btn-approve', App.approve);
  $(document).on('click', '.btn-transfer', App.transfer);
  $(document).on('click', '.btn-chall', App.ChallengeManager);
  $(document).on('click', '.btn-join', App.JoinChallenge);
  $(document).on('click', '.btn-issue', App.IssuePrize);
  $(document).on('click', '.btn-test-goal', App.TestGoal);
  $(document).on('click', '.btn-choose-challenge', App.CallChallenge);  
},

handleSteps: function(event) {
  event.preventDefault();
  counter = 0;

  var steps = parseInt(document.getElementById("steps").innerHTML);
  var convertStepsInstance;

  web3.eth.getAccounts(async function(error, accounts) {
    if (error) {
      console.log(error);
    }

    var account = accounts[0];
    var instance = await  App.contracts.WelCoin.deployed();
    var result = await instance.depositTokenSteps.sendTransaction(steps, {to:instance.address, 
      from: web3.eth.accounts[selectedNumber], gas:51795, gasPrice:2});

    window.location.reload();
    return App.showToken();
  });
},

switchWallet: function(event) {
  var select = document.getElementById("walletSelector");
  selectedNumber = parseInt(select.options[select.selectedIndex].value);
  window.location.href = "http://localhost:3000/?wallet=" + selectedNumber;

},

stop: function(event) {
  event.preventDefault();
  if (walk) {
    walk = false;
    document.getElementById("walk").setAttribute('class', "mdi mdi-24px mdi-play-circle");
      //$('#anim').attr('src','img/anim_stop.png');
    } else {
      walk = true;
      document.getElementById("walk").setAttribute('class', "mdi mdi-24px mdi-pause-circle");
      //$('#anim').attr('src','img/anim.gif');
    }
  },

  buy: function(event) {
    event.preventDefault();
    var amount = document.getElementById("amount").value;

    App.contracts.WelCoin.deployed().then( async function(instance) {
      WelCoinInstance = instance;
      var tokens = await WelCoinInstance.depositExchangedEther.sendTransaction({to: instance.address, 
        from: web3.eth.accounts[selectedNumber], gasPrice: 2, gas: 100000, value: web3.toWei(amount)});
      window.location.reload();
    });
  },

  approve: function(event) {
    event.preventDefault();
    var amount = parseInt(document.getElementById("allowance-amount").value*10**decimals);
    var address = document.getElementById("allowance-address").value;

    App.contracts.WelCoin.deployed().then( async function(instance) {
      WelCoinInstance = instance;
      try {
        var tokens = await WelCoinInstance.approve.sendTransaction(address, amount, {to: instance.address, 
          from: web3.eth.accounts[selectedNumber], gasPrice: 2, gas: 100000});
        window.location.reload();
      } catch (err) {
        alert( UsersJSON[selectedNumber].name +"! Error on approving allowance for address:\r" + address 
          + "\rDetails: \r" + err);
      }
    });
  },

  transfer: function(event) {
    event.preventDefault();
    var amount = parseInt(document.getElementById("transfer-amount").value*10**decimals);
    var address = document.getElementById("transfer-address").value;

    App.contracts.WelCoin.deployed().then( async function(instance) {
      WelCoinInstance = instance;
      try {
        var tokens = await WelCoinInstance.transferFrom.sendTransaction(address, web3.eth.accounts[selectedNumber], 
          amount, {to: instance.address, from: web3.eth.accounts[selectedNumber], gasPrice: 2, gas: 500000});
        window.location.reload();
      } catch (err) {
        alert( UsersJSON[selectedNumber].name +"! Error on processing your transaction.\rAsk to this user: "+ address 
          + " to approve allowance! Details: \r" + err);
      }
    });
  },

  ChallengeManager: function(event) {
    event.preventDefault();

    var name = document.getElementById("chall-name").value;
    var description = document.getElementById("chall-descrip").value;
    var goal = parseInt(document.getElementById("chall-goal").value);
    var goalDescrip = document.getElementById("chall-goal-descrip").value;
    var prize = parseInt(document.getElementById("chall-prize").value);
    var fee = parseInt(document.getElementById("chall-fee").value);

    try {
      App.contracts.ChallengeManager.deployed().then( async function(instance) {

        WelCoinInstance = instance;
        var nowDate = Date.now();
        var hashingString = name + description + goalDescrip + prize + goal + fee + web3.eth.accounts[selectedNumber] + nowDate;

        hashingString = web3.sha3(web3.toHex(hashingString), {encoding:"hex"});
        var deployed = await instance.createChallenge.sendTransaction(name, description, goalDescrip, prize, goal, fee, hashingString, nowDate, {to: instance.address, 
          from: web3.eth.accounts[selectedNumber], gasPrice: 2, gas: 5000000});
        console.log(deployed);

      });
      window.location.reload();
    } catch (err) {
      alert( UsersJSON[selectedNumber].name +"! Error on creating challenge for address:\r" + address 
        + "\rDetails: \r" + err);
    }
  },  

  JoinChallenge: function(even, id) {
    event.preventDefault();

    try {

      App.contracts.ChallengeManager.deployed().then( async function(instance) {
        WelCoinInstance = instance;
        var deployed = await instance.challenges.call(selectedChall, {to: instance.address, 
          from: web3.eth.accounts[1], gasPrice: 2, gas: 5000000});
        var string = deployed[0] + deployed[1] + deployed[2] + deployed[4] + deployed[5] + deployed[6] + deployed[7] + deployed[3];

        try {

          App.contracts.WelCoin.deployed().then(async function(instanceWel){
            var participate = await instance.participateToChallenge.sendTransaction(instanceWel.address, string, {to: instance.address, 
              from: web3.eth.accounts[selectedNumber], gasPrice: 2, gas: 90000000});
          }).then(window.location.reload());

        } catch (err) {
          alert( UsersJSON[selectedNumber].name +"! Error on join challenge:\r" + address 
            + "\rDetails: \r" + err);
        }

      });

    } catch (err) {
      alert( UsersJSON[selectedNumber].name +"! Error on join challenge:\r" + address 
        + "\rDetails: \r" + err);
    }
  },

  IssuePrize: function(event) {
    event.preventDefault();

    try {

      App.contracts.ChallengeManager.deployed().then( async function(instance) {
        WelCoinInstance = instance;
        var deployed = await instance.challenges.call(selectedChall, {to: instance.address, 
          from: web3.eth.accounts[1], gasPrice: 2, gas: 5000000});
        var string = deployed[0] + deployed[1] + deployed[2] + deployed[4] + deployed[5] + deployed[6] + deployed[7] + deployed[3];

        try {
          App.contracts.WelCoin.deployed().then(async function(instanceWel){
            var participate = await instance.issuePrize.sendTransaction(instanceWel.address, string, {to: instance.address, 
              from: web3.eth.accounts[selectedNumber], gasPrice: 2, gas: 90000000});
          }).then(window.location.reload());

        } catch (err) {
          alert( UsersJSON[selectedNumber].name +"! Error on issuing prize:\r" + address 
            + "\rDetails: \r" + err);
        }     
      });
    } catch (err) {
      alert( UsersJSON[selectedNumber].name +"! Error on join challenge:\r" + address 
        + "\rDetails: \r" + err);
    }
  },

  TestGoal: function(event) {
    event.preventDefault();
    try {

      App.contracts.ChallengeManager.deployed().then( async function(instance) {
        WelCoinInstance = instance;
        var deployed = await instance.challenges.call(selectedChall, {to: instance.address, 
          from: web3.eth.accounts[1], gasPrice: 2, gas: 5000000});
        var string = deployed[0] + deployed[1] + deployed[2] + deployed[4] + deployed[5] + deployed[6] + deployed[7] + deployed[3];
        try {
          var goal = document.getElementById("chall-goal-units").value;
          var participate = await instance.depositGoalUnit.sendTransaction(goal, string, {to: instance.address, 
            from: web3.eth.accounts[selectedNumber], gasPrice: 2, gas: 90000000});
        } catch (err) {
          alert( UsersJSON[selectedNumber].name +"! Error on testing Goal:\r" + address 
            + "\rDetails: \r" + err);
        }         
      });
    } catch (err) {
      alert( UsersJSON[selectedNumber].name +"! Error on join challenge:\r" + address 
        + "\rDetails: \r" + err);
    }
  },

  CallChallenge: function(event) {
    var select = document.getElementById("walletSelector");
    var selectChallenge = document.getElementById("challengeSelector");

    selectedNumber = parseInt(select.options[select.selectedIndex].value);
    selectedChallengeNumber = parseInt(selectChallenge.options[selectChallenge.selectedIndex].value);
    window.location.href = "http://localhost:3000/?wallet=" + selectedNumber + "&challenge=" + selectedChallengeNumber;
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
