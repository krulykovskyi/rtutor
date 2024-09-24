import { useEffect, useState } from "react";
import { useTauriAPI } from "./hooks/useTauriApi";
import { useAppContext } from "./contexts/AppContext";
import Sidebar from "./ui/blocks/Sidebar";
import HomePage from "./ui/pages/HomePage";
import LearningPage from "./ui/pages/LearningPage";
import SettingsPage from "./ui/pages/SettingsPage";
import ProfilePage from "./ui/pages/ProfilePage";
import Paper from "@mui/material/Paper";
import "./App.css";

export type PageKey = "home" | "learning" | "settings" | "profile";
type PageComponent =
  | typeof HomePage
  | typeof LearningPage
  | typeof SettingsPage
  | typeof ProfilePage;

export const pageToComponent: Record<PageKey, PageComponent> = {
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
    if (state.data.currentLessonId) {
      setActivePage("learning");
    }
  }, [state.data.currentLessonId]);

  const Page = pageToComponent[activePage];

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (state.error) {
    return <div>Error: {state.error}</div>;
  }

  return (
    // add bg color dark with tailwind
    <Paper className="h-screen bg-gray-800">
      <Sidebar setPage={setActivePage} />
      <Page />
    </Paper>
  );
}

export default App;
