use std::process::Command;

/// Set the display brightness level (0-100)
#[tauri::command]
pub fn set_brightness(level: u8) -> Result<(), String> {
    // Clamp level to 0-100 range
    let level = level.min(100);
    
    Command::new("ddcutil")
        .args(["setvcp", "10", &level.to_string()])
        .output()
        .map_err(|e| format!("Failed to set brightness: {}", e))?;

    Ok(())
}

/// Get the current display brightness level
#[tauri::command]
pub fn get_brightness() -> Result<u8, String> {
    let output = Command::new("ddcutil")
        .args(["getvcp", "10"])
        .output()
        .map_err(|e| format!("Failed to get brightness: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    
    // Parse the output to extract brightness value
    // ddcutil output format: "VCP code 0x10 (Brightness) current value = X"
    if let Some(value_str) = stdout.split("current value = ").nth(1) {
        if let Ok(value) = value_str.trim().split_whitespace().next().unwrap_or("50").parse::<u8>() {
            return Ok(value);
        }
    }
    
    // Default fallback if parsing fails
    Ok(50)
}
