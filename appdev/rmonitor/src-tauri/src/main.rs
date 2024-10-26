// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::str::FromStr;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_all_resources() -> Vec<String> {
   vec![
        String::from("help"),
        String::from("refresh_disks"),
        String::from("refresh_users"),
        String::from("refresh_networks"),
        String::from("refresh_components"),
        String::from("refresh_cpu"),
        String::from("signals"),
        String::from("cpus"),
        String::from("memory"),
        String::from("all"),
        String::from("frequency"),
        String::from("vendor_id"),
        String::from("brand"),
        String::from("load_avg"),
        String::from("temperature"),
        String::from("network"),
        String::from("show"),
        String::from("disks"),
        String::from("users"),
        String::from("boot_time"),
        String::from("uptime"),
        String::from("pid"),
        String::from("system")
    ]
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
                get_all_resources,
                greet
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
