use crate::utils;
use namada::proto;

pub struct Tx(pub(crate) proto::Tx);

impl Tx {
    pub fn to_proto(tx_code: Vec<u8>, data: &Vec<u8>) -> proto::Tx {
        proto::Tx {
            code: tx_code,
            data: Some(data.to_owned()),
            timestamp: utils::get_timestamp(),
        }
    }
}
