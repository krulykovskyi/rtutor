import { LessonAction, LessonState } from "../types/LessonState";

export const lessonReducer = (
  state: LessonState,
  action: LessonAction
): LessonState => {
  switch (action.type) {
    case "LOADING_START":
      return { ...state, loading: true, error: null };
    case "LOADING_OK":
      return { ...state, loading: false, error: null };
    case "LESSON_ERR":
      return { ...state, loading: false, error: action.payload };
    case "SET_LESSON":
      return { ...state, lesson: action.payload, loading: false, error: null };
    default:
      return state;
  }
};
