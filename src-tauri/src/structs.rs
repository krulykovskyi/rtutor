use rusqlite::{Result as RusqliteResult, Row};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Setting {
    pub id: usize,
    pub name: String,
    pub value: String,
    pub component_type: String,
    pub possible_values: Option<String>,
}

impl Setting {
    pub fn from_row(row: &Row) -> RusqliteResult<Setting> {
        Ok(Setting {
            id: row.get(0)?,
            name: row.get(1)?,
            value: row.get(2)?,
            component_type: row.get(3)?,
            possible_values: row.get_unwrap(4),
        })
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Lesson {
    pub id: usize,
    pub theme: String,
    pub explanation: Option<String>,
    pub questions_ids: Option<String>,
    pub notes_ids: Option<String>,
    pub started_at: Option<usize>,
    pub finished_at: Option<usize>,
}

pub type LessonsList = Vec<LessonsListItem>;

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct LessonsListItem {
    pub id: usize,
    pub theme: String,
    pub started_at: Option<usize>,
    pub finished_at: Option<usize>,
}

impl LessonsListItem {
    pub fn from_row(row: &Row) -> RusqliteResult<LessonsListItem> {
        Ok(LessonsListItem {
            id: row.get(0)?,
            theme: row.get(1)?,
            started_at: row.get(2)?,
            finished_at: row.get(3)?,
        })
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Question {
    pub id: usize,
    pub lesson_id: usize,
    pub user_question: String,
    pub tutor_answer: String,
    pub timestamp: usize,
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Note {
    pub id: usize,
    pub lesson_id: usize,
    pub text: String,
    pub edited_at: usize,
}
