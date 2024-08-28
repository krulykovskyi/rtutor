// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenvy::dotenv;
use openai::{ set_base_url, set_key };
use rtutor::call_openai_api;
use std::env;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn reply(question: String) -> String {
    let answer = call_openai_api(question).await;
    format!("{}", answer)
}

fn main() {
    dotenv().unwrap();
    set_key(env::var("OPENAI_KEY").unwrap());
    set_base_url(env::var("OPENAI_BASE_URL").unwrap_or_default());

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![reply])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
