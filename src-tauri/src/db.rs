use crate::{
    lesson::Lesson,
    lessons_list::{LessonsList, LessonsListItem, BASIC_RUST_LESSONS},
    settings::Settings,
};
use serde_json::{from_str, Value};
use std::{
    collections::HashMap,
    fs::{create_dir_all, read_to_string, remove_dir_all, remove_file, File},
    io::{Result, Write},
    path::PathBuf,
};

pub struct DB {
    pub db_dir: PathBuf,
    pub db_dirs_paths: HashMap<String, PathBuf>,
    pub db_files_paths: HashMap<String, PathBuf>,
}

impl DB {
    pub fn new(db_dir: PathBuf) -> Self {
        let mut db_dirs_paths = HashMap::new();

        db_dirs_paths.insert("lessons".to_string(), db_dir.join("lessons"));

        let mut db_files_paths = HashMap::new();

        db_files_paths.insert("settings".to_string(), db_dir.join("settings.json"));
        db_files_paths.insert("lessons_list".to_string(), db_dir.join("lessons_list.json"));

        Self {
            db_dir,
            db_dirs_paths,
            db_files_paths,
        }
    }

    pub fn setup_db(&self, is_dev_mod: bool) -> Result<()> {
        // Delete db directory if dev mode is enabled
        if is_dev_mod && self.db_dir.exists() {
            remove_dir_all(&self.db_dir).expect("Не удалось удалить директорию базы данных");
        }

        // Create db directory if it doesn't exist
        if !self.db_dir.exists() {
            create_dir_all(&self.db_dir).expect("Не удалось создать директорию базы данных");
        }

        // Create db directories if they don't exist
        for (dirname, dirpath) in self.db_dirs_paths.iter() {
            if !dirpath.exists() {
                match dirname.as_str() {
                    "lessons" => {
                        create_dir_all(dirpath).expect("Не удалось создать директорию уроков");
                    }
                    _ => {}
                }
            }
        }

        // Create db files if they don't exist
        for (filename, filepath) in self.db_files_paths.iter() {
            if !filepath.exists() {
                match filename.as_str() {
                    "settings" => {
                        let settings = Settings {
                            theme: "dark".to_string(),
                            lang: "en".to_string(),
                        };
                        let settings = serde_json::to_string(&settings).unwrap();

                        self.create_file(filepath, settings);
                    }
                    "lessons_list" => {
                        // Create basic Rust lessons list file ...
                        let mut lessons_list: LessonsList = Vec::new();

                        BASIC_RUST_LESSONS
                            .iter()
                            .enumerate()
                            .for_each(|(index, lesson)| {
                                lessons_list.push(LessonsListItem {
                                    id: index.to_string(),
                                    title: lesson.to_string(),
                                    completed: false,
                                });

                                let lesson = Lesson::new(index.to_string(), lesson.to_string());
                                let lessons_filepath = self.db_dirs_paths.get("lessons").unwrap();
                                let lesson_filepath =
                                    lessons_filepath.join(format!("{}.json", index));

                                // ... and separate file for each lesson
                                self.create_file(
                                    &lesson_filepath,
                                    serde_json::to_string(&lesson).unwrap(),
                                );
                            });
                        let lessons_list = serde_json::to_string(&lessons_list).unwrap();

                        self.create_file(filepath, lessons_list);
                    }
                    _ => {}
                }
            }
        }

        Ok(())
    }

    pub fn create_file(&self, filepath: &PathBuf, data: String) -> Result<()> {
        let mut file = File::create(filepath).expect("Не удалось создать файл");

        file.write(data.as_bytes())
            .expect("Не удалось записать данные в файл");

        Ok(())
    }

    pub fn read_file(&self, filename: &str) -> Result<Value> {
        let filepath = self
            .db_files_paths
            .get(filename)
            .ok_or(format!("{} path not found", filename))
            .unwrap();
        let data_string = read_to_string(filepath).unwrap();
        let value: Value = from_str(&data_string).unwrap();

        Ok(value)
    }

    pub fn update_file(&self, filepath: &PathBuf, data: &Value) {}

    pub fn delete_file(&self, filename: &str) -> std::result::Result<(), String> {
        let filepath = self
            .db_files_paths
            .get(filename)
            .ok_or("Filepath path not found")?;

        remove_file(filepath).map_err(|e| e.to_string())?;

        Ok(())
    }

    pub fn get_settings(&self) -> Settings {
        let settings: Value = self.read_file("settings").unwrap();
        let settings: Settings = serde_json::from_value(settings).unwrap();

        settings
    }

    pub fn get_lesson(&self, lesson_id: String) -> Lesson {
        let lessons_filepath = self.db_dirs_paths.get("lessons").unwrap();
        let lesson_filepath = lessons_filepath.join(format!("{}.json", lesson_id));

        let lesson_string = read_to_string(lesson_filepath).unwrap();
        let lesson: Value = from_str(&lesson_string).unwrap();
        let lesson: Lesson = serde_json::from_value(lesson).unwrap();

        lesson
    }
}
