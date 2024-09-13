use openai::chat::{ChatCompletion, ChatCompletionMessage, ChatCompletionMessageRole};
use std::{fs::{create_dir_all, read_to_string, File}, io::{ Result, Write }, path::PathBuf};
use serde_json::to_string;

use crate::settings::Settings;

pub fn setup_db(app_dir: &PathBuf, db_dirname: &String) -> Result<()> {
    let db_dirpath = app_dir.join(db_dirname);

    if !db_dirpath.exists() {
        create_dir_all(&db_dirpath)
            .expect("Не удалось создать директорию базы данных");

        let mut file = File::create(db_dirpath.join("settings.json"))
            .expect("Не удалось создать файл настроек");
        let initial_settings = Settings {
            lang: String::from("en"),
            theme: String::from("dark"),
        };      
        let json_data = to_string(&initial_settings).unwrap();

        file.write_all(json_data.as_bytes())?;

        Ok(())
    } else {
        Ok(())
    }
}

pub fn read_db_file(app_dir: PathBuf, filename: String) -> Result<String> {
    let file_path = app_dir.join(&(filename.clone() + ".json"));

    match filename.as_str() {
        "settings" => {
            let settings = read_to_string(file_path)?;
            Ok(settings)
        },
        _ => Err(std::io::Error::new(std::io::ErrorKind::Other, "Unknown db filename"))
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
