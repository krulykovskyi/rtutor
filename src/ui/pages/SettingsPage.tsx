import React, { useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { useTauriAPI } from "../../hooks/useTauriApi";
import { Settings } from "../../types/Settings";
import Button from "@mui/material/Button";

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
      <Button
        onClick={() => dispatch({ type: "UPDATE_SETTINGS", payload: settings })}
      >
        apply settings
      </Button>
      <Button onClick={() => updateSettings(settings)}>save settings</Button>
    </div>
  );
};

export default SettingsPage;
