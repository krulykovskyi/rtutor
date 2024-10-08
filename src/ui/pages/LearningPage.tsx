import React, { useEffect } from "react";
import Paper from "@mui/material/Paper";
import { useLesson } from "../../hooks/useLesson";
import { useAppContext } from "../../contexts/AppContext";
import LessonProvider, { useLessonContext } from "../../contexts/LessonContext";
import MarkdownPreview from "@uiw/react-markdown-preview";
import Typography from "@mui/material/Typography";
import CircularLoading from "../components/CircularLoading";
import { invoke } from "@tauri-apps/api/tauri";

const Lesson: React.FC = () => {
  const { state: appState } = useAppContext();
  const { state: lessonState } = useLessonContext();
  const { getLesson } = useLesson();

  useEffect(() => {
    getLesson(appState.data.currentLessonId as number);

    const test = async () => {
                                  // Sends lessonId and userQuestion to the backend,
                                  // returns created Question object
      const response1 = await invoke("ask_question", {
        lessonId: appState.data.currentLessonId,
        userQuestion: "What is the meaning of life?", // Should pass user input here
      });
      console.log("created Question object:", response1);
      //------------------------------------------------------------------------------------------------
                                  // Sends lessonId to the backend, returns array of Question objects
      const response2 = await invoke("get_questions", {
        questionsIds: '1' // Should pass question ids here. Ex: "1,3,10,15"
      });
      console.log("array of Question objects:", response2);
      //------------------------------------------------------------------------------------------------
                                  // Sends lessonId and text to the backend, returns created Note object                              
      const response3 = await invoke("create_note", {
        lessonId: appState.data.currentLessonId,
        text: "This is a note.", // Should pass user input here
      });
      console.log("created Note object", response3);
      //------------------------------------------------------------------------------------------------
                                  // Sends note_ids to the backend, returns array of Note objects
      const response4 = await invoke("get_notes", {
        notesIds: '1' // Should pass note ids here. Ex: "1,3,10,15"
      });
      console.log("array of Note objects",response4);
      //------------------------------------------------------------------------------------------------
                                  // Sends note_id and text to the backend, returns edited Note object
      const response5 = await invoke("edit_note", {
        noteId: 1, // Should pass note id here
        text: "This is an edited note.", // Should pass user input here
      });
      console.log("", response5);
    };

    test();
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
        wrapperElement={{ "data-color-mode": "light" }}
      />
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
