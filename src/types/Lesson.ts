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
  lessonId: Lesson["id"];
  text: string;
  answer: string;
  timestamp: number;
};

export type Note = {
  lessonId: Lesson["id"];
  text: string;
  editedAt: number;
};
