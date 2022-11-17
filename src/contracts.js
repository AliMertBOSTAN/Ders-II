import { ethers } from "ethers";
import RewardTokenABI from "../abi/RewardToken.abi.json";
import StakingAbi from "../abi/Staking.abi.json";

export const REWARD_TOKEN_ADDRESS = "0x1f9670f78dE1f7543Fe201344E518eDDFe9F4106";
export const REWARD_TOKEN = new ethers.Contract(REWARD_TOKEN_ADDRESS, RewardTokenABI);

export const STAKING_ADDRESS = "0xE891dF9984Db5427545a10dAd4245A702E73aC0E";
export const STAKING_CONTRACT = new ethers.Contract(
  STAKING_ADDRESS,
  StakingAbi
);