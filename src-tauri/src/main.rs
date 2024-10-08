// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenvy::dotenv;
use openai::{set_base_url, set_key};
use rtutor::{app_state::AppState, commands, db::DB};
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

            let db = DB::new(app_dir.join(db_dirname));

            db.setup_db(true).unwrap();

            let state = AppState { db };

            app.manage(state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_startup_data,
            commands::get_lesson,
            commands::update_settings,
            commands::ask_question,
            commands::get_questions,
            commands::create_note,
            commands::get_notes,
            commands::edit_note,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
