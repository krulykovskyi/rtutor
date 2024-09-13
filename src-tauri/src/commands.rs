use crate::app_state::AppState;
use crate::functions::{call_openai_api, read_db_file};
use serde_json::Value;

#[tauri::command]
pub fn get_startup_data(state: tauri::State<AppState>) -> Result<Value, String> {
    let data_dir = state.data_dir.clone();
    let data = read_db_file(data_dir, "settings".to_string()).unwrap();
    let mut startup_data: Value = serde_json::from_str(&data).unwrap();

    startup_data["lessonsList"] = Value::Array(vec![]);
    startup_data["currentLesson"] = Value::Null;

    Ok(startup_data)
}

#[tauri::command]
pub async fn reply<'a>(state: tauri::State<'a, AppState>, question: String) -> Result<String, String> {
    let answer = call_openai_api(question).await;
    Ok(format!("{}", answer))
}
