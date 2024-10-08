use crate::{
    db::DB,
    structs::{Lesson, LessonsList, LessonsListItem, Question},
};
use openai::chat::{ChatCompletion, ChatCompletionMessage, ChatCompletionMessageRole};
use rusqlite::Result as SqliteResult;
use std::time::{SystemTime, UNIX_EPOCH};

pub fn get_lessons_list(db: &DB) -> SqliteResult<LessonsList> {
    let conn = db.connect()?;
    let mut stmt = conn.prepare("SELECT id, theme, started_at, finished_at FROM lessons")?;
    let lessons_iter = stmt.query_map([], |row| LessonsListItem::from_row(row))?;

    let mut lessons_list = vec![];
    for lesson_list_item in lessons_iter {
        lessons_list.push(lesson_list_item?);
    }

    SqliteResult::Ok(lessons_list)
}

pub async fn explain_lesson_theme(db: &DB, lesson: &mut Lesson) -> Result<String, String> {
    let question = match db.read_setting("lang").unwrap().as_str() {
        "ua" => format!(
            "Детально поясни тему \"{}\" в мові програмування Rust українською мовою",
            lesson.theme
        ),
        "en" => format!(
            "Explain the theme \"{}\" in the Rust programming language in details, in English",
            lesson.theme
        ),
        "pl" => format!(
            "Wyjaśnij temat \"{}\" w języku programowania Rust w szczegółach, po polsku",
            lesson.theme
        ),
        "ru" => format!(
            "Подробно объясни тему \"{}\" на языке программирования Rust, на русском языке",
            lesson.theme
        ),
        _ => return Err("Unsupported language".to_string()),
    };
    let answer = call_openai_api(question).await;
    let started_at = get_timestamp_secs();

    lesson.explanation = Some(answer.clone());
    lesson.started_at = Some(started_at);

    db.update_lesson(lesson).unwrap();

    Ok(format!("{}", answer))
}

pub async fn answer_question(
    db: &DB,
    lesson_id: usize,
    user_question: &String,
) -> Result<Question, String> {
    let tutor_answer = call_openai_api(user_question.clone()).await;
    let mut question = Question {
        id: 0,
        lesson_id,
        user_question: user_question.clone(),
        tutor_answer,
        timestamp: get_timestamp_secs(),
    };

    question = db.create_question(&mut question).unwrap();

    Ok(question)
}

pub async fn call_openai_api(message: String) -> String {
    let messages: Vec<ChatCompletionMessage> = vec![
        ChatCompletionMessage {
            role: ChatCompletionMessageRole::System,
            content: Some(
                "
            Ты репетитор по языку программирования Rust.
            Ты отвечаешь коротко и детально разбираешь вопрос.
            Ты определяешь язык на котором был задан вопрос и отвечаешь на том же языке.
            Ты всегда используешь самую актуальную документацию.
            Ты приводишь примеры по сути вопроса."
                    .to_string(),
            ),
            name: None,
            function_call: None,
        },
        ChatCompletionMessage {
            role: ChatCompletionMessageRole::User,
            content: Some(message),
            name: None,
            function_call: None,
        },
    ];

    let chat_completion = ChatCompletion::builder("gpt-3.5-turbo", messages.clone())
        .create()
        .await
        .unwrap();

    let returned_message = chat_completion.choices.first().unwrap().message.clone();

    returned_message.content.clone().unwrap().trim().to_string()
}

pub fn get_timestamp_secs() -> usize {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs() as usize
}
