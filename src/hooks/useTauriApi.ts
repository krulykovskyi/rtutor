import { invoke } from "@tauri-apps/api/tauri";
import { useAppContext } from "../contexts/AppContext";
import { AppAction, AppData } from "../types/AppState";
import { Settings } from "../types/Settings";

const catchErr = (error: any, dispatch: React.Dispatch<AppAction>) => {
  if (error instanceof Error) {
    dispatch({ type: "APP_ERR", payload: error.message });
  } else {
    dispatch({ type: "APP_ERR", payload: String(error) });
  }
};

export const useTauriAPI = () => {
  const { dispatch } = useAppContext();

  const getStartupData = async () => {
    try {
      dispatch({ type: "INVOKE_API" });

      const data: AppData = await invoke("get_startup_data");
      console.log("STARTUP DATA:", data);

      dispatch({ type: "STARTUP", payload: data });
    } catch (error) {
      catchErr(error, dispatch);
    }
  };

  const updateSettings = async (settings: Settings) => {
    try {
      dispatch({ type: "INVOKE_API" });

      await invoke("update_settings", {
        settings: JSON.stringify(settings),
      });

      dispatch({ type: "INVOKE_API_OK" });
    } catch (error) {
      catchErr(error, dispatch);
    }
  };

  return { getStartupData, updateSettings };
};
