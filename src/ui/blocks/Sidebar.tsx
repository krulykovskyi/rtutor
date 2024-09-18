import LessonsList from "./LessonsList";
import Nav from "./Nav";

type SidebarProps = {
  setPage: Function;
};

const Sidebar: React.FC<SidebarProps> = ({ setPage }) => {
  return (
    <div className="bg-gray-800 h-screen w-64 border border-red-500 overflow-scroll">
      <LessonsList />
      <Nav setPage={setPage} />
    </div>
  );
};

export default Sidebar;
