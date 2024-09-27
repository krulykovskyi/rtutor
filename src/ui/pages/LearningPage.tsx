import React, { useEffect } from "react";
import Paper from "@mui/material/Paper";
import { useLesson } from "../../hooks/useLesson";
import { useAppContext } from "../../contexts/AppContext";
import LessonProvider, { useLessonContext } from "../../contexts/LessonContext";
import { Question } from "../../types/Lesson";

const Lesson: React.FC = () => {
  const { state: appState } = useAppContext();
  const { state: lessonState } = useLessonContext();
  const { getLesson } = useLesson();

  useEffect(() => {
    getLesson(appState.data.currentLessonId as string);
  }, [appState.data.currentLessonId]);

  if (lessonState.loading) {
    return <div>Loading...</div>;
  }

  return (
    <Paper>
      <h1>Lesson</h1>
      <div>
        {lessonState.lesson.questions?.map(
          ({ userQuestion, tutorAnswer, timestamp }: Question) => (
            <>
              <div>{userQuestion}</div>
              <div>{tutorAnswer}</div>
              <div>{timestamp}</div>
            </>
          )
        )}
      </div>
    </Paper>
  );
};

const LearningPage: React.FC = () => {
  return (
    <LessonProvider>
      <Lesson />
    </LessonProvider>
  );
};

export default LearningPage;
