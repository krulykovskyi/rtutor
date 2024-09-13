import { useEffect, useState } from "react";
import { useTauriAPI } from "./hooks/useTauriApi";
import { useAppContext } from "./contexts/AppContext";
import Menu from "./ui/blocks/Menu";
import WelcomePage from "./ui/pages/WelcomePage";
import LearningPage from "./ui/pages/LearningPage";
import SettingsPage from "./ui/pages/SettingsPage";
import "./App.css";

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
    <div className="app ">
      <Menu pages={Object.keys(pageToComponent)} setPage={setActivePage} />
      <Page />
    </div>
  );
}

export default App;
