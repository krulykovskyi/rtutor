use std::{collections::HashMap, path::PathBuf};

pub struct AppState {
    pub db_dir: PathBuf,
    pub db_files_paths: HashMap<String, PathBuf>,
}

impl AppState {
    pub fn new(db_dir: PathBuf) -> Self {
        let mut db_files_paths = HashMap::new();

        db_files_paths.insert("settings".to_string(), db_dir.join("settings.json"));
        db_files_paths.insert("lessons_list".to_string(), db_dir.join("lessons_list.json"));
        db_files_paths.insert("lessons".to_string(), db_dir.join("lessons.json"));
        db_files_paths.insert("notes".to_string(), db_dir.join("notes.json"));

        Self {
            db_dir,
            db_files_paths,
        }
    }
}
