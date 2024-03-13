import { NamadaSymbol } from "./Namada";

export type TokenInfo<D extends string = string> = {
  symbol: string;
  type: number;
  path: number;
  coin: string;
  address: string;
  minDenom: D;
  decimals: number;
  nativeAddress?: string;
  isNut?: boolean;
  coinGeckoId?: string;
  url?: string;
};

// ERIC: can amount be BigNumber instead of string?
export type TokenBalance<S = NamadaSymbol> = {
  token: S;
  amount: string;
};
