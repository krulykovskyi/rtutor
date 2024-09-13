import { Settings } from "./Settings";
import { LessonsList } from "./LessonsList";
import { Lesson } from "./Lesson";

export type AppData = {
  settings: Settings;
  lessonsList: LessonsList;
  lastLessonId: Lesson["id"] | null;
};

export interface AppState {
  data: AppData;
  loading: boolean;
  error: string | null;
}

export type AppAction =
  | { type: "INVOKE_API" }
  | { type: "APP_ERR"; payload: string }
  | { type: "STARTUP"; payload: AppData };
  
