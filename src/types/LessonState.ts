import { Lesson } from "./Lesson";

export interface LessonState {
  lesson: Lesson;
  loading: boolean;
  error: string | null;
}

export type LessonAction =
  | { type: "LOADING_START" }
  | { type: "LOADING_OK" }
  | { type: "LESSON_ERR"; payload: string }
  | { type: "SET_LESSON"; payload: Lesson };
