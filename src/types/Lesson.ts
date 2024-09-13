export type Lesson = {
  id: string;
  questions: Question[] | null;
  notes: Note[] | null;
};

export type Question = {
  lessonId: Lesson["id"];
  userQuestion: string;
  tutorAnswer: string | null;
};

export type Note = {
  lessonId: Lesson["id"];
  text: string;
};
