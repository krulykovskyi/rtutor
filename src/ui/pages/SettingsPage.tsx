import React, { useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { useTauriAPI } from "../../hooks/useTauriApi";
import { Settings } from "../../types/Settings";

const availableSettings: { [key: string]: string[] } = {
  lang: ["en", "ua", "pl"],
  theme: ["light", "dark"],
};

const SettingsPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [settings, setSettings] = useState(state.data.settings);
  const { updateSettings } = useTauriAPI();

  return (
    <div>
      {Object.keys(availableSettings).map((key) => (
        <label>
          {key}
          <select
            value={settings[key as keyof Settings]}
            onChange={(e) =>
              setSettings({ ...settings, [key]: e.target.value })
            }
          >
            {availableSettings[key].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      ))}
      <button
        type="submit"
        className="bg-yellow-500 text-gray-900 px-4 py-1 rounded-lg ml-2 hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
        onClick={() => dispatch({ type: "UPDATE_SETTINGS", payload: settings })}
      >
        apply settings
      </button>
      <button
        type="submit"
        className="bg-yellow-500 text-gray-900 px-4 py-1 rounded-lg ml-2 hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
        onClick={() => updateSettings(settings)}
      >
        save settings
      </button>
    </div>
  );
};

export default SettingsPage;
