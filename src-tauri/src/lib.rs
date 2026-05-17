// src-tauri/src/lib.rs

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use tauri::{Manager, WindowEvent};

mod brightness;

use brightness::{get_brightness, set_brightness};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Better compatibility for Raspberry Pi + Wayland + WebKitGTK
    std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
    std::env::set_var("WEBKIT_DISABLE_COMPOSITING_MODE", "1");

    // Force Wayland
    std::env::set_var("GDK_BACKEND", "wayland");
    std::env::set_var("WAYLAND_DISPLAY", "wayland-0");

    // Touchscreen keyboard support
    std::env::set_var("GTK_IM_MODULE", "maliit");
    std::env::set_var("QT_IM_MODULE", "maliit");

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, set_brightness, get_brightness])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            // Force focus on startup
            let _ = window.set_focus();

            Ok(())
        })
        .on_window_event(|window, event| {
            match event {
                WindowEvent::Focused(focused) => {
                    if *focused {
                        let _ = window.set_focus();
                    }
                }
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
