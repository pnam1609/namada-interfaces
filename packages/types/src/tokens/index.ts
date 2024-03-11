export * from "./Cosmos";
export * from "./Namada";
export * from "./types";

////////////////////////////////////////////////////////////////////////////////
// maybe this is utils stuff
////////////////////////////////////////////////////////////////////////////////

import { registeredCoinTypes } from "slip44";

import { TokenInfo } from "./types";

export const getSlip44Info = (symbol: string): TokenInfo => {
  const registeredCoinType = registeredCoinTypes.find(
    ([, , someSymbol]) => someSymbol === symbol
  );

  if (!registeredCoinType) {
    throw new Error(`no registered coin type found for ${symbol}`);
  }

  const [coinType, derivationPathComponent, , name] = registeredCoinType;

  return {
    address: "",
    type: coinType,
    path: derivationPathComponent,
    symbol,
    coin: name,
    url: "",
  };
};
