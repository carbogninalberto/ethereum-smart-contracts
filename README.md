# Demo v0.0.1
![alt text](https://preview.ibb.co/i9iTdc/preview.png)
walking animation credit @ [Peter Arumugam](https://www.behance.net/gallery/38420671/Walk-Cycle-GIF-Animation)
### Installation

Development/running demo enviroment:
- [Node.js](https://nodejs.org/) v8+ to run.
- [Galanche](http://truffleframework.com/ganache/) (or galanche-cli)
- [Truffle](http://truffleframework.com/)
- [MetaMask](https://metamask.io/)

Install the dependencies.

```sh
$ npm install
```
### Running Demo

Setup galanche with following parameters:
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

Run the server

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
truff --network live console
