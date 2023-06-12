use std::{fs, path::PathBuf};

const MUSIC_EXTENSIONS: [&str; 6] = ["mp3", "wav", "flac", "ogg", "aif", "aiff"];
const OS_DIRS: [&str; 2] = [".musiclibrary", ".localized"];

pub trait FileUtils {
  fn is_music_file(&self) -> bool;
  fn is_hidden_file(&self) -> bool;
  // fn read_metadata(&self) -> Result<Metadata, MetadataError>;
  fn is_os_dir(&self) -> bool;
  fn has_valid_targets(&self) -> bool;
  fn valid_children(&self) -> usize;
}

impl FileUtils for PathBuf {
  fn is_music_file(&self) -> bool {
      if self.is_dir()
      || self.is_hidden_file() {
          return false;
      }

      match &self.extension() {
          Some(ext) => MUSIC_EXTENSIONS.contains(&ext.to_str().unwrap()),
          None => false,
      }
  }
  // fn read_metadata(&self) -> Result<Metadata, MetadataError> {
  //     metadata::read_metadata_from_file(self)
  // }
  fn is_hidden_file(&self) -> bool {
      self.file_name().unwrap().to_str().unwrap().starts_with(".")
  }
  fn is_os_dir(&self) -> bool {
      let name = self.file_name().unwrap().to_str().unwrap();
      OS_DIRS.map(|dir| name.contains(dir)).contains(&true)
  }
  fn valid_children(&self) -> usize {
      if !self.is_dir() {
          return 0;
      }

      let types = fs::read_dir(self).unwrap().map(|path| {
          let target = path.unwrap().path();
          match target.is_dir() {
              true => target.has_valid_targets(),
              false => target.is_music_file()
          }
      }).collect::<Vec<bool>>();

      // filter types for true
      types.iter().filter(|&t| *t).count()
  }
  fn has_valid_targets(&self) -> bool {
      println!("Path: {} has {} valid children", self.display(), self.valid_children());
      self.valid_children() > 0
  }
}
