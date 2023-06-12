import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog";
import { useEvent } from "./hooks/events";
import { ImportFromFs } from "./features/ImportFromFs";


// import "./App.css";

function App() {

  return (
    <div className="container">
      <ImportFromFs/>
      {/* <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form> */}

    </div>
  );
}

export default App;
