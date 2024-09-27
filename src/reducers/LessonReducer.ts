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
    case "ASK_QUESTION":
      return {
        ...state,
        lesson: {
          ...state.lesson,
          questions: state.lesson.questions
            ? [...state.lesson.questions, action.payload]
            : [action.payload],
        },
        loading: false,
        error: null,
      };
    case "SAVE_NOTE":
      return {
        ...state,
        lesson: {
          ...state.lesson,
          notes: state.lesson.notes
            ? [...state.lesson.notes, action.payload]
            : [action.payload],
        },
        loading: false,
        error: null,
      };
  }
};
