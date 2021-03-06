import BigNumber from 'bignumber.js';
import { getAddress } from '@ethersproject/address';
import { Contract } from '@ethersproject/contracts';
import { Wallet } from '@ethersproject/wallet';
import assets from '@centfinance/cent.dex_assets/assets/index.json';

import config from '@/config';
import provider from '@/utils/provider';

export const ETH_KEY = config.eth_key ;

export function formatAddress(address: string, length = 8): string {
    const ellipsizedAddress = `${address.substr(0, 2 + length / 2)}…${address.substr(42 - length / 2)}`;
    return ellipsizedAddress;
}

export function formatTxHash(txHash: string, length = 16): string {
    const ellipsizedHash = `${txHash.substr(0, 2 + length / 2)}…${txHash.substr(66 - length / 2)}`;
    return ellipsizedHash;
}

export function formatDate(timestamp: number): string {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    };
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', options);
}

export function isAddress(value: string): boolean {
    try {
        getAddress(value);
    } catch(e) {
        return false;
    }
    return true;
}

export function scale(input: BigNumber, decimalPlaces: number): BigNumber {
    const scalePow = new BigNumber(decimalPlaces.toString());
    const scaleMul = new BigNumber(10).pow(scalePow);
    return input.times(scaleMul);
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}

export function getEtherscanLink(txHash: string): string {
    const chainId = config.chainId;
    const urlMap = {
        1: 'https://etherscan.io/tx',
        42: 'https://kovan.etherscan.io/tx',
        77: 'https://blockscout.com/poa/sokol/tx',
        100: 'https://blockscout.com/xdai/mainnet/tx',
        44787: 'https://alfajores-blockscout.celo-testnet.org/tx',
        42220: 'https://explorer.celo.org/tx',
    };
    const url = urlMap[chainId];
    const link = `${url}/${txHash}`;
    return link;
}

export function getAccountLink(address: string): string {
    const chainId = config.chainId;
    const urlMap = {
        1: 'https://etherscan.io/address',
        42: 'https://kovan.etherscan.io/address',
        77: 'https://blockscout.com/poa/sokol/address',
        100: 'https://blockscout.com/xdai/mainnet/address',
        44787: 'https://alfajores-blockscout.celo-testnet.org/address',
        42220: 'https://explorer.celo.org/address',
    };
    const url = urlMap[chainId];
    const link = `${url}/${address}`;
    return link;
}

export function getPoolLink(pool: string): string {
    const chainId = config.chainId;
    const prefixMap = {
        1: '',
        42: 'kovan.',
        77: 'sokol.',
        100: 'xdai.',
        44787: 'alfajores.',
        42220: 'celo',
    };
    const prefix = prefixMap[chainId];
    const link = `https://${prefix}-pools.symmetric.exchange/#/pool/${pool}`;
    return link;
}

export function getAssetLogo(address: string): string {
    if (assets.includes(address.toLowerCase())) {
        return `https://raw.githubusercontent.com/centfinance/cent.dex_assets/master/assets/${address.toLowerCase()}.png`;
    }
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
}

export function logRevertedTx(
    sender: string,
    contract: Contract,
    action: string,
    params: any,
    overrides: any,
): void {
    overrides.gasPrice = sender;
    const dummyPrivateKey = '0x651bd555534625dc2fd85e13369dc61547b2e3f2cfc8b98cee868b449c17a4d6';
    const dummyWallet = new Wallet(dummyPrivateKey).connect(provider);
    const loggingContract = contract.connect(dummyWallet);
    loggingContract[action](...params, overrides);
}