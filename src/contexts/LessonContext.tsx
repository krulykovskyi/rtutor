import React, { createContext, ReactNode, useReducer } from "react";
import { LessonState, LessonAction } from "../types/LessonState";
import { lessonReducer } from "../reducers/LessonReducer";

const initialState: LessonState = {
  lesson: {
    id: 0,
    theme: "",
    explanation: null,
    questionsIds: null,
    notesIds: null,
    startedAt: null,
    finishedAt: null,
  },
  loading: false,
  error: null,
};

const LessonContext = createContext<
  | {
      state: LessonState;
      dispatch: React.Dispatch<LessonAction>;
    }
  | undefined
>(undefined);

export const useLessonContext = () => {
  const context = React.useContext(LessonContext);
  if (context === undefined) {
    throw new Error("useLessonContext must be used within a LessonProvider");
  }
  return context;
};

const LessonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(lessonReducer, initialState);

  return (
    <LessonContext.Provider value={{ state, dispatch }}>
      {children}
    </LessonContext.Provider>
  );
};

export default LessonProvider;
