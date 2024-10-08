use crate::{
    structs::*,
    constants::BASIC_RUST_LESSONS,
};
use rusqlite::{params, Connection, Error as SqliteErr, OptionalExtension, Result as SqliteResult};
use std::{
    fs::{create_dir_all, remove_dir_all},
    path::PathBuf,
};

pub struct DB {
    pub db_dir: PathBuf,
    pub sql_db: PathBuf,
}

impl DB {
    pub fn new(db_dir: PathBuf) -> Self {
        let sql_db = db_dir.join("db.db");
        Self { db_dir, sql_db }
    }

    pub fn connect(&self) -> SqliteResult<Connection, SqliteErr> {
        Connection::open(&self.sql_db)
    }

    fn create_settings_table(&self) -> SqliteResult<(), SqliteErr> {
        let connection = self.connect()?;

        connection.execute(
            "CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                value TEXT UNIQUE NOT NULL,
                component_type TEXT NOT NULL,
                possible_values TEXT
            )",
            [],
        )?;

        connection.execute(
            "INSERT INTO settings (name, value, component_type) 
            VALUES ('user_name', 'User', 'input')",
            []
        )?;

        let mut stmt = connection.prepare(
            "INSERT INTO settings (name, value, component_type, possible_values) 
            VALUES (?, ?, ?, ?)",
        )?;

        let settings_to_insert = vec![
            ("notifications", "on", "checkbox", "on,off"),
            ("lang", "en", "select", "en,ru,ua,pl"),
            ("theme", "light", "select", "light,dark"),
        ];

        for setting in settings_to_insert {
            stmt.execute([setting.0, setting.1, &setting.2.to_string(), setting.3])?;
        }

        Ok(())
    }

    fn create_lessons_table(&self) -> SqliteResult<()> {
        let connection = self.connect()?;

        connection.execute(
            "CREATE TABLE IF NOT EXISTS lessons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                theme TEXT NOT NULL,
                explanation TEXT,
                questions_ids TEXT,
                notes_ids TEXT,
                started_at INTEGER,
                finished_at INTEGER
            )",
            [],
        )?;

        let mut stmt = connection.prepare(
            "INSERT OR IGNORE INTO lessons (theme) 
            VALUES (?)",
        )?;

        for lesson in BASIC_RUST_LESSONS.iter() {
            stmt.execute([lesson])?;
        }

        Ok(())
    }

    fn create_questions_table(&self) -> SqliteResult<(), SqliteErr> {
        self.connect()?.execute(
            "CREATE TABLE IF NOT EXISTS questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lesson_id INTEGER NOT NULL,
                user_question TEXT NOT NULL,
                tutor_answer TEXT NOT NULL,
                timestamp INTEGER
            )",
            [],
        )?;

        Ok(())
    }

    fn create_notes_table(&self) -> SqliteResult<(), SqliteErr> {
        self.connect()?.execute(
            "CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lesson_id INTEGER NOT NULL,
                text TEXT NOT NULL,
                edited_at INTEGER
            )",
            [],
        )?;

        Ok(())
    }

    pub fn setup_db(&self, is_dev: bool) -> SqliteResult<()> {
        if is_dev {
            if self.db_dir.exists() {
                remove_dir_all(&self.db_dir);
            }
        }

        if !self.db_dir.exists() {
            create_dir_all(&self.db_dir);

            self.create_settings_table().unwrap_or_else(|e| {
                println!("Failed to create settings table: {}", e);
            });
            self.create_lessons_table().unwrap_or_else(|e| {
                println!("Failed to create lessons table: {}", e);
            });
            self.create_questions_table().unwrap_or_else(|e| {
                println!("Failed to create questions table: {}", e);
            });
            self.create_notes_table().unwrap_or_else(|e| {
                println!("Failed to create notes table: {}", e);
            });
        }

        Ok(())
    }
    
    // Settings methods
    pub fn read_settings(&self) -> SqliteResult<Vec<Setting>> {
        let conn = self.connect()?;
        let mut stmt = conn.prepare("SELECT * FROM settings")?;
        let settings_iter = stmt.query_map([], |row| Setting::from_row(row))?;
    
        let mut settings = vec![];
        for setting in settings_iter {
            settings.push(setting?);
        }
    
        SqliteResult::Ok(settings)
    }

    pub fn read_setting(&self, setting_name: &str) -> SqliteResult<String> {
        let conn = self.connect()?;
        let setting_value: String = conn.query_row(
            format!("SELECT value FROM settings WHERE name = '{}'", setting_name).as_str(),
            [],
            |row| {
                row.get(0)
            }
        )?;

        SqliteResult::Ok(setting_value)
    }

    pub fn update_setting(&self, setting: &Setting) -> SqliteResult<()> {
        let conn = self.connect()?;
        conn.execute(
            "UPDATE settings SET value = ? WHERE name = ?",
            params![setting.value, setting.name],
        )?;

        SqliteResult::Ok(())
    }

    // Lesson methods
    pub fn create_lesson(&self, lesson: &Lesson) -> SqliteResult<i64> {
        let conn = self.connect()?;
        conn.execute(
            "INSERT INTO lessons (theme, explanation, questions_ids, notes_ids, started_at, finished_at) 
            VALUES (?, ?, ?, ?, ?, ?)",
            params![lesson.theme, lesson.explanation, lesson.questions_ids, lesson.notes_ids, 
                    lesson.started_at, lesson.finished_at],
        )?;
        Ok(conn.last_insert_rowid())
    }

    pub fn read_lesson(&self, id: usize) -> SqliteResult<Lesson> {
        let conn = self.connect()?;
        let mut stmt = conn.prepare(
            "SELECT id, theme, explanation, questions_ids, notes_ids, started_at, finished_at 
            FROM lessons WHERE id = ?"
        )?;
        let lesson = stmt.query_row(params![id], |row| {
            Ok(Lesson {
                id: row.get(0)?,
                theme: row.get(1)?,
                explanation: row.get(2)?,
                questions_ids: row.get(3)?,
                notes_ids: row.get(4)?,
                started_at: row.get(5)?,
                finished_at: row.get(6)?,
            })
        }).optional()?;

        SqliteResult::Ok(lesson.unwrap())
    }

    pub fn update_lesson(&self, lesson: &Lesson) -> SqliteResult<()> {
        let conn = self.connect()?;
        conn.execute(
            "UPDATE lessons SET theme = ?, explanation = ?, questions_ids = ?, notes_ids = ?, 
            started_at = ?, finished_at = ? WHERE id = ?",
            params![
                lesson.theme,
                lesson.explanation,
                lesson.questions_ids,
                lesson.notes_ids,
                lesson.started_at,
                lesson.finished_at,
                lesson.id
            ],
        ).unwrap();
        Ok(())
    }

    // Question methods
    pub fn create_question(&self, question: &mut Question) -> SqliteResult<Question> {
        let conn = self.connect()?;
        conn.execute(
            "INSERT INTO questions (lesson_id, user_question, tutor_answer, timestamp) 
            VALUES (?, ?, ?, ?)",
            params![question.lesson_id, question.user_question, question.tutor_answer, question.timestamp],
        )?;
        question.id = conn.last_insert_rowid() as usize;

        let mut lesson = self.read_lesson(question.lesson_id).unwrap();

        if lesson.questions_ids.is_none() {
            lesson.questions_ids = Some(question.id.to_string());
        } else {
            lesson.questions_ids = Some(format!("{},{}", lesson.questions_ids.unwrap(), question.id));
        }
        
        self.update_lesson(&lesson).unwrap();

        SqliteResult::Ok(question.clone())
    }

    pub fn read_question(&self, id: usize) -> SqliteResult<Question> {
        let conn = self.connect()?;

        conn.query_row(
            format!("SELECT * FROM questions WHERE id = {}", id).as_str(), 
            [], 
            |row| Question::from_row(row)
        )
    }

    // Note methods
    pub fn create_note(&self, note: &mut Note) -> SqliteResult<Note> {
        let conn = self.connect()?;
        conn.execute(
            "INSERT INTO notes (lesson_id, text, edited_at) 
            VALUES (?, ?, ?)",
            params![note.lesson_id, note.text, note.edited_at],
        )?;
        note.id = conn.last_insert_rowid() as usize;

        let mut lesson = self.read_lesson(note.lesson_id).unwrap();

        if lesson.notes_ids.is_none() {
            lesson.notes_ids = Some(note.id.to_string());
        } else {
            lesson.notes_ids = Some(format!("{},{}", lesson.notes_ids.unwrap(), note.id));
        }
        
        self.update_lesson(&lesson).unwrap();

        SqliteResult::Ok(note.clone())
    }

    pub fn read_note(&self, id: usize) -> SqliteResult<Note> {
        let conn = self.connect()?;

        conn.query_row(
            format!("SELECT * FROM notes WHERE id = {}", id).as_str(), 
            [], 
            |row| Note::from_row(row)
        )
    }

    pub fn update_note(&self, id: usize, text: String, edited_at: usize) -> SqliteResult<()> {
        let conn = self.connect()?;
        conn.execute(
            "UPDATE notes SET text = ?, edited_at = ? WHERE id = ?",
            params![text, edited_at, id],
        )?;

        Ok(())
    }

    pub fn delete_note(&self, id: usize) -> SqliteResult<()> {
        let conn = self.connect()?;
        conn.execute("DELETE FROM notes WHERE id = ?", params![id])?;
        Ok(())
    }
}

