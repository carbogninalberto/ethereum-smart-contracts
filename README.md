# Demo v0.1.0
![alt text](https://i.ibb.co/NWvy9P7/logo.png)

### Disclamer
No Copyright Infringement Intended.

LICENSE.

You can use this code as you want, also for commercial use,
but you have to add "Ethereum Watcher - Alberto Carbognin"
in your application.

### Introduction

Ganache allows developer to run ethereum blockchain privately and locally.
Truffle is a framework to develop and testing Solidity Smart Contracts.

### Installation

Development/running demo enviroment:
- [Node.js](https://nodejs.org/) v8+ to run.
- [Gananche](http://truffleframework.com/ganache/) (or gananche-cli)
- [Truffle](http://truffleframework.com/)
- [MetaMask](https://metamask.io/) (not needed anymore) 

Install the dependencies:

```sh
$ npm install
```
### Running Demo

Setup gananche with following parameters:
- http://localhost:8545/
- network id: 5777
- Gas price: 1

Deploy the Smart Contract on Network:

```sh
$ truffle migrate
```
whether it's not the first time you're deploying use:

```sh
$ truffle migrate --reset
```

Run web server:

```sh
$ npm run dev
```
### Testing
Use the following commands in main directory:

```sh
$ truffle migrate
$ truffle test ./test/wel_coin.js
```

### Other Stuff
```sh
$ truff --network live console
```

