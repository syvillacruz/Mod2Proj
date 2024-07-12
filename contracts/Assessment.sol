// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public contractBalance;

    event Deposit(address indexed user, uint256 amount);
    event BetPlaced(address indexed user, uint256 amount, uint256 randomNumber, bool isWin);
    event Win(address indexed user, uint256 amount);
    event Lose(address indexed user, uint256 amount);

    constructor() payable {
        owner = payable(msg.sender);
        contractBalance = 0;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function determineWin(uint256 randomNumber) internal pure returns (bool) {
        return (randomNumber == 1 || randomNumber == 3 || randomNumber == 5);
    }

    function placeBet() public payable {
        require(msg.value == 1 ether, "Bet amount must be exactly 1 ETH");
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % 6 + 1;
        bool isWin = determineWin(randomNumber);

        if (isWin) {
            uint256 winAmount = 2 ether;
            require(contractBalance >= winAmount, "Contract balance is insufficient to pay out winnings");
            payable(msg.sender).transfer(winAmount);
            contractBalance -= winAmount;
            emit Win(msg.sender, winAmount);
        } else {
            emit Lose(msg.sender, msg.value);
        }

        contractBalance += msg.value;
        emit BetPlaced(msg.sender, msg.value, randomNumber, isWin);
    }
}
