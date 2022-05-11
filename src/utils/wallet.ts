// Set of helper functions to facilitate wallet setup

import { ExternalProvider } from '@ethersproject/providers';
import { SupportedChainId } from '@zero-tech/zdao-sdk';

import { network } from '../config/constants/network';

const BAD_SRCS: { [imageSrc: string]: true } = {};

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async (
  requestedChainId: SupportedChainId,
  externalProvider?: ExternalProvider,
) => {
  const provider = externalProvider || window.ethereum;

  if (provider) {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${requestedChainId.toString(16)}` }],
      });
      return true;
    } catch (switchError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((switchError as any)?.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${requestedChainId.toString(16)}`,
                chainName: network[requestedChainId].chainName,
                nativeCurrency: {
                  name: network[requestedChainId].nativeCurrency.name,
                  symbol: network[requestedChainId].nativeCurrency.symbol,
                  decimals: network[requestedChainId].nativeCurrency.decimals,
                },
                rpcUrls: network[requestedChainId].nodes,
                blockExplorerUrls: [
                  `${network[requestedChainId].blockExplorerUrl}/`,
                ],
              },
            ],
          });
          return true;
        } catch (error) {
          console.error('Failed to setup the network in Metamask:', error);
          return false;
        }
      }
      return false;
    }
  } else {
    console.error(
      "Can't setup the BSC network on metamask because window.ethereum is undefined",
    );
    return false;
  }
};

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenLogo?: string,
) => {
  // better leave this undefined for default image instead of broken image url
  // eslint-disable-next-line no-nested-ternary
  const image = tokenLogo
    ? BAD_SRCS[tokenLogo]
      ? undefined
      : tokenLogo
    : undefined;

  const tokenAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image,
      },
    },
  });

  return tokenAdded;
};
