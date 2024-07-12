import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import AssessmentABI from "../artifacts/contracts/Assessment.sol/Assessment.json";

const contractAddress = "0x4A679253410272dd5232B3Ff7cF5dbB88f295319";
const assessmentABI = AssessmentABI.abi;

const HomePage = () => {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atmContract, setAtmContract] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [betOutcome, setBetOutcome] = useState(undefined);
  const [randomNumber, setRandomNumber] = useState(undefined);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, assessmentABI, signer);

        setEthWallet(window.ethereum);
        setAtmContract(contract);

        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        setAccount(accounts[0]);

        const balance = await provider.getBalance(accounts[0]);
        setBalance(ethers.utils.formatEther(balance));
      } else {
        alert("MetaMask wallet not detected. Please install MetaMask to use this application.");
      }
    };

    loadBlockchainData();
  }, []);

  const handleDeposit = async () => {
    if (atmContract) {
      try {
        const tx = await atmContract.deposit({ value: ethers.utils.parseEther("1") });
        await tx.wait();
        updateBalance();
      } catch (error) {
        console.error("Error depositing:", error);
      }
    }
  };

  const handlePlaceBet = async () => {
    if (atmContract) {
      try {
        const tx = await atmContract.placeBet({ value: ethers.utils.parseEther("1") });
        await tx.wait();
        updateBalance();
        const betResult = await atmContract.betOutcome();
        setBetOutcome(betResult === 1 ? "You win!" : "You lose!");
        const randomNum = await atmContract.lastRandomNumber();
        setRandomNumber(randomNum.toNumber());
      } catch (error) {
        console.error("Error placing bet:", error);
      }
    }
  };

  const updateBalance = async () => {
    if (account) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(account);
      setBalance(ethers.utils.formatEther(balance));
    }
  };

  const renderContent = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this application.</p>;
    } else if (!account) {
      return (
        <button onClick={() => window.ethereum.request({ method: "eth_requestAccounts" })}>
          Connect MetaMask Wallet
        </button>
      );
    } else {
      return (
        <div className="casino-container">
          <h1>WELCOME TO THE BETTING GAME!</h1>
          <div className="game-area">
            <p>Your Account: {account}</p>
            <p>Your Balance: {balance} ETH</p>
            <button className="bet-button" onClick={handlePlaceBet}>Place Bet (1 ETH)</button>
            {betOutcome && <p className="outcome">{betOutcome}</p>}
            {randomNumber !== undefined && (
              <p className="random-number">Random Number: {randomNumber}</p>
            )}
          </div>
          <style jsx>{`
            h1{
              color: #FF0000
            }
            .casino-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background-color: #173518;
            }
            .game-area {
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
              text-align: center;
              max-width: 400px;
              width: 100%;
            }
            .bet-button {
              background-color: #007bff;
              color: #fff;
              border: none;
              padding: 10px 20px;
              margin-top: 20px;
              font-size: 16px;
              cursor: pointer;
              border-radius: 4px;
              transition: background-color 0.3s ease;
            }
            .bet-button:hover {
              background-color: #0056b3;
            }
            .outcome {
              font-size: 18px;
              margin-top: 20px;
              font-weight: bold;
              color: #dc3545;
            }
            .random-number {
              margin-top: 20px;
              font-size: 18px;
            }
          `}</style>
        </div>
      );
    }
  };

  return (
    <main className="container">
      {renderContent()}
    </main>
  );
};

export default HomePage;
