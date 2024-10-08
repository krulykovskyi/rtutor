use crate::{
    app_state::AppState,
    functions::{answer_question, explain_lesson_theme, get_lessons_list, get_timestamp_secs},
    structs::{Lesson, Note, Question, Setting},
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

#[tauri::command]
pub fn get_questions(
    state: tauri::State<AppState>,
    questions_ids: String,
) -> Result<Vec<Question>, String> {
    if questions_ids.is_empty() {
        return Ok(vec![]);
    }

    let questions: Result<Vec<Question>, String> = questions_ids
        .split(',')
        .map(|id| {
            let id = id.parse::<usize>().map_err(|e| e.to_string())?;
            state.db.read_question(id).map_err(|e| e.to_string())
        })
        .collect();

    questions
}

#[tauri::command]
pub async fn ask_question<'a>(
    state: tauri::State<'a, AppState>,
    lesson_id: usize,
    user_question: String,
) -> Result<Question, String> {
    let question = answer_question(&state.db, lesson_id, &user_question)
        .await
        .unwrap();

    Ok(question)
}

#[tauri::command]
pub fn get_notes(state: tauri::State<AppState>, notes_ids: String) -> Result<Vec<Note>, String> {
    if notes_ids.is_empty() {
        return Ok(vec![]);
    }

    let notes: Result<Vec<Note>, String> = notes_ids
        .split(',')
        .map(|id| {
            let id = id.parse::<usize>().map_err(|e| e.to_string())?;
            state.db.read_note(id).map_err(|e| e.to_string())
        })
        .collect();

    notes
}

#[tauri::command]
pub fn create_note(
    state: tauri::State<AppState>,
    lesson_id: usize,
    text: String,
) -> Result<Note, String> {
    let mut note = Note {
        id: 0,
        lesson_id,
        text,
        edited_at: get_timestamp_secs(),
    };

    state.db.create_note(&mut note).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn edit_note(
    state: tauri::State<AppState>,
    note_id: usize,
    text: String,
) -> Result<Note, String> {
    state
        .db
        .update_note(note_id, text, get_timestamp_secs())
        .unwrap();

    Ok(state.db.read_note(note_id).unwrap())
}
