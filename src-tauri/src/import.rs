use std::{path::PathBuf, thread};

use tauri::Runtime;

use crate::build_graph::{build_graph, Node};



#[tauri::command]
pub fn import_from_dir<R: Runtime>(window: tauri::Window<R>, path: &str) -> Result<Node, String> {
  let target_path = PathBuf::from(path);
  if !target_path.exists() { println!("Path does not exist"); }
  if !target_path.is_dir() { println!("Path is not a dir"); }

  let handle = thread::spawn(move || {
    build_graph(&target_path)
  });

  match handle.join() {
    Ok(result) => {
      println!("Graph: {:?}", result);
      Ok(result)
    },
    Err(e) => {
      println!("Error: {:?}", e);
      Err("Error".to_string())
    }
  }



    // if let Ok(entries) = fs::read_dir(target_path) {
    //   for entry in entries {
    //     let path = entry.unwrap().path();

    //     if path.is_hidden_file() {
    //       continue;
    //     }

    //     if path.is_os_dir() {
    //       continue;
    //     }

    //     if path.is_dir() && path.has_valid_targets() {
    //       println!("RecursiveDir: {}", path.file_name().unwrap().to_str().unwrap());

    //       match import_from_dir(window.clone(), &path.to_str().unwrap()) {
    //         Ok(_) => {},
    //         Err(e) => println!("Error importing from dir: {:?}", e)
    //       }

    //       // let collection = create_collection_from_dir(&path).unwrap();

    //       // if db.collection_is_same_size(&collection) {
    //       //   return Err(String::from("Collection exists in same size"));
    //       // }

    //       // match db.insert_collection(&collection) {
    //       //   Ok(_) => {
    //       //     println!("Inserted collection");
    //       //     let _ = window.emit("collection_imported_progress", &collection).unwrap();
    //       //   },
    //       //   Err(e) => println!("Error inserting collection: {:?}", e)
    //       // };
    //     }

    //     // if path.is_music_file() {
    //     //   let track = Track::new(&path.to_str().unwrap(), &collection.id);

    //     //   if db.track_exists(&track) {
    //     //     println!("Track already exists");
    //     //     continue;
    //     //   }

    //     //   match db.insert_track(&track) {
    //     //     Ok(_) => {},
    //     //     Err(e) => println!("Error inserting track: {:?}", e)
    //     //   };
    //     // }
    //   }
    // }
  // });

  // Ok(())
}
