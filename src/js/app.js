var decimals = 3;
var selectedNumber;

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

//var selected_account = web3.eth.accounts[1];
App = {

  web3Provider: null,
  contracts: {},

  init: function() {

    //$('#ETHER').text('booo');
    //document.getElementById("ether").innerHTML = "New text!";
    // Load pets.
    
    $.getJSON('../steps.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      var walletTemplate = $('#walletSelector');
      var walletDiv = $('#walletAdd');

      if(getQueryVariable("wallet")) {
        selectedNumber = getQueryVariable("wallet");
      } else {
        selectedNumber = 0;
      }

      console.log(selectedNumber.toString());


      

      for (i = 0; i < data.length; i ++) {
        //walletTemplate.find('.wallet-option').text(web3.eth.accounts[i]);
        if (selectedNumber == i) {
          var optiontag = '<option class="wallet-address" value="'+i+'"selected="selected">'+data[i].name+'</option>';
        } else {
          var optiontag = '<option class="wallet-address" value="'+i+'"">'+data[i].name+'</option>';
        }
        
        walletTemplate.append(optiontag);

        //console.log(wallets);

        //petTemplate.find('.panel-title').text(data[i].name);
        //petTemplate.find('.panel-sub').text(web3.eth.accounts[0]);
        //petTemplate.find('img').attr('src', data[i].picture);
        //petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        //petsRow.append(petTemplate.html());
      }
      console.log(walletTemplate);

      petTemplate.find('.panel-title').text(data[selectedNumber].name);
      petTemplate.find('.panel-sub').text(web3.eth.accounts[selectedNumber]);
      petTemplate.find('img').attr('src', data[selectedNumber].picture);
      petTemplate.find('.btn-adopt').attr('data-id', data[selectedNumber].id);
      //petTemplate.find('#walletAdd').text(walletTemplate());

      petsRow.append(petTemplate.html());
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

      // Use our contract to retrieve and mark the adopted pets
      return App.showToken();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleSteps);
    $(document).on('click', '.btn-stop', App.stop);
    $(document).on('click', '.btn-buy', App.buy);
    $(document).on('click', '.btn-approve', App.approve);
    $(document).on('click', '.btn-transfer', App.transfer);
    $(document).on('click', '.btn-choose-wallet', App.switchWallet);
  },

  switchWallet: function(event) {
    //web3.eth.accounts[selectedNumber]
    var select = document.getElementById("walletSelector");
    selectedNumber = parseInt(select.options[select.selectedIndex].value);
    console.log(selectedNumber);
    window.location.href = "http://localhost:3000/?wallet=" + selectedNumber;

  },

  buy: function(event) {

    event.preventDefault();
    var amount = parseInt(document.getElementById("amount").value)*10**decimals;
    console.log(amount);

    App.contracts.WelCoin.deployed().then( async function(instance) {
        WelCoinInstance = instance;

        var tokens = await WelCoinInstance.depositExchangedEther.sendTransaction({to: instance.address, from: web3.eth.accounts[selectedNumber], gasPrice: 2, gas: 100000, value: amount});
        //console.log(tokens.toNumber());
        //document.getElementById("tokens").innerHTML = tokens.toNumber()*10**(-18) + " WEL";
        //return WelCoinInstance.balanceOf('0xb61e4014eAEc6BAC156C24E8b2bea4AAE814Ee70');
        window.location.reload();
      });



  },

  approve: function(event) {

    event.preventDefault();
    var amount = parseInt(document.getElementById("allowance-amount").value)*10**decimals;
    var address = document.getElementById("allowance-address").value;

    App.contracts.WelCoin.deployed().then( async function(instance) {
        WelCoinInstance = instance;
        //
        var tokens = await WelCoinInstance.approve.sendTransaction(address, amount, {to: instance.address, from: web3.eth.accounts[selectedNumber], gasPrice: 2, gas: 100000});
        //console.log(tokens.toNumber());
        //document.getElementById("tokens").innerHTML = tokens.toNumber()*10**(-18) + " WEL";
        //return WelCoinInstance.balanceOf('0xb61e4014eAEc6BAC156C24E8b2bea4AAE814Ee70');
        window.location.reload();
      });



  },

  transfer: function(event) {

    event.preventDefault();
    var amount = parseInt(document.getElementById("transfer-amount").value)*10**decimals;
    var address = document.getElementById("transfer-address").value;

    App.contracts.WelCoin.deployed().then( async function(instance) {
        WelCoinInstance = instance;
        //
        var tokens = await WelCoinInstance.transferFrom.sendTransaction(address, web3.eth.accounts[selectedNumber], amount, {to: instance.address, from: web3.eth.accounts[selectedNumber], gasPrice: 2, gas: 500000});
        //console.log(tokens.toNumber());
        //document.getElementById("tokens").innerHTML = tokens.toNumber()*10**(-18) + " WEL";
        //return WelCoinInstance.balanceOf('0xb61e4014eAEc6BAC156C24E8b2bea4AAE814Ee70');
        window.location.reload();
      });


  },

  stop: function(event) {

    event.preventDefault();
    if (walk) {
      walk = false;
      document.getElementById("walk").setAttribute('class', "mdi mdi-24px mdi-play-circle");
      $('#anim').attr('src','img/anim_stop.png');
    } else {
      walk = true;
      document.getElementById("walk").setAttribute('class', "mdi mdi-24px mdi-pause-circle");
      $('#anim').attr('src','img/anim.gif');
    }
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
      var result = await instance.depositTokenSteps.sendTransaction(steps, {to:instance.address, from: web3.eth.accounts[selectedNumber], gas:51795, gasPrice:2});
      console.log(result);
      window.location.reload();
      return App.showToken();

      /*

      App.contracts.WelCoin.deployed().then(function(instance) {
        convertStepsInstance = instance;

        // Execute adopt as a transaction by sending account
        return convertStepsInstance.depositTokenSteps(500000, {from: account});
      }).then(function(result) {
        return App.showToken(); 
      }).catch(function(err) {
        console.log(err.message);
      });
      */
    });
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

        console.log(instance.address);

        var tokens = await WelCoinInstance.balanceOf(web3.eth.accounts[selectedNumber]);
        console.log(tokens.toNumber());
        document.getElementById("tokens").innerHTML = tokens.toNumber()*10**(-decimals) + " WEL";
        //window.location.reload()
        //return WelCoinInstance.balanceOf('0xb61e4014eAEc6BAC156C24E8b2bea4AAE814Ee70');
        var [name, symbol, totalSupply, etherTokenRate, isRateActive, automaticIssue] = await WelCoinInstance.getData();
        var ownerBalance = await WelCoinInstance.balanceOfOwner();
        var contractBalance = await WelCoinInstance.contractBalance();

        document.getElementById("name-token").innerHTML = name;
        document.getElementById("symbol-token").innerHTML = symbol;
        document.getElementById("supply-token").innerHTML = totalSupply.toNumber()*10**(-decimals) + " " + symbol;
        document.getElementById("owner-token").innerHTML = (ownerBalance.toNumber()*10**(-decimals)).toFixed(8).replace(/\.?0+$/,"") + " " + symbol;
        document.getElementById("contract-token").innerHTML = (contractBalance.toNumber()*10**(-decimals)).toFixed(8).replace(/\.?0+$/,"") + " ETHER";
        document.getElementById("exchange-token").innerHTML = (isRateActive) ? "Yes" : "No";
        document.getElementById("rate-token").innerHTML = (etherTokenRate.toNumber()*10**(-decimals)).toFixed(8).replace(/\.?0+$/,"")  + " " + symbol;
        
        document.getElementById("issue-token").innerHTML = (automaticIssue) ? "Yes" : "No";



      });
    });
    
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
