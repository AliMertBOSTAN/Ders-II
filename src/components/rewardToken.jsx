import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { REWARD_TOKEN, REWARD_TOKEN_ADDRESS } from "../contracts";

const getBalanceAndClaimed = async (account, provider) => {
  const rewardToken = REWARD_TOKEN.connect(provider);
  const [balance, claimed] = await Promise.all([
    rewardToken.balanceOf(account),
    rewardToken.hasClaimed(account),
  ]);
  return [ethers.utils.formatEther(balance), claimed];
};

const addRRRTokenToMetaMask = async () => {
  if (!window.ethereum) {
    return false;
  }
  try {
    const added = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: REWARD_TOKEN_ADDRESS,
          symbol: "RRR",
          decimals: 18,
        },
      },
    });
    return added;
  } catch (error) {
    return false;
  }
};

const RewardToken = ({ account, provider }) => {
  const [balance, setBalance] = useState("");
  const [claimed, setClaimed] = useState(false);

  const claim = async () => {
    const signer = provider.getSigner();
    const ataToken = REWARD_TOKEN.connect(signer);
    const tx = await ataToken.claim({
      gasLimit: 1_000_000,
    });
    const receipt = await tx.wait();
    console.log(receipt);

    getBalanceAndClaimed(account, provider)
      .then(([balance, claimed]) => {
        setBalance(balance);
        setClaimed(claimed);
      })
      .catch(console.error);
  };

  useEffect(() => {
    getBalanceAndClaimed(account, provider)
      .then(([balance, claimed]) => {
        setBalance(balance);
        setClaimed(claimed);
      })
      .catch(console.error);
  }, [provider, account]);

  if (!balance) {
    return (
      <div>
        <h2>Reward Token</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Reward Token</h2>
      <p>
        <strong>Reward Token balance:</strong> {balance} RRR
      </p>
      {claimed ? (
        <p>You have already claimed your RRR</p>
      ) : (
        <button onClick={claim}>Claim RRR</button>
      )}
      <button onClick={addRRRTokenToMetaMask}>Add to MetaMask</button>
    </div>
  );
};

export default RewardToken;