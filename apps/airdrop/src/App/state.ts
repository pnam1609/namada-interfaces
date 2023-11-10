import { atom } from "jotai";

// Types
export type ClaimResponse = {
  eligible: boolean;
  amount: number;
  confirmed: boolean;
  airdrop_address?: string;
};

export type Signature = {
  signature: string;
  pubKey: { type: string; value: string };
};

// State
export type KeplrClaimType = "cosmos" | "osmosis" | "stargaze";
export type ClaimType = "github" | "ts" | KeplrClaimType;

export type GithubState = {
  eligible: boolean;
  amount: number;
  hasClaimed: boolean;
  type: ClaimType;
  githubToken: string;
};

export type KeplrState = {
  eligible: boolean;
  amount: number;
  hasClaimed: boolean;
  type: ClaimType;
  signature: Signature;
  address: string;
  nonce: string;
};

export type TSState = {
  eligible: boolean;
  amount: number;
  hasClaimed: boolean;
  type: ClaimType;
  nonce: string;
  publicKey: string;
};

export type CommonState = GithubState | KeplrState | TSState;
export const claimAtom = atom<CommonState | null>(null);

export type ConfirmationState = {
  confirmed: boolean;
  address: string;
  amount: number;
};
export const confirmationAtom = atom<ConfirmationState | null>(null);
