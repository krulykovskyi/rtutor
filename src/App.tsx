import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import ui from "./ui";

const { AudioVisualizer } = ui;

function App() {
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");

  async function ask() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    try {
      setAnswer(await invoke("reply", { question }));
    } catch (e) {
      setAnswer(JSON.stringify(e));
    }
  }

  return (
    <div className="container">
      <h1>Welcome to RTutor</h1>

      <AudioVisualizer />

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          ask();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setQuestion(e.currentTarget.value)}
          placeholder="Задайте вопрос репетитору..."
        />
      </form>

      <p>{answer}</p>
    </div>
  );
}

export default App;
