import { invoke } from "@tauri-apps/api";
import { useEvent } from "../hooks/events";
import { open } from "@tauri-apps/api/dialog";
import Button from "../components/Button";

import {Node} from "../bindings/Node";

export function ImportFromFs() {
  const openDialog = async () => {
    const selected = await open({
      directory: true,
      multiple: false,
    });
    if (Array.isArray(selected)) {
      // user selected multiple directories
    } else if (selected === null) {
      // user cancelled the selection
    } else {
      const result = await invoke<Node>("import_from_dir", { path: selected });
      console.log(result);
    }
    if (!selected) return;
  }

  useEvent('open_import_dialog', openDialog, []);

  return (
    <section>
      <Button variant="primary" size="medium" onClick={openDialog}>
        Import a folder
      </Button>
    </section>
  )

}
