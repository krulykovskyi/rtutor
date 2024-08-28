import Menu from "./ui/blocks/Menu";
import WelcomePage from "./ui/pages/WelcomePage";
import LearningPage from "./ui/pages/LearningPage";
import SettingsPage from "./ui/pages/SettingsPage";
import { useState } from "react";
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
  const [activePage, setActivePage] = useState("welcome" as PageKey);

  const Page = pageToComponent[activePage];

  return (
    <div className="app ">
      <Menu pages={Object.keys(pageToComponent)} setPage={setActivePage} />
      <Page />
    </div>
  );
}

export default App;
