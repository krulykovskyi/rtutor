use crate::{db::DB, settings::Settings};
use std::sync::Mutex;

pub struct AppState {
    pub db: DB,
    pub settings: Mutex<Settings>,
}

impl AppState {
    pub fn new(db: DB, settings: Settings) -> Self {
        Self {
            db,
            settings: Mutex::new(settings),
        }
    }

    pub fn set_settings(&mut self, settings: Settings) {
        let mut settings_lock = self.settings.lock().unwrap();
        *settings_lock = settings;
    }
}
