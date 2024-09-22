import { Settings } from "./Settings";
import { LessonsList } from "./LessonsList";
import { Lesson } from "./Lesson";

export type AppData = {
  settings: Settings;
  lessonsList: LessonsList;
  currentLessonId: Lesson["id"] | null;
};

export interface AppState {
  data: AppData;
  loading: boolean;
  error: string | null;
}

export type AppAction =
  | { type: "INVOKE_API" }
  | { type: "INVOKE_API_OK" }
  | { type: "APP_ERR"; payload: string }
  | { type: "STARTUP"; payload: AppData }
  | { type: "SET_CURRENT_LESSON_ID"; payload: Lesson["id"] }
  | { type: "UPDATE_SETTINGS"; payload: Settings };
