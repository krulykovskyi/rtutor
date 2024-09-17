use crate::app_state::AppState;
use crate::functions::call_openai_api;
use serde_json::Value;
use std::fs::read_to_string;

#[tauri::command]
pub fn get_startup_data(state: tauri::State<AppState>) -> Result<Value, String> {
    let settings_path = state
        .db_files_paths
        .get("settings")
        .ok_or("Settings path not found")?;
    let settings_string = read_to_string(settings_path).unwrap();
    let settings: Value = serde_json::from_str(&settings_string).unwrap();
    let mut startup_data: Value = Value::Object(serde_json::Map::new());
    startup_data["settings"] = settings;

    let lessons_list_path = state
        .db_files_paths
        .get("lessons_list")
        .ok_or("Lessons list path not found")?;
    let lessons_list_string = read_to_string(lessons_list_path).unwrap();
    let lessons_list: Value = serde_json::from_str(&lessons_list_string).unwrap();
    startup_data["lessonsList"] = lessons_list;

    startup_data["currentLessonId"] = Value::Null;

    Ok(startup_data)
}

#[tauri::command]
pub async fn reply<'a>(
    state: tauri::State<'a, AppState>,
    question: String,
) -> Result<String, String> {
    let answer = call_openai_api(question).await;
    Ok(format!("{}", answer))
}
