import { invoke } from "@tauri-apps/api/tauri";
import { useAppContext } from "../contexts/AppContext";
import { AppData } from "../types/AppState";

export const useTauriAPI = () => {
  const { dispatch } = useAppContext();

  const getStartupData = async () => {
    try {
      dispatch({ type: "INVOKE_API" });

      const data: AppData = await invoke("get_startup_data");

      dispatch({ type: "STARTUP", payload: data });
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: "APP_ERR", payload: error.message });
      } else {
        dispatch({ type: "APP_ERR", payload: String(error) });
      }
    }
  };

  return { getStartupData };
};
