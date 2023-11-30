import { atom } from "jotai";

// Types
export type ClaimResponse = {
  eligible: boolean;
  amount: number;
  confirmed: boolean;
  airdrop_address?: string;
  airdrop_public_key?: string;
};

export type KeplrSignature = {
  signature: string;
  pubKey: { type: string; value: string };
};

// State
export const KEPLR_CLAIMS = ["cosmos", "osmosis", "badkids"] as const;
export type KeplrClaimType = (typeof KEPLR_CLAIMS)[number];
export type ClaimType = "github" | "ts" | "gitcoin" | KeplrClaimType;

export type GithubState = {
  eligible: boolean;
  amount: number;
  hasClaimed: boolean;
  type: "github";
  githubToken?: string;
  githubUsername: string;
  eligibilities: string[];
};

export type KeplrState = {
  eligible: boolean;
  amount: number;
  hasClaimed: boolean;
  type: KeplrClaimType;
  signature?: KeplrSignature;
  address: string;
  nonce: string;
};

export type TSState = {
  eligible: boolean;
  amount: number;
  hasClaimed: boolean;
  type: "ts";
  nonce: string;
  publicKey: string;
};

export type GitcoinState = {
  eligible: boolean;
  amount: number;
  hasClaimed: boolean;
  signature?: string;
  address: string;
  nonce: string;
  type: "gitcoin";
};

export type CommonState = GithubState | KeplrState | TSState | GitcoinState;
export const claimAtom = atom<CommonState | null>(null);

export type Label = {
  type: "unknown" | "username" | "publicKey" | "address";
  value: string;
};
export const labelAtom = atom<Label | undefined>((get) => {
  const claim = get(claimAtom);
  if (!claim) {
    return { type: "unknown", value: "" };
  }
  const { type } = claim;

  if (type === "github") {
    return { type: "username", value: claim.githubUsername };
  } else if (type === "ts") {
    return { type: "publicKey", value: claim.publicKey };
  } else if (type === "gitcoin" || KEPLR_CLAIMS.includes(type)) {
    return { type: "address", value: claim.address };
  }
});

export type ConfirmationState = {
  confirmed: boolean;
  address: string;
  publicKey: string;
  amount: number;
};
//export const confirmationAtom = atom<ConfirmationState | null>(null);
export const confirmationAtom = atom<ConfirmationState | null>({
  confirmed: true,
  address: "tnam1qrjhfsayrll8avk8c9zghpx3jhnded2sdu6rf42r",
  publicKey:
    "tpknam1qpq46e5fa3tv5e8v0w2eey2tzyqe0lf5td7ndpaca39kd8pvsv8x5y0z5jr",
  amount: 15,
});
