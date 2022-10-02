export type Bip44Path = {
  account: number;
  change: number;
  index: number;
};

export enum KdfTypes {
  Argon2 = "argon2",
  Scrypt = "scrypt",
}

type KdfParams = {
  salt: string;
};

export type Argon2Params = KdfParams & {
  m_cost: number;
  t_cost: number;
  p_cost: number;
};

export type ScryptParams = KdfParams & {
  log_n: number;
  r: number;
  p: number;
};

export interface KeyStore<T = Argon2Params> {
  id: string;
  alias: string;
  path: Bip44Path;
  parentId?: string;
  meta?: {
    [key: string]: string;
  };
  crypto: {
    cipher: {
      type: "aes-256-gcm";
      iv: Uint8Array;
      text: Uint8Array;
    };
    kdf: {
      type: KdfTypes;
      params: T;
    };
  };
}

export type MnemonicState = {
  id: string;
  alias?: string;
  phrase: Uint8Array;
};

export type DerivedAccount = {
  id: string;
  address: string;
  alias?: string;
  bip44Path: Bip44Path;
  establishedAddress?: string;
};

export type AccountState = DerivedAccount & {
  parentId: string;
  private: Uint8Array;
  public: Uint8Array;
};

export enum KeyRingStatus {
  NOTLOADED,
  EMPTY,
  LOCKED,
  UNLOCKED,
}
