import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { REWARD_TOKEN, STAKING_CONTRACT } from "../contracts";

const getStakingViews = async (account, provider) => {
  const signer = provider.getSigner(account);
  const staking = STAKING_CONTRACT.connect(signer);
  const [staked, reward, totalStaked] = await Promise.all([
    staking.stakedOf(account),
    staking.rewardOf(account),
    staking.totalStaked(),
  ]);
  return {
    staked: ethers.utils.formatEther(staked),
    reward: ethers.utils.formatEther(reward),
    totalStaked: ethers.utils.formatEther(totalStaked),
  };
};

const Pool = ({ account, provider }) => {
  const [views, setViews] = useState({});
  const [stake, setStake] = useState("");
  const [withdraw, setWithdraw] = useState("");

  const handleStake = async event => {
    event.preventDefault();
    const signer = provider.getSigner(account);
    const amount = ethers.utils.parseEther(stake);

    const ataToken = REWARD_TOKEN.connect(signer);
    const allowance = await ataToken.allowance(
      account,
      STAKING_CONTRACT.address
    );
    if (allowance.lt(amount)) {
      const tx = await ataToken.approve(STAKING_CONTRACT.address, amount);
      await tx.wait();
    }

    const staking = STAKING_CONTRACT.connect(signer);

    const tx = await staking.stake(amount, {
      gasLimit: 1_000_000,
    });
    await tx.wait();
  };

  const handleWithdraw = async event => {
    event.preventDefault();
    const signer = provider.getSigner(account);
    const staking = STAKING_CONTRACT.connect(signer);

    const tx = await staking.withdraw(ethers.utils.parseEther(withdraw), {
      gasLimit: 1_000_000,
    });
    await tx.wait();
  };

  const handleClaimReward = async () => {
    const signer = provider.getSigner(account);
    const staking = STAKING_CONTRACT.connect(signer);

    const tx = await staking.claimReward({
      gasLimit: 1_000_000,
    });
    await tx.wait();
  };

  useEffect(() => {
    getStakingViews(account, provider).then(setViews).catch(console.error);
  }, [account, provider]);

  if (!views.staked) {
    return (
      <div>
        <h2>Staking</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Staking</h2>
      <p>
        <strong>Staked: </strong> {views.staked} REWARD
      </p>
      <p>
        <strong>Reward: </strong> {views.reward} REWARD
      </p>
      <p>
        <strong>Total Staked: </strong> {views.totalStaked} REWARD
      </p>
      <div style={{ display: "flex" }}>
        <form onSubmit={handleStake}>
          <label htmlFor="stake">Stake</label>
          <input
            id="stake"
            placeholder="0.0 REWARD"
            value={stake}
            onChange={e => setStake(e.target.value)}
          />
          <button type="submit">Stake REWARD</button>
        </form>
        <form onSubmit={handleWithdraw}>
          <label htmlFor="withdraw">Withdraw</label>
          <input
            id="withdraw"
            placeholder="0.0 REWARD"
            value={withdraw}
            onChange={e => setWithdraw(e.target.value)}
          />
          <button type="submit">Withdraw REWARD</button>
        </form>
      </div>
      <button onClick={handleClaimReward}>Claim Reward</button>
    </div>
  );
};

export default Pool;