use gloo_utils::format::JsValueSerdeExt;
use js_sys::Uint8Array;
use log::info;
use log::Level;
use serde::Serialize;
use std::fmt::Debug;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
}

#[allow(dead_code)]
pub fn console_log(string: &str) {
    log(string);
}

#[allow(dead_code)]
pub fn console_log_any<T: Debug>(string: &T) {
    log(format!("{:?}", string).as_str());
}

pub fn to_bytes(u_int_8_array: JsValue) -> Vec<u8> {
    let array = Uint8Array::new(&u_int_8_array);
    array.to_vec()
}

/// Maps a result to a JsValue using Serde and Error into a JsError
///
/// # Arguments
///
/// * `result` - The result to map
pub fn to_js_result<T>(result: T) -> Result<JsValue, JsError>
where
    T: Serialize,
{
    match JsValue::from_serde(&result) {
        Ok(v) => Ok(v),
        Err(e) => Err(JsError::new(&e.to_string())),
    }
}

#[cfg(feature = "dev")]
pub fn set_panic_hook() {
    web_sys::console::log_1(&"Set panic hook".into());
    console_error_panic_hook::set_once();
}

#[cfg(not(feature = "dev"))]
pub fn set_panic_hook() {}

// pub fn generate_array(max_value: u64, step: Option<u64>, min_value: Option<u64>) -> Vec<u64> {
//     console_log::init_with_level(Level::Info);
//     let mut result = Vec::new();
//     let default_index = 1;
//     let default_step = 200;
//     let min_value = min_value.unwrap_or(default_index);

//     if min_value > max_value {
//         return Vec::new();
//     }
//     info!("step before {:?}", step);

//     let step = step.unwrap_or(default_step);
//     info!("step after {}", step);

//     for i in (min_value..max_value).step_by(step as usize) {
//         result.push(i);
//     }
//     info!("result {:#?}", result);

//     if let Some(last_index) = result.iter().rposition(|&x| x <= max_value) {
//         result[last_index] = max_value;
//     }
//     info!("result {:#?}", result);

//     result
// }


pub fn generate_array(max_value: u64, step: Option<u64>, min_value: Option<u64>) -> Vec<u64> {
    let mut result = Vec::new();
    let default_index = 1;
    let default_step = 200;

    let min_value = min_value.unwrap_or(default_index);
    let step = step.unwrap_or(default_step);

    if min_value > max_value {
        return Vec::new();
    }

    let mut i = min_value;
    while i < max_value {
        result.push(i);
        i += step;
    }

    let len = result.len(); // Store the length in a separate variable

    if len > 0 && result[len - 1] > max_value {
        result[len - 1] = max_value;
    }

    result
}