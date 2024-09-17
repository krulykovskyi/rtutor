use openai::chat::{ChatCompletion, ChatCompletionMessage, ChatCompletionMessageRole};
use serde_json::to_string;
use std::{
    fs::{create_dir_all, read_to_string, File},
    io::{Result, Write},
    path::PathBuf,
};

use crate::{
    app_state::AppState,
    lessons_list::{LessonsList, LessonsListItem, BASIC_RUST_LESSONS},
    settings::Settings,
};

pub fn setup_db(state: &AppState) -> Result<()> {
    let db_dir = &state.db_dir;
    let db_files_paths = &state.db_files_paths;

    if !db_dir.exists() {
        create_dir_all(&db_dir).expect("Не удалось создать директорию базы данных");

        db_files_paths
            .iter()
            .for_each(|(filename, path)| match filename.as_str() {
                "settings" => {
                    let mut file = File::create(path).expect("Не удалось создать файл настроек");
                    let initial_settings = Settings {
                        lang: String::from("en"),
                        theme: String::from("dark"),
                    };
                    let json_data = to_string(&initial_settings).unwrap();

                    file.write_all(json_data.as_bytes()).unwrap();
                }
                "lessons_list" => {
                    let mut file =
                        File::create(path).expect("Не удалось создать файл списка уроков");
                    let initial_lessons_list: LessonsList = BASIC_RUST_LESSONS
                        .iter()
                        .enumerate()
                        .map(|(index, title)| LessonsListItem {
                            id: index.to_string(),
                            title: title.to_string(),
                            completed: false,
                        })
                        .collect();
                    let json_data = to_string(&initial_lessons_list).unwrap();

                    file.write_all(json_data.as_bytes()).unwrap();
                }
                _ => {
                    // Create empty file
                    let mut file = File::create(path)
                        .expect(("Не удалось создать файл".to_string() + filename).as_str());

                    file.write_all("{}".as_bytes()).unwrap();
                }
            });

        Ok(())
    } else {
        Ok(())
    }
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
            Ты всегда используешь самую актуальную документацию"
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
