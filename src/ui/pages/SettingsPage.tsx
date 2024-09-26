import React, { useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { useTauriAPI } from "../../hooks/useTauriApi";
import { Settings } from "../../types/Settings";
import Button from "@mui/material/Button";
import _ from "lodash";
import Paper from "@mui/material/Paper";

const availableSettings: { [key: string]: string[] } = {
  lang: ["en", "ua", "pl"],
  theme: ["light", "dark"],
};

const SettingsPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [settings, setSettings] = useState(state.data.settings);
  const { updateSettings } = useTauriAPI();
  const [wasSaved, setWasSaved] = useState(true);

  return (
    <Paper className="m-3 mt-10 p-3">
      {Object.keys(availableSettings).map((key) => (
        <label>
          {key}
          <select
            value={settings[key as keyof Settings]}
            onChange={(e) => {
              setSettings({ ...settings, [key]: e.target.value });
              setWasSaved(false);
            }}
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
        disabled={_.isEqual(settings, state.data.settings)}
        variant="contained"
        onClick={() => dispatch({ type: "UPDATE_SETTINGS", payload: settings })}
      >
        apply settings
      </Button>
      <Button
        disabled={_.isEqual(wasSaved, true)}
        variant="contained"
        onClick={() => {
          dispatch({ type: "UPDATE_SETTINGS", payload: settings });
          updateSettings(settings);
        }}
      >
        save settings
      </Button>
    </Paper>
  );
};

export default SettingsPage;
