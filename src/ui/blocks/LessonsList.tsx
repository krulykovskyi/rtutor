import { useAppContext } from "../../contexts/AppContext";

type LessonsListProps = {
  toggleMenu: Function;
};

const LessonsList: React.FC<LessonsListProps> = ({ toggleMenu }) => {
  const { state, dispatch } = useAppContext();
  const { lessonsList, currentLessonId } = state.data;

  return (
    <ul className="flex flex-col">
      {lessonsList.map((item, i) => (
        <li
          key={item.id}
          className={`
            ${item.id === currentLessonId && "current-lesson"}
            ${item.finishedAt && "finished"}
            mb-2 cursor-pointer
          `}
          onClick={() => {
            toggleMenu();
            dispatch({ type: "SET_CURRENT_LESSON_ID", payload: item.id });
          }}
        >
          <span>{i + 1}. </span>
          <span className="underline">{item.theme}</span>
        </li>
      ))}
    </ul>
  );
};

export default LessonsList;
