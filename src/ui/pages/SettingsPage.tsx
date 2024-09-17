import React, { useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { useTauriAPI } from "../../hooks/useTauriApi";
import { Settings } from "../../types/Settings";

const availableSettings: { [key: string]: string[] } = {
  lang: ["en", "ua", "pl"],
  theme: ["light", "dark"],
};

const SettingsPage: React.FC = () => {
  const { state } = useAppContext();
  const { updateSettings } = useTauriAPI();
  console.log("state", state);
  const [lang, setLang] = useState(state.data.settings.lang);
  const [theme, setTheme] = useState(state.data.settings.theme);

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ lang, theme });
  };

  return (
    <div>
      <form onSubmit={saveSettings}>
        <label>
          {lang}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Settings["lang"])}
          >
            {availableSettings.lang.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label>
          {lang}
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as Settings["theme"])}
          >
            {availableSettings.theme.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="bg-yellow-500 text-gray-900 px-4 py-1 rounded-lg ml-2 hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          save settings
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
