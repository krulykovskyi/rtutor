import { invoke } from "@tauri-apps/api/tauri";
import { useLessonContext } from "../contexts/LessonContext";
import { Lesson } from "../types/Lesson";
import { LessonAction } from "../types/LessonState";

const catchErr = (error: any, dispatch: React.Dispatch<LessonAction>) => {
  if (error instanceof Error) {
    dispatch({ type: "LESSON_ERR", payload: error.message });
  } else {
    dispatch({ type: "LESSON_ERR", payload: String(error) });
  }
};

export const useLesson = () => {
  const { dispatch } = useLessonContext();

  const getLesson = async (lessonId: number) => {
    try {
      dispatch({ type: "LOADING_START" });

      const lesson: Lesson = await invoke("get_lesson", { lessonId });
      console.log("LESSON:", lesson);

      dispatch({ type: "SET_LESSON", payload: lesson });
    } catch (error) {
      catchErr(error, dispatch);
    }
  };

  return { getLesson };
};
