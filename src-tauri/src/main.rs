// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenvy::dotenv;
use openai::{set_base_url, set_key};
use rtutor::{app_state::AppState, commands, functions::setup_db};
use std::env;
use tauri::Manager;

fn main() {
    dotenv().unwrap();
    set_key(env::var("OPENAI_KEY").unwrap());
    set_base_url(env::var("OPENAI_BASE_URL").unwrap());

    tauri::Builder::default()
        .setup(|app| {
            let app_dir = app
                .path_resolver()
                .app_data_dir()
                .expect("Не удалось получить директорию приложения");

            let db_dirname = env::var("DB_DIRNAME").unwrap();

            let state = AppState::new(app_dir.join(db_dirname));

            setup_db(&state);

            app.manage(state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![commands::get_startup_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
