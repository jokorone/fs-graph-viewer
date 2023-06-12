// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Submenu, CustomMenuItem, Menu, MenuItem, Manager};


mod build_graph;
mod util;
mod import;
use import::import_from_dir;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![greet, import_from_dir])
    .menu(build_menu())
    .setup(|app| {
        let main_window = app.get_window("main").unwrap();
        let window_ref = main_window.clone();

        // db.print_schema().expect("Failed to print schema");

        main_window.on_menu_event(move |e| {
            println!("menu event: {:?}", e.menu_item_id());

            match e.menu_item_id() {
                "open_import_dialog" => {
                    window_ref.emit("open_import_dialog", {}).unwrap();
                },
                // "open_file" => {
                //     window_ref.emit("open_file", {}).unwrap();
                // },
                "clear_db" => {

                },
                "reload_window" => {
                },
                "hide" => {
                    window_ref.hide().unwrap();
                },
                "about" => {
                    window_ref.emit("open_about_dialog", {}).unwrap();
                },
                "settings" => {
                    window_ref.emit("open_settings_dialog", {}).unwrap();
                },
                _ => println!("handle menu event"),
            }
        });

        Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}


fn build_menu() -> Menu {
    let menu = Menu::new()
    // .add_native_item(MenuItem::Copy)
    .add_submenu(Submenu::new(
        "Vibster",
        Menu::new()
        .add_item(CustomMenuItem::new("about", "About Vibster"))
        .add_item(
            CustomMenuItem::new("settings", "Settings").accelerator("CommandOrControl+,"),
        )
        .add_native_item(MenuItem::Hide)
        .add_native_item(MenuItem::Quit),
    ))
    .add_item(CustomMenuItem::new("hide", "Hide"))
    .add_submenu(Submenu::new(
        "Import",
        Menu::new().add_item(
            CustomMenuItem::new(
                "open_import_dialog".to_string(),
                "Import from Folder"
            ).accelerator("CommandOrControl+o"),
        )
    ))
    .add_submenu(Submenu::new(
        "DevTools",
        Menu::new()
        .add_item(CustomMenuItem::new("clear_db", "Clear DB"))
        .add_item(CustomMenuItem::new("reload_window", "Reload Window")),
    ));

    menu
}
