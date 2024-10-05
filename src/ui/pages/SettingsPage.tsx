import React, { useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { useTauriAPI } from "../../hooks/useTauriApi";
import { Settings } from "../../types/Settings";
import SettingRow from "../blocks/SettingRow";
import Button from "@mui/material/Button";
import _ from "lodash";
import Paper from "@mui/material/Paper";

const SettingsPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [settings, setSettings] = useState(state.data.settings);
  const { updateSettings } = useTauriAPI();
  const [wasSaved, setWasSaved] = useState(true);

  const changeSettings = (newSetting: Settings[number]) => {
    setSettings(
      settings.map((setting) =>
        setting.id === newSetting.id ? newSetting : setting
      )
    );
    setWasSaved(false);
  };

  return (
    <Paper className="m-3 mt-5 p-4">
      <div className="flex flex-col">
        {settings.map((setting) => (
          <SettingRow setting={setting} changeSettings={changeSettings} />
        ))}
      </div>
      <div>
        <Button
          disabled={_.isEqual(settings, state.data.settings)}
          variant="contained"
          onClick={() =>
            dispatch({ type: "UPDATE_SETTINGS", payload: settings })
          }
        >
          apply settings
        </Button>
        <Button
          disabled={wasSaved}
          variant="contained"
          onClick={() => {
            dispatch({ type: "UPDATE_SETTINGS", payload: settings });
            updateSettings(settings);
          }}
        >
          save settings
        </Button>
      </div>
    </Paper>
  );
};

export default SettingsPage;
