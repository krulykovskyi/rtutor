use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Lesson {
    pub id: String,
    pub theme: String,
    pub questions: Vec<Question>,
    pub notes: Vec<Note>,
}

impl Lesson {
    pub fn new(id: String, theme: String) -> Self {
        Self {
            id,
            theme,
            questions: Vec::new(),
            notes: Vec::new(),
        }
    }

    pub fn add_question(&mut self, user_question: String, tutor_answer: String, timestamp: u128) {
        self.questions.push(Question {
            lesson_id: self.id.clone(),
            user_question,
            tutor_answer,
            timestamp,
        });
    }

    pub fn add_note(&mut self, text: String, timestamp: u128) {
        self.notes.push(Note {
            lesson_id: self.id.clone(),
            text,
            timestamp,
        });
    }
}

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Question {
    pub lesson_id: String,
    pub user_question: String,
    pub tutor_answer: String,
    pub timestamp: u128,
}

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Note {
    pub lesson_id: String,
    pub text: String,
    pub timestamp: u128,
}
