export type Lesson = {
  id: number;
  theme: string;
  explanation: string | null;
  questionsIds: number[] | null;
  notesIds: number[] | null;
  startedAt: number | null;
  finishedAt: number | null;
};

export type Question = {
  id: number;
  lessonId: Lesson["id"];
  userQuestion: string;
  tutorAnswer: string;
  timestamp: number;
};

export type Note = {
  id: number;
  lessonId: Lesson["id"];
  text: string;
  editedAt: number;
};
