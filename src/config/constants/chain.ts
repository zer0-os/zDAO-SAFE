export enum SupportedChainId {
  ETHEREUM = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
}

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(
  SupportedChainId
).filter((id) => typeof id === 'number') as SupportedChainId[];
