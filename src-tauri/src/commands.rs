use crate::app_state::AppState;
use crate::functions::{call_openai_api, read_db_file};
use serde_json::Value;
use std::fs::File;
use std::{fs, io::Write};

#[tauri::command]
pub fn get_startup_data(state: tauri::State<AppState>) -> Result<Value, String> {
    let settings: Value = read_db_file("settings", &state).unwrap();
    let lessons_list: Value = read_db_file("lessons_list", &state).unwrap();
    let mut startup_data: Value = Value::Object(serde_json::Map::new());

    startup_data["settings"] = settings;
    startup_data["lessonsList"] = lessons_list;
    startup_data["currentLessonId"] = Value::Null;

    Ok(startup_data)
}

#[tauri::command]
pub fn update_settings(state: tauri::State<AppState>, settings: String) -> Result<String, String> {
    let settings_path = state
        .db_files_paths
        .get("settings")
        .ok_or("Settings path not found")?;

    fs::remove_file(settings_path).unwrap();

    let mut file = File::create(settings_path).expect("Не удалось создать файл настроек");

    file.write_all(settings.as_bytes()).unwrap();

    Ok(String::from("Settings updated successfully"))
}

#[tauri::command]
pub async fn reply<'a>(
    state: tauri::State<'a, AppState>,
    question: String,
) -> Result<String, String> {
    let answer = call_openai_api(question).await;
    Ok(format!("{}", answer))
}
