# Simple Betting Game

This Solidity smart contract facilitates a betting mechanism where users can place bets with 1 ETH and potentially win 2 ETH based on a random number generated upon betting.

## Key Components:

### State Variables:
'owner': The address that deployed the contract and initially holds ownership.

'contractBalance': Tracks the total balance held by the contract.

### Events:
'Deposit': Triggered when a user deposits funds into the contract.

'BetPlaced': Triggered when a user places a bet, capturing the better's address, bet amount, generated random number, and whether they won.

'Win': Triggered when a user wins a bet, indicating the amount won.

'Lose': Triggered when a user loses a bet, indicating the amount lost.

### Constructor:
Sets the 'owner' to the contract deployer ('msg.sender') and initializes 'contractBalance' to 0.

### Functions:
'getBalance()': Returns the current balance of the contract.

'determineWin(uint256 randomNumber)': Internal function that determines if the generated random number (from 1 to 6) results in a win (specifically when the random number is 1, 3, or 5).

'placeBet()': Allows users to place a bet of exactly 1 ETH. It generates a random number based on block data and checks if the user wins. If they win, the contract pays out 2 ETH (assuming sufficient balance) to the user and emits a Win event. If they lose, the contract keeps the bet amount and emits a Lose event.

### How to Run the Program

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/
