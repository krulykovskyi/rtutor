import React, { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { useLesson } from '../../hooks/useLesson';
import { useAppContext } from '../../contexts/AppContext';
import LessonProvider, { useLessonContext } from '../../contexts/LessonContext';
import MarkdownPreview from '@uiw/react-markdown-preview';
import Typography from '@mui/material/Typography';
import CircularLoading from '../components/CircularLoading';

const Lesson: React.FC = () => {
  return <CircularLoading />;
  const { state: appState } = useAppContext();
  const { state: lessonState } = useLessonContext();
  const { getLesson } = useLesson();

  useEffect(() => {
    getLesson(appState.data.currentLessonId as number);
  }, [appState.data.currentLessonId]);

  if (lessonState.loading) {
    return <CircularLoading />;
  }

  return (
    <Paper className="m-3 mt-5 p-4">
      <Typography className="text-right uppercase italic p-2" variant="h6">
        {lessonState.lesson.theme}
      </Typography>
      <MarkdownPreview
        source={lessonState.lesson.explanation as string}
        wrapperElement={{ 'data-color-mode': 'light' }}
      />
      <h2>Questions</h2>
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
