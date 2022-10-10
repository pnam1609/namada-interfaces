use bip32::{Prefix, XPrv};
use thiserror::Error;

use wasm_bindgen::prelude::*;

#[derive(Debug, Error)]
pub enum Bip44Error {
    #[error("Unable to parse path")]
    PathError,
    #[error("Unable to derive keys from path")]
    DerivationError,
    #[error("Could not create secret key from bytes")]
    SecretKeyError,
    #[error("Invalid key size")]
    InvalidKeySize,
    #[error("Invalid seed length")]
    InvalidSeed,
}

#[wasm_bindgen]
pub struct Bip44 {
    seed: [u8; 64],
}

#[wasm_bindgen]
pub struct Key {
    bytes: [u8; 32],
}

/// A 32 byte ed25519 key
#[wasm_bindgen]
impl Key {
    #[wasm_bindgen(constructor)]
    pub fn new(bytes: Vec<u8>) -> Result<Key, String> {
        let bytes: [u8; 32] = match bytes.try_into() {
            Ok(bytes) => bytes,
            Err(err) => return Err(format!("{}: {:?}", Bip44Error::InvalidKeySize, err)),
        };

        Ok(Key {
            bytes,
        })
    }

    pub fn to_bytes(&self) -> Vec<u8> {
        Vec::from(self.bytes)
    }

    pub fn to_hex(&self) -> String {
        let bytes: &[u8] = &self.bytes;
        hex::encode(&bytes)
    }

    pub fn to_base64(&self) -> String {
        let bytes: &[u8] = &self.bytes;
        base64::encode(&bytes)
    }
}

/// An ed25519 keypair
#[wasm_bindgen]
pub struct Keypair {
    private: Key,
    public: Key,
}

#[wasm_bindgen]
impl Keypair {
    pub fn private(&self) -> Key {
        Key { bytes: self.private.bytes }
    }

    pub fn public(&self) -> Key {
        Key { bytes: self.public.bytes }
    }
}

/// Extended keys (Xpriv and Xpub)
#[wasm_bindgen]
pub struct ExtendedKeypair {
    xprv: Vec<u8>,
    xpub: Vec<u8>,
}

#[wasm_bindgen]
impl ExtendedKeypair {
    #[wasm_bindgen(constructor)]
    pub fn new (seed: Vec<u8>, path: Option<String>) -> Result<ExtendedKeypair, String> {
        let seed: &[u8] = &seed;
        let xprv = match path {
            Some(path) => {
                let path = &path
                    .parse()
                    .map_err(|err| format!("{}: {:?}", Bip44Error::PathError, err));
                let derivation_path = match path {
                    Ok(derivation_path) => derivation_path,
                    Err(error) => return Err(error.to_string()),
                };
                XPrv::derive_from_path(&seed, derivation_path)
            },
            None => XPrv::new(seed),
        }.map_err(|err| format!("{}: {:?}", Bip44Error::DerivationError, err))?;

        // BIP32 Extended Private Key
        let xprv_str = xprv.to_string(Prefix::XPRV).to_string();
        let xprv_bytes = xprv_str.as_bytes();

        // BIP32 Extended Public Key
        let xpub = xprv.public_key();
        let xpub_str = xpub.to_string(Prefix::XPUB);
        let xpub_bytes = xpub_str.as_bytes();

        Ok(ExtendedKeypair {
            xprv: Vec::from(xprv_bytes),
            xpub: Vec::from(xpub_bytes),
        })
    }

    pub fn private (&self) -> Vec<u8> {
        self.xprv.clone()
    }

    pub fn public (&self) -> Vec<u8> {
        self.xpub.clone()
    }
}

/// A set of methods to derive keys from a BIP44 path
#[wasm_bindgen]
impl Bip44 {
    #[wasm_bindgen(constructor)]
    pub fn new(seed: Vec<u8>) -> Result<Bip44, String> {
        let seed: [u8; 64] = match seed.try_into() {
            Ok(seed) => seed,
            Err(err) => return Err(format!("{}: {:?}", Bip44Error::InvalidSeed, err)),
        };

        Ok(Bip44 {
            seed,
        })
    }

    /// Get private key from seed
    pub fn get_private_key(&self) -> Result<Vec<u8>, String> {
        let xprv = match XPrv::new(&self.seed) {
            Ok(xprv) => xprv,
            Err(_) => return Err(Bip44Error::DerivationError.to_string()),
        };

        Ok(Vec::from(xprv.to_string(Prefix::XPRV).as_bytes()))
    }

    /// Derive account from a seed and a path
    pub fn derive(&self, path: String) -> Result<Keypair, String> {
        // BIP32 Extended Private Key
        let path = path.parse()
            .map_err(|err| format!("{}: {:?}", Bip44Error::PathError, err))?;
        let xprv = XPrv::derive_from_path(&self.seed, &path)
            .map_err(|_| Bip44Error::DerivationError.to_string())?;

        let prv_bytes: &[u8] = &xprv.private_key().to_bytes();

        // ed25519 keypair
        let secret_key = ed25519_dalek::SecretKey::from_bytes(prv_bytes)
            .map_err(|_| Bip44Error::SecretKeyError.to_string())?;
        let public_key = ed25519_dalek::PublicKey::from(&secret_key);

        let private  = Key::new(Vec::from(secret_key.to_bytes()))?;
        let public = Key::new(Vec::from(public_key.to_bytes()))?;

        Ok(Keypair {
            private,
            public,
        })
    }

    /// Get extended keys from path
    pub fn get_extended_keys(&self, path: Option<String>) -> Result<ExtendedKeypair, String> {
        let seed: &[u8] = &self.seed;
        let extended_keys = ExtendedKeypair::new(Vec::from(seed), path)?;
        Ok(extended_keys)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::crypto::mnemonic::{Mnemonic, PhraseSize};

    #[test]
    fn can_derive_keys_from_path() {
        let phrase = "caught pig embody hip goose like become worry face oval manual flame \
                      pizza steel viable proud eternal speed chapter sunny boat because view bullet";
        let mnemonic = Mnemonic::from_phrase(phrase.into()).expect("Should not fail with a valid phrase!");
        let seed = mnemonic.to_seed(None).unwrap();
        let bip44: Bip44 = Bip44::new(seed).unwrap();
        let path = "m/44'/0'/0'/0'";

        let keys = bip44.derive(path.to_string()).expect("Should derive keys from a path");

        assert_eq!(keys.private.to_bytes().len(), 32);
        assert_eq!(keys.public.to_bytes().len(), 32);

        let secret_b64 = keys.private.to_base64();
        assert_eq!(secret_b64, "Vo2w1c+HJCnw9PKFDzY3b2qxtecrNVzY8W45JamjSyA=");

        let secret_hex = keys.private.to_hex();
        assert_eq!(secret_hex, "568db0d5cf872429f0f4f2850f36376f6ab1b5e72b355cd8f16e3925a9a34b20");

        let public_b64 = keys.public.to_base64();
        assert_eq!(public_b64, "1AXzLxbjJp5IUxgrZ/ZYSj0qsKRPNLrpw35y537NhtI=");

        let public_hex = keys.public.to_hex();
        assert_eq!(public_hex, "d405f32f16e3269e4853182b67f6584a3d2ab0a44f34bae9c37e72e77ecd86d2");
    }

    #[test]
    #[should_panic]
    fn invalid_seed_should_panic() {
        let _bip44 = Bip44::new(vec![0, 1, 2, 3, 4]).unwrap();
    }

    #[test]
    #[should_panic]
    fn invalid_key_should_panic() {
        let _key = Key::new(vec![0, 1, 2, 3, 4]).unwrap();
    }

    #[test]
    #[should_panic]
    fn invalid_derivation_path_should_panic() {
        let m = Mnemonic::new(PhraseSize::Twelve).expect("New mnemonic should not fail");
        let seed = m.to_seed(None).expect("Mnemonic to seed should not fail");
        let b = Bip44::new(seed).expect("Bip44 from seed should not fail");

        let bad_path = "m/44/0 '/ 0";
        let _keypair = b.derive(bad_path.to_string()).unwrap();
    }
}
