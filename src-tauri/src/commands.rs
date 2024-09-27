use crate::{
    app_state::AppState,
    functions::{call_openai_api, explain_lesson_theme},
    lesson::Lesson,
    settings::Settings,
};
use serde_json::Value;
use std::time::SystemTime;

#[tauri::command]
pub fn get_startup_data(state: tauri::State<AppState>) -> Result<Value, String> {
    let settings: Value = state.db.read_file("settings").unwrap();
    let lessons_list: Value = state.db.read_file("lessons_list").unwrap();
    let mut startup_data: Value = Value::Object(serde_json::Map::new());

    startup_data["settings"] = settings;
    startup_data["lessonsList"] = lessons_list;
    startup_data["currentLessonId"] = Value::Null;

    Ok(startup_data)
}

#[tauri::command]
pub fn update_settings(state: tauri::State<AppState>, settings: String) -> Result<String, String> {
    // Parse the settings string
    let new_settings: Settings =
        serde_json::from_str(&settings).map_err(|e| format!("Failed to parse settings: {}", e))?;

    // Update the database
    let db = &state.db;
    db.delete_file("settings")
        .map_err(|e| format!("Failed to delete old settings: {}", e))?;

    let settings_path = db
        .db_files_paths
        .get("settings")
        .ok_or_else(|| "Settings path not found".to_string())?;
    db.create_file(&settings_path, settings.clone())
        .map_err(|e| format!("Failed to create new settings file: {}", e))?;

    // Update the in-memory settings
    let mut current_settings = state
        .settings
        .lock()
        .map_err(|_| "Failed to lock settings mutex".to_string())?;
    *current_settings = new_settings;

    Ok(String::from("Settings updated successfully"))
}

#[tauri::command(rename_all = "camelCase")]
pub async fn get_lesson<'a>(
    state: tauri::State<'a, AppState>,
    lesson_id: String,
) -> Result<Value, String> {
    let mut lesson: Lesson = state.db.get_lesson(lesson_id);

    if lesson.questions.is_empty() {
        let explanation = explain_lesson_theme(state, lesson.theme.clone()).await;

        lesson.add_question(
            "".to_string(),
            explanation.unwrap(),
            SystemTime::now()
                .duration_since(SystemTime::UNIX_EPOCH)
                .unwrap()
                .as_millis(),
        );
    }

    let lesson_json = serde_json::to_value(&lesson).unwrap();

    Ok(lesson_json)
}

#[tauri::command]
pub async fn reply<'a>(
    state: tauri::State<'a, AppState>,
    question: String,
) -> Result<String, String> {
    let answer = call_openai_api(question).await;
    Ok(format!("{}", answer))
}
