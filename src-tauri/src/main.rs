#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod models;

use models::{
    Ciudad, CiudadAdd, Confirmado, ConfirmadoAdd, ConfirmadoMod, Establecimiento,
    EstablecimientoAdd, EstablecimientoLista, Ministro, MinistroAdd, Parroquia, ParroquiaAdd,
    ParroquiaLista, User, UserLogin,
};

use bcrypt::verify;
use mysql::prelude::*;
use mysql::*;
use opener::open;
use tauri::Manager;
use tauri::Window;

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
fn open_file(filepath: String) {
    if let Err(e) = open(filepath) {
        eprintln!("Error opening file: {}", e);
    }
}

#[tauri::command]
async fn get_all_confirmados() -> Result<Vec<Confirmado>, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let confirmados: Vec<Confirmado> = conn
        .query("select conf.conf_id, conf.usu_id, conf.min_id, conf.est_id,conf.conf_nombres, conf.conf_apellidos, conf.conf_padre_nombre, conf.conf_madre_nombre, conf.conf_padrino1_nombre, conf.conf_padrino1_apellido, conf.conf_padrino2_nombre, conf.conf_padrino2_apellido, conf.conf_fecha, conf.conf_tomo, conf.conf_pagina, conf.conf_numero, min.min_nombre, est.parr_id, est.est_nombre, conf.conf_num_confirmacion from confirmado as conf inner join ministro as min on min.min_id = conf.min_id inner join establecimiento as est on est.est_id = conf.est_id order by conf.conf_id desc")
        .map_err(|e| e.to_string())?;

    Ok(confirmados)
}

#[tauri::command]
async fn get_all_establecimientos() -> Result<Vec<Establecimiento>, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let establecimientos: Vec<Establecimiento> = conn
        .query("select * from establecimiento")
        .map_err(|e| e.to_string())?;

    Ok(establecimientos)
}

#[tauri::command]
async fn get_all_establecimientos_list() -> Result<Vec<EstablecimientoLista>, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let establecimientos: Vec<EstablecimientoLista> = conn
        .query("select est.est_id, parr.parr_id, est.est_nombre, parr.parr_nombre from establecimiento as est inner join parroquia as parr on est.parr_id = parr.parr_id")
        .map_err(|e| e.to_string())?;

    Ok(establecimientos)
}

#[tauri::command]
async fn handle_add_establecimiento(input: EstablecimientoAdd) -> Result<String, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let insert_query = r#"
        INSERT INTO establecimiento (parr_id, est_nombre)
        VALUES (:parr_id, :est_nombre)
    "#;

    conn.exec_drop(
        insert_query,
        params! {
            "parr_id" => &input.parr_id,
            "est_nombre" => &input.est_nombre,
        },
    )
    .map_err(|e| e.to_string())?;

    Ok("Establecimiento añadido".to_string())
}

#[tauri::command]
async fn handle_modify_establecimiento(input: Establecimiento) -> Result<String, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let modify_query = r#"
        UPDATE establecimiento SET parr_id = :parr_id, est_nombre = :est_nombre WHERE est_id = :est_id
    "#;

    conn.exec_drop(
        modify_query,
        params! {
            "est_id" => &input.est_id,
            "parr_id" => &input.parr_id,
            "est_nombre" => &input.est_nombre,
        },
    )
    .map_err(|e| e.to_string())?;

    Ok("Establecimiento modificado".to_string())
}

#[tauri::command]
async fn get_all_ciudades() -> Result<Vec<Ciudad>, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let ciudades: Vec<Ciudad> = conn
        .query("select * from ciudad")
        .map_err(|e| e.to_string())?;

    Ok(ciudades)
}

#[tauri::command]
async fn handle_add_ciudad(input: CiudadAdd) -> Result<String, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let insert_query = r#"
        INSERT INTO ciudad (ciu_nom)
        VALUES (:ciu_nom)
    "#;

    conn.exec_drop(
        insert_query,
        params! {
            "ciu_nom" => &input.ciu_nom,
        },
    )
    .map_err(|e| e.to_string())?;

    Ok("Ciudad añadido".to_string())
}

#[tauri::command]
async fn handle_modify_ciudad(input: Ciudad) -> Result<String, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let modify_query = r#"
        UPDATE ciudad SET ciu_nom = :ciu_nom WHERE ciu_id = :ciu_id
    "#;

    conn.exec_drop(
        modify_query,
        params! {
            "ciu_id" => &input.ciu_id,
            "ciu_nom" => &input.ciu_nom,
        },
    )
    .map_err(|e| e.to_string())?;

    Ok("Ciudad modificado".to_string())
}

#[tauri::command]
async fn get_all_parroquias() -> Result<Vec<ParroquiaLista>, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let parroquias: Vec<ParroquiaLista> = conn
        .query("select parr.parr_id, parr.parr_nombre, parr.ciu_id, ciu.ciu_nom from parroquia as parr inner join ciudad as ciu on parr.ciu_id = ciu.ciu_id")
        .map_err(|e| e.to_string())?;

    Ok(parroquias)
}

#[tauri::command]
async fn handle_add_parroquia(input: ParroquiaAdd) -> Result<String, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let insert_query = r#"
        INSERT INTO parroquia (ciu_id, parr_nombre)
        VALUES (:ciu_id, :parr_nombre)
    "#;

    conn.exec_drop(
        insert_query,
        params! {
            "ciu_id" => &input.ciu_id,
            "parr_nombre" => &input.parr_nombre,
        },
    )
    .map_err(|e| e.to_string())?;

    Ok("Parroquia añadida".to_string())
}

#[tauri::command]
async fn handle_modify_parroquia(input: Parroquia) -> Result<String, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let modify_query = r#"
        UPDATE parroquia SET ciu_id = :ciu_id, parr_nombre = :parr_nombre WHERE parr_id = :parr_id
    "#;

    conn.exec_drop(
        modify_query,
        params! {
            "parr_id" => &input.parr_id,
            "ciu_id" => &input.ciu_id,
            "parr_nombre" => &input.parr_nombre,
        },
    )
    .map_err(|e| e.to_string())?;

    Ok("Parroquia modificada".to_string())
}

#[tauri::command]
async fn get_all_ministros() -> Result<Vec<Ministro>, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let ministros: Vec<Ministro> = conn
        .query("select * from ministro")
        .map_err(|e| e.to_string())?;

    Ok(ministros)
}

#[tauri::command]
async fn handle_add_ministro(input: MinistroAdd) -> Result<String, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let insert_query = r#"
        INSERT INTO ministro (min_nombre)
        VALUES (:min_nombre)
    "#;

    conn.exec_drop(
        insert_query,
        params! {
            "min_nombre" => &input.min_nombre,
        },
    )
    .map_err(|e| e.to_string())?;

    Ok("Ministro añadido".to_string())
}

#[tauri::command]
async fn handle_modify_ministro(input: Ministro) -> Result<String, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let modify_query = r#"
        UPDATE ministro SET min_nombre = :min_nombre WHERE min_id = :min_id
    "#;

    conn.exec_drop(
        modify_query,
        params! {
            "min_id" => &input.min_id,
            "min_nombre" => &input.min_nombre,
        },
    )
    .map_err(|e| e.to_string())?;

    Ok("Ministro modificado".to_string())
}

#[tauri::command]
async fn handle_add_confirmado(input: ConfirmadoAdd) -> Result<String, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let insert_query = r#"
        INSERT INTO confirmado (usu_id, min_id, est_id, conf_nombres, conf_apellidos, conf_fecha, conf_tomo, conf_pagina, conf_numero, conf_padre_nombre, conf_madre_nombre, conf_padrino1_nombre, conf_padrino1_apellido, conf_padrino2_nombre, conf_padrino2_apellido, conf_num_confirmacion)
        VALUES (:usu_id, :min_id, :est_id, :conf_nombres, :conf_apellidos, :conf_fecha, :conf_tomo, :conf_pagina, :conf_numero, :conf_padre_nombre, :conf_madre_nombre, :conf_padrino1_nombre, :conf_padrino1_apellido, :conf_padrino2_nombre, :conf_padrino2_apellido, :conf_num_confirmacion)
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
            "conf_num_confirmacion" => &input.conf_num_confirmacion,
        },
    )
    .map_err(|e| e.to_string())?;

    Ok("Confirmado añadido".to_string())
}

#[tauri::command]
async fn handle_modify_confirmado(input: ConfirmadoMod) -> Result<String, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let modify_query = r#"
        UPDATE confirmado SET min_id = :min_id, est_id = :est_id, conf_nombres = :conf_nombres, conf_apellidos = :conf_apellidos, conf_fecha = :conf_fecha, conf_tomo = :conf_tomo, conf_pagina = :conf_pagina, conf_numero = :conf_numero, conf_padre_nombre = :conf_padre_nombre, conf_madre_nombre = :conf_madre_nombre, conf_padrino1_nombre = :conf_padrino1_nombre, conf_padrino1_apellido = :conf_padrino1_apellido, conf_padrino2_nombre = :conf_padrino2_nombre, conf_padrino2_apellido = :conf_padrino2_apellido, conf_num_confirmacion = :conf_num_confirmacion WHERE conf_id = :conf_id
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
            "conf_num_confirmacion" => &input.conf_num_confirmacion,
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
            handle_modify_confirmado,
            get_all_establecimientos,
            get_all_establecimientos_list,
            handle_add_establecimiento,
            handle_modify_establecimiento,
            get_all_ministros,
            handle_add_ministro,
            handle_modify_ministro,
            get_all_ciudades,
            handle_add_ciudad,
            handle_modify_ciudad,
            get_all_parroquias,
            handle_add_parroquia,
            handle_modify_parroquia,
            open_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
