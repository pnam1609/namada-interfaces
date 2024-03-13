import { getSlip44Info } from "./index";
import { TokenInfo } from "./types";

const {
  NAMADA_INTERFACE_NAMADA_TOKEN:
    nativeToken = "tnam1q8ctk7tr337f85dw69q0rsrggasxjjf5jq2s2wph",
} = process.env;

// Declare symbols for tokens we support:
// TODO: This will need to be refactored for mainnet!
export const namadaSymbols = [
  "NAM",
  "BTC",
  "DOT",
  "ETH",
  "SCH",
  "APF",
  "KAR",
] as const;

export type NamadaSymbol = (typeof namadaSymbols)[number];

// ERIC: aliasing
export const Symbols = namadaSymbols;

// ERIC: aliasing
export type TokenType = NamadaSymbol;

const namadaTokens: Record<TokenType, TokenInfo> = {
  // Map a few test addresses for now:
  NAM: {
    ...getSlip44Info("NAM"),
    url: "https://namada.net",
    address: nativeToken,
    symbol: "Naan",
    minDenom: "namnam",
    decimals: 6,
  },

  DOT: {
    ...getSlip44Info("DOT"),
    address: "tnam1qyfl072lhaazfj05m7ydz8cr57zdygk375jxjfwx",
    coinGeckoId: "polkadot",
    minDenom: "",
    decimals: 0,
  },

  ETH: {
    ...getSlip44Info("ETH"),
    address: "tnam1qxvnvm2t9xpceu8rup0n6espxyj2ke36yv4dw6q5",
    coinGeckoId: "ethereum",
    minDenom: "",
    decimals: 0,
  },

  BTC: {
    ...getSlip44Info("BTC"),
    address: "tnam1qy8qgxlcteehlk70sn8wx2pdlavtayp38vvrnkhq",
    coinGeckoId: "bitcoin",
    minDenom: "",
    decimals: 0,
  },

  SCH: {
    ...getSlip44Info("SCH"),
    coin: "Schnitzel",
    symbol: "SCH",
    address: "tnam1q9f5yynt5qfxe28ae78xxp7wcgj50fn4syetyrj6",
    minDenom: "",
    decimals: 0,
  },

  APF: {
    ...getSlip44Info("APF"),
    coin: "Apfel",
    symbol: "APF",
    address: "tnam1qyvfwdkz8zgs9n3qn9xhp8scyf8crrxwuq26r6gy",
    minDenom: "",
    decimals: 0,
  },

  KAR: {
    ...getSlip44Info("KAR"),
    coin: "Kartoffel",
    symbol: "KAR",
    address: "tnam1qyx93z5ma43jjmvl0xhwz4rzn05t697f3vfv8yuj",
    minDenom: "",
    decimals: 0,
  },
};

// ERIC: aliasing
export const Tokens = namadaTokens;
