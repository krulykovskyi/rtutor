import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { AppState, AppAction } from "../types/AppState";
import { appReducer } from "../reducers/AppReducer";

const initialState: AppState = {
  data: {
    settings: [],
    lessonsList: [],
    currentLessonId: null,
  },
  loading: false,
  error: null,
};

const AppContext = createContext<
  | {
      state: AppState;
      dispatch: React.Dispatch<AppAction>;
    }
  | undefined
>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
