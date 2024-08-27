use openai::chat::{ChatCompletion, ChatCompletionMessage, ChatCompletionMessageRole};

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
