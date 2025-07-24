import { Contract, Wallet, providers, ethers } from 'ethers';
import { KYCverifyABI } from '../config/constant.js';
import dotenv from 'dotenv';
dotenv.config({ path: new URL('../../.env', import.meta.url).pathname });

export const verify = async (request, res) => {
  try {
    const userAddress = request.body.address;
    if (!userAddress) {
      return res.status(400).json({ error: 'Missing address' });
    }
    const KYCAddress = process.env.KYC_CONTRACT_ADDRESS;
    const WALLET_PRIVATE = process.env.WALLET_PRIVATE;
    const RPC = process.env.RPC_PROVIDER_URL;
    const provider = new providers.JsonRpcProvider(RPC);
    const wallet = new Wallet(WALLET_PRIVATE, provider);
    const contract = new Contract(KYCAddress, KYCverifyABI, wallet);

    const tx = await contract.verifyUser(userAddress, true);
    await tx.wait();
    console.log('User Verified\ntxHash:', tx.hash);
    return res.status(200).json({ status: 'status' });
  } catch (error) {
    console.log('Verification error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const check = async (req, res) => {
  try {
    const address = req.body.address;
    if (!address) {
      return res.status(400).json({ error: 'Missing address' });
    }
    const KYCAddress = process.env.KYC_CONTRACT_ADDRESS;
    const provider = new providers.JsonRpcProvider(
      process.env.RPC_PROVIDER_URL
    );
    const contract = new Contract(KYCAddress, KYCverifyABI, provider);
    const adminAddress = await contract.admin();

    console.log(isVerified);
    return res.status(200).json({ status: isVerified });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
