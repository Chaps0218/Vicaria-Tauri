#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod models;

use models::{Confirmado, ConfirmadoMod, User, UserLogin};

use bcrypt::verify;
use mysql::prelude::*;
use mysql::*;
use serde::Serialize;
use tauri::Manager;
use tauri::Window;
use warp::{reject, Filter};

async fn get_db_connection() -> Result<PooledConn, mysql::Error> {
    let url = "mysql://root:password@localhost:3306/confirmaciones_arcadia";
    let pool = Pool::new(url)?;
    pool.get_conn()
}

fn set_window_size(window: &Window) {
    let monitor = window.primary_monitor().unwrap().unwrap();
    let monitor_size = monitor.size();
    let width = (monitor_size.width as f64 * 0.7) as f64;
    let height = (monitor_size.height as f64 * 0.7) as f64;

    window
        .set_size(tauri::Size::Logical(tauri::LogicalSize { width, height }))
        .unwrap();

    window.center().unwrap();
}

#[tauri::command]
async fn login(user: UserLogin) -> Result<User, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    // println!("{:#?}", user);
    let stored_hash: Option<String> = conn
        .exec_first(
            "SELECT usu_password FROM usuario WHERE usu_user = :usu_user",
            params! {
                "usu_user" => &user.usu_user,
            },
        )
        .map_err(|e| e.to_string())?;

    match stored_hash {
        Some(hash) => {
            if verify(&user.usu_password, &hash).map_err(|e| e.to_string())? {
                let authenticated_user: Option<User> = conn
                    .exec_first(
                        "SELECT * FROM usuario WHERE usu_user = :usu_user",
                        params! {
                            "usu_user" => &user.usu_user,
                        },
                    )
                    .map_err(|e| e.to_string())?;

                match authenticated_user {
                    Some(user) => Ok(user),
                    None => Err("User not found after password verification".to_string()),
                }
            } else {
                Err("Invalid credentials".to_string())
            }
        }
        None => Err("Invalid credentials".to_string()),
    }
}

#[tauri::command]
async fn get_all_confirmados() -> Result<Vec<Confirmado>, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let confirmados: Vec<Confirmado> = conn
        .query("select conf.conf_id, conf.usu_id, conf.min_id, conf.est_id,conf.conf_nombres, conf.conf_apellidos, conf.conf_padre_nombre, conf.conf_madre_nombre, conf.conf_padrino1_nombre, conf.conf_padrino1_apellido, conf.conf_padrino2_nombre, conf.conf_padrino2_apellido, conf.conf_fecha, conf.conf_tomo, conf.conf_pagina, conf.conf_numero, min.min_nombre, est.est_nombre from confirmado as conf inner join ministro as min on min.min_id = conf.min_id inner join establecimiento as est on est.est_id = conf.est_id")
        .map_err(|e| e.to_string())?;

    Ok(confirmados)
}

#[tauri::command]
async fn handle_add_confirmado(input: ConfirmadoMod) -> Result<String, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let insert_query = r#"
        INSERT INTO confirmado (usu_id, min_id, est_id, conf_nombres, conf_apellidos, conf_fecha, conf_tomo, conf_pagina, conf_numero, conf_padre_nombre, conf_madre_nombre, conf_padrino1_nombre, conf_padrino1_apellido, conf_padrino2_nombre, conf_padrino2_apellido)
        VALUES (:usu_id, :min_id, :est_id, :conf_nombres, :conf_apellidos, :conf_fecha, :conf_tomo, :conf_pagina, :conf_numero, :conf_padre_nombre, :conf_madre_nombre, :conf_padrino1_nombre, :conf_padrino1_apellido, :conf_padrino2_nombre, :conf_padrino2_apellido)
    "#;

    conn.exec_drop(
        insert_query,
        params! {
            "usu_id" => &input.usu_id,
            "est_id" => &input.est_id,
            "min_id" => &input.min_id,
            "conf_nombres" => &input.conf_nombres,
            "conf_apellidos" => &input.conf_apellidos,
            "conf_fecha" => &input.conf_fecha,
            "conf_tomo" => &input.conf_tomo,
            "conf_pagina" => &input.conf_pagina,
            "conf_numero" => &input.conf_numero,
            "conf_padre_nombre" => &input.conf_padre_nombre,
            "conf_madre_nombre" => &input.conf_madre_nombre,
            "conf_padrino1_nombre" => &input.conf_padrino1_nombre,
            "conf_padrino1_apellido" => &input.conf_padrino1_apellido,
            "conf_padrino2_nombre" => &input.conf_padrino2_nombre,
            "conf_padrino2_apellido" => &input.conf_padrino2_apellido,
        },
    )
    .map_err(|e| e.to_string())?;

    Ok("Confirmado añadido".to_string())
}

#[tauri::command]
async fn handle_modify_confirmado(input: ConfirmadoMod) -> Result<String, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let modify_query = r#"
        UPDATE confirmado SET min_id = :min_id, est_id = :est_id, conf_nombres = :conf_nombres, conf_apellidos = :conf_apellidos, conf_fecha = :conf_fecha, conf_tomo = :conf_tomo, conf_pagina = :conf_pagina, conf_numero = :conf_numero, conf_padre_nombre = :conf_padre_nombre, conf_madre_nombre = :conf_madre_nombre, conf_padrino1_nombre = :conf_padrino1_nombre, conf_padrino1_apellido = :conf_padrino1_apellido, conf_padrino2_nombre = :conf_padrino2_nombre, conf_padrino2_apellido = :conf_padrino2_apellido WHERE conf_id = :conf_id
    "#;

    conn.exec_drop(
        modify_query,
        params! {
            "conf_id" => &input.conf_id,
            "est_id" => &input.est_id,
            "min_id" => &input.min_id,
            "conf_nombres" => &input.conf_nombres,
            "conf_apellidos" => &input.conf_apellidos,
            "conf_fecha" => &input.conf_fecha,
            "conf_tomo" => &input.conf_tomo,
            "conf_pagina" => &input.conf_pagina,
            "conf_numero" => &input.conf_numero,
            "conf_padre_nombre" => &input.conf_padre_nombre,
            "conf_madre_nombre" => &input.conf_madre_nombre,
            "conf_padrino1_nombre" => &input.conf_padrino1_nombre,
            "conf_padrino1_apellido" => &input.conf_padrino1_apellido,
            "conf_padrino2_nombre" => &input.conf_padrino2_nombre,
            "conf_padrino2_apellido" => &input.conf_padrino2_apellido,
        },
    )
    .map_err(|e| e.to_string())?;

    Ok("Confirmado modificado".to_string())
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();
            set_window_size(&main_window);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            login,
            get_all_confirmados,
            handle_add_confirmado,
            handle_modify_confirmado
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
