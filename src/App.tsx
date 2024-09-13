import { useEffect, useState } from "react";
import { useTauriAPI } from "./hooks/useTauriApi";
import { useAppContext } from "./contexts/AppContext";
import Menu from "./ui/blocks/Menu";
import WelcomePage from "./ui/pages/WelcomePage";
import LearningPage from "./ui/pages/LearningPage";
import SettingsPage from "./ui/pages/SettingsPage";
import "./App.css";
import Chat from './ui/components/Chat/Chat';
import Chatcode from './ui/components/Chatcode';
import Sidebar from './ui/components/Sidebar/Sidebar';

type PageKey = "welcome" | "learning" | "settings";
type PageComponent =
  | typeof WelcomePage
  | typeof LearningPage
  | typeof SettingsPage;

const pageToComponent: Record<PageKey, PageComponent> = {
  welcome: WelcomePage,
  learning: LearningPage,
  settings: SettingsPage,
};

function App() {
  const { getStartupData } = useTauriAPI();
  const { state } = useAppContext();
  const [activePage, setActivePage] = useState("welcome" as PageKey);

  useEffect(() => {
    getStartupData();
  }, []);

  const Page = pageToComponent[activePage];

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (state.error) {
    return <div>Error: {state.error}</div>;
  }

  return (
  );
}

export default App;


//     <div className="app bg-gray-900 w-1/1 h-screen flex p-1">
//       <Sidebar />
//       <div className='flex border-2 ml-2 border-yellow-500 rounded-lg w-full'>
//         <Chat />
//         <Chatcode />
//       </div>
//     </div>
