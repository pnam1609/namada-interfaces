import { getSlip44Info } from "./index";
import { TokenInfo } from "./types";

const cosmosMinDenoms = ["uatom", "uosmo"] as const;
export type CosmosMinDenom = (typeof cosmosMinDenoms)[number];

const isCosmosMinDenom = (str: string): str is CosmosMinDenom =>
  cosmosMinDenoms.includes(str as CosmosMinDenom);

// Tokens in Cosmos ecosystem
export const cosmosSymbols = ["ATOM", "OSMO"] as const;

export type CosmosSymbol = (typeof cosmosSymbols)[number];

const isCosmosSymbol = (str: string): str is CosmosSymbol =>
  cosmosSymbols.includes(str as CosmosSymbol);

// ERIC: aliasing
export type CosmosTokenType = CosmosSymbol;

// TODO: As Cosmos tokens are added to our TokenType, map corresponding denom from Keplr config
// See: https://github.com/chainapsis/keplr-wallet/blob/master/packages/extension/src/config.ts for all values in Keplr

const denomTokenMap: Record<CosmosMinDenom, CosmosSymbol> = {
  uatom: "ATOM",
  uosmo: "OSMO",
};

export const tokenByMinDenom = (minDenom: string): CosmosSymbol | undefined =>
  isCosmosMinDenom(minDenom) ? denomTokenMap[minDenom] : undefined;

export const minDenomByToken = (token: string): CosmosMinDenom | undefined => {
  if (!isCosmosSymbol(token)) {
    return undefined;
  }

  for (const denom of cosmosMinDenoms) {
    if (denomTokenMap[denom] === token) {
      return denom;
    }
  }

  throw new Error(`${token} is a cosmos symbol but is not in denomTokenMap`);
};

const cosmosTokens: Record<CosmosSymbol, TokenInfo> = {
  ATOM: {
    ...getSlip44Info("ATOM"),
    coinGeckoId: "cosmos",
  },

  // NOTE: Osmosis does not have a SLIP-044 entry:
  OSMO: {
    symbol: "OSMO",
    type: 0,
    path: 0,
    coin: "Osmo",
    url: "https://osmosis.zone/",
    address: "",
    coinGeckoId: "osmosis",
  },
};

// ERIC: aliasing
export const CosmosTokens = cosmosTokens;
