# [BattleBlocks](https://battleblocks.lol/)
Frontend app for BattleBlocks (battleships game based on blockchain) built for Flow Hackathon using React.js

## Getting started

To get started with the BattleBlocks frontend app, you'll need to have
Node.js and npm installed on your machine. If you'd like a hassle-free
installation, I strongly suggest JavaScript tool manager [Volta](https://volta.sh/).
All you need to do is run the following two commands:

    $ curl https://get.volta.sh | bash
    $ volta install node

### Install
    $ git clone https://github.com/kollektive-hackathon/battleblocks-frontend.git
    $ cd battleblocks-frontend
    $ npm i

### Start & watch
    $ npm run dev

### Simple build for production
    $ npm run build

This will start a development server at http://localhost:3000. You can then open this URL in your web browser to see the app in action.

## Features
The BattleBlocks frontend app includes the following features:

 - `Authentication`: Users sign up / log in to their BattleBlocks
account using Google.


 - `Game setup`: Users can set up a new game of BattleBlocks or
join an existing one by placing their ships and staking some amount of [FLOW](https://flow.com/) token.
Both stakes are locked into the BattleBlocks smart contract until the
end of the game. Winner takes all!
 - `Gameplay`: Users alternate moves by clicking on squares on the game
board to try to sink their opponent's ships.
Each move is validated by the contract without persisting the state of
the board(s) since blockchain is public and that could ruin the game.


 - `Shop`: Users have the option to buy cooler ships (via [PayPal](https://www.paypal.com/)).


 - `Blockchain integration`: The app connects to the BattleBlocks
blockchain backend to manage game data and assets.
 - `Personal wallet`: Users can connect their personal wallet and gain full custody over their
Battleblocks wallet to transfer their tokens and assets.

## Contributing
If you'd like to contribute to the BattleBlocks frontend app,
please fork the repository and create a pull request with your
changes. We welcome contributions of all types, including bug fixes,
new features, and documentation improvements.

## License
The BattleBlocks frontend app is licensed under the MIT License.
See the LICENSE file for details.
