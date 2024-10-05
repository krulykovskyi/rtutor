use crate::db::DB;

pub struct AppState {
    pub db: DB,
}

impl AppState {
    pub fn new(db: DB) -> Self {
        Self { db }
    }
}
