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

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        //petTemplate.find('.pet-breed').text(data[i].breed);
        //petTemplate.find('.pet-age').text(data[i].age);
        //petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
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
  },
  stop: function(event) {

    event.preventDefault();
    if (walk) {
      walk = false;
      document.getElementById("walk").innerHTML = "Start";
      $('#anim').attr('src','img/anim_stop.png');
    } else {
      walk = true;
      document.getElementById("walk").innerHTML = "Stop";
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
      var result = await instance.depositTokenSteps(steps);
      console.log(result);
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

      var account = accounts[1];
      App.contracts.WelCoin.deployed().then( async function(instance) {
        WelCoinInstance = instance;

        var tokens = await WelCoinInstance.balanceOf('0x40AbEB9D9848fd98A1651bc30A81404046F9Ca94');
        console.log(tokens.toNumber());
        document.getElementById("tokens").innerHTML = tokens.toNumber()*10**(-18) + " WEL";
        //return WelCoinInstance.balanceOf('0xb61e4014eAEc6BAC156C24E8b2bea4AAE814Ee70');
      }).then(function(tokens) {
          //$('#ETHER').text(tokens.toNumber());
          //document.getElementById("balance").innerHTML = tokens.toNumber();
          /*
          var petsRow = $('#petsRow');
          var petTemplate = $('#petTemplate');
          petTemplate.find('.blance').text(tokens.toNumber());
          petTemplate.find('.balance-steps').attr('data-id', 50000);
          petsRow.append(petTemplate.html());
          */
      }).catch(function(err) {
        console.log(err.message);
      });
    });
    
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
