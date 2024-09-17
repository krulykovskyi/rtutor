import { useEffect, useState } from "react";
import { useTauriAPI } from "./hooks/useTauriApi";
import { useAppContext } from "./contexts/AppContext";
import Sidebar from "./ui/blocks/Sidebar";
import HomePage from "./ui/pages/HomePage";
import LearningPage from "./ui/pages/LearningPage";
import SettingsPage from "./ui/pages/SettingsPage";
import ProfilePage from "./ui/pages/ProfilePage";
import "./App.css";

export type PageKey = "home" | "learning" | "settings" | "profile";
type PageComponent =
  | typeof HomePage
  | typeof LearningPage
  | typeof SettingsPage
  | typeof ProfilePage;

const pageToComponent: Record<PageKey, PageComponent> = {
  home: HomePage,
  learning: LearningPage,
  settings: SettingsPage,
  profile: ProfilePage,
};

function App() {
  const { getStartupData } = useTauriAPI();
  const { state } = useAppContext();
  const [activePage, setActivePage] = useState("home" as PageKey);

  useEffect(() => {
    getStartupData();
  }, []);

  useEffect(() => {
    setActivePage("learning");
  }, [state.data.currentLessonId]);

  console.log("App RENDER");

  const Page = pageToComponent[activePage];

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (state.error) {
    return <div>Error: {state.error}</div>;
  }

  return (
    <div className="app bg-gray-900 w-1/1 h-screen flex p-1">
      <Sidebar setPage={setActivePage} />
      <Page />
    </div>
  );
}

export default App;
