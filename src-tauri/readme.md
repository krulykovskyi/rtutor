(EXAMPLE DOC FILE)

# Rust Backend с JSON-базой данных

Этот проект представляет собой бэкенд на Rust, который взаимодействует с базой данных, реализованной в виде JSON-файлов. Система предназначена для управления уроками, вопросами и заметками.

## Структура данных

Наша база данных состоит из трех основных типов данных:

### Урок (Lesson)

```rust
struct Lesson {
    id: Option<String>,
    questions: Option<Vec<Question>>,
    notes: Option<Vec<Note>>,
}
```

### Вопрос (Question)

```rust
struct Question {
    lesson_id: Option<String>,
    user_question: String,
    tutor_answer: Option<String>,
    timestamp: u64,
}
```

### Заметка (Note)

```rust
struct Note {
    lesson_id: Option<String>,
    text: String,
    timestamp: u64,
}
```

## Взаимодействие с базой данных

Наш бэкенд использует библиотеку `serde_json` для сериализации и десериализации данных в формат JSON. Каждый тип данных хранится в отдельном JSON-файле.

### Чтение данных

Для чтения данных из JSON-файлов используется следующий подход:

```rust
use std::fs::File;
use std::io::BufReader;
use serde_json::from_reader;

fn read_lessons() -> Result<Vec<Lesson>, std::io::Error> {
    let file = File::open("lessons.json")?;
    let reader = BufReader::new(file);
    let lessons: Vec<Lesson> = from_reader(reader)?;
    Ok(lessons)
}
```

### Запись данных

Для записи данных в JSON-файлы используется следующий подход:

```rust
use std::fs::File;
use std::io::Write;
use serde_json::to_string_pretty;

fn write_lessons(lessons: &Vec<Lesson>) -> Result<(), std::io::Error> {
    let json = to_string_pretty(lessons)?;
    let mut file = File::create("lessons.json")?;
    file.write_all(json.as_bytes())?;
    Ok(())
}
```

## API эндпоинты

Наш бэкенд предоставляет следующие API эндпоинты:

- `GET /lessons`: Получить список всех уроков
- `GET /lessons/{id}`: Получить конкретный урок по ID
- `POST /lessons`: Создать новый урок
- `PUT /lessons/{id}`: Обновить существующий урок
- `DELETE /lessons/{id}`: Удалить урок

- `GET /questions`: Получить список всех вопросов
- `POST /questions`: Создать новый вопрос
- `PUT /questions/{id}`: Обновить существующий вопрос

- `GET /notes`: Получить список всех заметок
- `POST /notes`: Создать новую заметку
- `PUT /notes/{id}`: Обновить существующую заметку

## Запуск проекта

1. Убедитесь, что у вас установлен Rust и Cargo.
2. Клонируйте репозиторий: `git clone https://github.com/your-username/your-repo.git`
3. Перейдите в директорию проекта: `cd your-repo`
4. Запустите сервер: `cargo run`

Сервер будет доступен по адресу `http://localhost:8080`.
