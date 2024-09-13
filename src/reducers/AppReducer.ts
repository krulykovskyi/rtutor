import { AppState, AppAction } from "../types/AppState";

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "STARTUP":
      return { ...state, loading: false, error: null, data: action.payload };
    case "INVOKE_API":
      return { ...state, loading: true, error: null };
    case "APP_ERR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
