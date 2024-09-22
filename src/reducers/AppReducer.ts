import { AppState, AppAction } from "../types/AppState";

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "STARTUP":
      return { ...state, loading: false, error: null, data: action.payload };
    case "SET_CURRENT_LESSON_ID":
      return {
        ...state,
        loading: false,
        error: null,
        data: { ...state.data, currentLessonId: action.payload },
      };
    case "UPDATE_SETTINGS":
      return {
        ...state,
        loading: false,
        error: null,
        data: { ...state.data, settings: action.payload },
      };
    case "INVOKE_API":
      return { ...state, loading: true, error: null };
    case "INVOKE_API_OK":
      return { ...state, loading: false, error: null };
    case "APP_ERR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
