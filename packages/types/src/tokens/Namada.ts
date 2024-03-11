import { getSlip44Info } from "./index";
import { TokenInfo } from "./types";

const {
  NAMADA_INTERFACE_NAMADA_TOKEN:
    nativeToken = "tnam1q8ctk7tr337f85dw69q0rsrggasxjjf5jq2s2wph",
} = process.env;

// Declare symbols for tokens we support:
// TODO: This will need to be refactored for mainnet!
export const Symbols = [
  "NAM",
  "BTC",
  "DOT",
  "ETH",
  "SCH",
  "APF",
  "KAR",
] as const;

export type TokenType = (typeof Symbols)[number];
type Tokens = Record<TokenType, TokenInfo>;

const namadaTokens: Record<TokenType, TokenInfo> = {
  // Map a few test addresses for now:
  NAM: {
    ...getSlip44Info("NAM"),
    url: "https://namada.net",
    address: nativeToken,
    symbol: "Naan",
  },

  DOT: {
    ...getSlip44Info("DOT"),
    address: "tnam1qyfl072lhaazfj05m7ydz8cr57zdygk375jxjfwx",
    coinGeckoId: "polkadot",
  },

  ETH: {
    ...getSlip44Info("ETH"),
    address: "tnam1qxvnvm2t9xpceu8rup0n6espxyj2ke36yv4dw6q5",
    coinGeckoId: "ethereum",
  },

  BTC: {
    ...getSlip44Info("BTC"),
    address: "tnam1qy8qgxlcteehlk70sn8wx2pdlavtayp38vvrnkhq",
    coinGeckoId: "bitcoin",
  },

  SCH: {
    ...getSlip44Info("SCH"),
    coin: "Schnitzel",
    symbol: "SCH",
    address: "tnam1q9f5yynt5qfxe28ae78xxp7wcgj50fn4syetyrj6",
  },

  APF: {
    ...getSlip44Info("APF"),
    coin: "Apfel",
    symbol: "APF",
    address: "tnam1qyvfwdkz8zgs9n3qn9xhp8scyf8crrxwuq26r6gy",
  },

  KAR: {
    ...getSlip44Info("KAR"),
    coin: "Kartoffel",
    symbol: "KAR",
    address: "tnam1qyx93z5ma43jjmvl0xhwz4rzn05t697f3vfv8yuj",
  },
};

// ERIC: aliasing
export const Tokens = namadaTokens;

export type TokenBalance = { token: TokenType; amount: string };
