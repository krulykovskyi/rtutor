export type Lesson = {
  id: string | null;
  theme: string | null;
  questions: Question[] | [];
  notes: Note[] | [];
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
