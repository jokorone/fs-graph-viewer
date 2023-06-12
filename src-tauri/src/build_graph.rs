use std::path::PathBuf;

use serde::Serialize;
use ts_rs::TS;

use crate::util::FileUtils;

#[derive(Debug, Serialize, TS)]
#[ts(export)]
pub struct Node {
  name: String,
  path: PathBuf,
  children: Vec<Node>,
  leafs: Vec<Leaf>
}

#[derive(Debug, Serialize, TS)]
#[ts(export)]
struct Leaf {
  name: String,
  path: PathBuf
}

pub fn build_graph(root: &PathBuf) -> Node {
  let mut node = Node {
    name: root
    .file_name()
    .unwrap()
    .to_str()
    .unwrap()
    .to_string(),
    path: root.clone(),
    children: Vec::new(),
    leafs: Vec::new()
  };

  if let Ok(entries) = std::fs::read_dir(root) {
    for entry in entries {
      if let Ok(entry) = entry {
        let path = entry.path();

        if path.is_hidden_file() {
          continue;
        }

        if path.is_os_dir() {
          continue;
        }

        if path.is_dir() {
          let child = build_graph(&path);
          node.children.push(child);
        } else {
          let leaf = Leaf {
            name: path
            .file_name()
            .unwrap()
            .to_str()
            .unwrap()
            .to_string(),
            path: path.clone()
          };
          node.leafs.push(leaf);
        }
      }
    }
  }

  node
}
