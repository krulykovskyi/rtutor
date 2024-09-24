import { createContext, ReactNode, useReducer } from "react";
import { LessonState, LessonAction } from "../types/LessonState";
import { lessonReducer } from "../reducers/LessonReducer";

const initialState: LessonState = {
  lesson: {
    id: null,
    questions: null,
    notes: null,
  },
  loading: false,
  error: null,
};

export const LessonContext = createContext<
  | {
      state: LessonState;
      dispatch: React.Dispatch<LessonAction>;
    }
  | undefined
>(undefined);

const LessonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(lessonReducer, initialState);

  return (
    <LessonContext.Provider value={{ state, dispatch }}>
      {children}
    </LessonContext.Provider>
  );
};

export default LessonProvider;
