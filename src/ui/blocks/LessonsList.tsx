import { useAppContext } from "../../contexts/AppContext";

const LessonsList: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { lessonsList, currentLessonId } = state.data;

  return (
    <ul>
      {lessonsList.map((item, i) => (
        <li
          key={item.id}
          className={`${item.id === currentLessonId && "current-lesson"} ${item.completed && "completed"}`}
          onClick={() => dispatch({ type: "SET_CURRENT_LESSON_ID", payload: item.id })}
        >
          <span>{i + 1}</span>
          {item.title}
        </li>
      ))}
    </ul>
  );
};

export default LessonsList;
