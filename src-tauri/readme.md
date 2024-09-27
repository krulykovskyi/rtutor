# Rust Backend with JSON files database

## Files structure

system-related-root-folder/db
-> /settings.json
-> /lessons_list.json
-> /lessons
-> /0.json
-> /1.json
-> ...

## Data structures:

Database consists of five data types, each type can be serialized and deserialized regarding to serde_json crate

### Settings (stores in setting.json)

```rust
pub struct Settings {
    lang: String,
    theme: String,
}
```

### LessonsList (stores in lessons_list.json, used for menu sidebar and progress tracking)

```rust
type LessonsList = Vec<LessonsListItem>;

struct LessonsListItem {
    id: String, // Basic lessons IDs is just an index of BASIC_RUST_LESSONS constant
                // IDs of lessons created by user is a uuid v4 string
    title: String,
    completed: bool,
}
```

### Lesson (stores in folder system-related-root-folder/db/lessons in separate file for each lesson)

```rust
struct Lesson {
    id: String, // Basic lessons IDs is just an index of BASIC_RUST_LESSONS constant
                // IDs of lessons created by user is a uuid v4 string
    theme: String, // Title from LessonsList
    questions: Vec<Question>,
    notes: Vec<Note>,
}
```

### Question (stores like lesson data)

```rust
struct Question {
    lesson_id: String,
    user_question: String,
    tutor_answer: String,
    timestamp: u128,
}
```

### Note (stores like lesson data)

```rust
struct Note {
    lesson_id: String,
    text: String,
    timestamp: u128,
}
```

## Interacting with the database

...

### Reading data

...

### Writing data

...

## Run project

...

1.
2.
3.
4.
