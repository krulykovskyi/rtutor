use crate::{
    app_state::AppState,
    functions::{explain_lesson_theme, get_lessons_list},
    structs::{Lesson, Setting},
};
use serde_json::Value;

#[tauri::command]
pub fn get_startup_data(state: tauri::State<AppState>) -> Result<Value, String> {
    let settings = state.db.read_settings().unwrap();
    let lessons_list = get_lessons_list(&state.db).unwrap();

    Ok(serde_json::json!({
        "settings": settings,
        "lessonsList": lessons_list,
        "currentLessonId": Value::Null,
    }))
}

#[tauri::command]
pub async fn get_lesson<'a>(
    state: tauri::State<'a, AppState>,
    lesson_id: usize,
) -> Result<Lesson, String> {
    let mut lesson = state.db.read_lesson(lesson_id).unwrap();

    if lesson.explanation.is_none() {
        explain_lesson_theme(&state.db, &mut lesson).await.unwrap();
    }

    Ok(lesson)
}

#[tauri::command]
pub fn update_settings(state: tauri::State<AppState>, settings: String) -> Result<(), String> {
    let settings: Vec<Setting> = serde_json::from_str(settings.as_str()).unwrap();

    settings.iter().for_each(|setting| {
        state.db.update_setting(setting).unwrap();
    });

    Ok(())
}
