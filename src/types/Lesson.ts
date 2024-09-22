export type Lesson = {
  id: string | null;
  questions: Question[] | null;
  notes: Note[] | null;
};

export type Question = {
  lessonId: Lesson["id"];
  userQuestion: string;
  tutorAnswer: string | null;
  timestamp: number;
};

export type Note = {
  lessonId: Lesson["id"];
  text: string;
  timestamp: number;
};
