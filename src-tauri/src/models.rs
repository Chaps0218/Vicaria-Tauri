// src-tauri/src/models.rs
use mysql::prelude::FromRow;
use serde::{Deserialize, Serialize};
use std::fmt::Debug;

#[derive(Serialize, Deserialize, FromRow, Debug)]
pub struct User {
    pub usu_id: i32,
    pub usu_nombre: String,
    pub usu_apellido: String,
    pub usu_rol: String,
    pub usu_user: String,
    pub usu_password: String,
    pub est_id: i32,
}

#[derive(Serialize, Deserialize, FromRow, Debug)]
pub struct UserLogin {
    pub usu_user: String,
    pub usu_password: String,
}

#[derive(Serialize, Deserialize, FromRow)]
pub struct Ciudad {
    pub ciu_id: i32,
    pub ciu_nom: String,
}

#[derive(Serialize, Deserialize, FromRow)]
pub struct CiudadAdd {
    pub ciu_nom: String,
}

#[derive(Serialize, Deserialize, FromRow)]
pub struct Confirmado {
    pub conf_id: i32,
    pub usu_id: i32,
    pub min_id: i32,
    pub est_id: i32,
    pub conf_nombres: String,
    pub conf_apellidos: String,
    pub conf_padre_nombre: Option<String>,
    pub conf_madre_nombre: Option<String>,
    pub conf_padrino1_nombre: Option<String>,
    pub conf_padrino1_apellido: Option<String>,
    pub conf_padrino2_nombre: Option<String>,
    pub conf_padrino2_apellido: Option<String>,
    pub conf_fecha: String,
    pub parr_id: i32,
    pub conf_tomo: i32,
    pub conf_pagina: i32,
    pub conf_numero: i32,
    pub min_nombre: String,
    pub est_nombre: String,
    pub conf_num_confirmacion: i32,
}
#[derive(Serialize, Deserialize, FromRow)]
pub struct ConfirmadoMod {
    pub conf_id: i32,
    pub conf_nombres: String,
    pub usu_id: i32,
    pub min_id: i32,
    pub est_id: i32,
    pub conf_apellidos: String,
    pub conf_padre_nombre: Option<String>,
    pub conf_madre_nombre: Option<String>,
    pub conf_padrino1_nombre: Option<String>,
    pub conf_padrino1_apellido: Option<String>,
    pub conf_padrino2_nombre: Option<String>,
    pub conf_padrino2_apellido: Option<String>,
    pub conf_fecha: String,
    pub conf_tomo: i32,
    pub conf_pagina: i32,
    pub conf_numero: i32,
    pub conf_num_confirmacion: i32,
}
#[derive(Serialize, Deserialize, FromRow)]
pub struct ConfirmadoAdd {
    pub conf_nombres: String,
    pub usu_id: i32,
    pub min_id: i32,
    pub est_id: i32,
    pub conf_apellidos: String,
    pub conf_padre_nombre: Option<String>,
    pub conf_madre_nombre: Option<String>,
    pub conf_padrino1_nombre: Option<String>,
    pub conf_padrino1_apellido: Option<String>,
    pub conf_padrino2_nombre: Option<String>,
    pub conf_padrino2_apellido: Option<String>,
    pub conf_fecha: String,
    pub conf_tomo: i32,
    pub conf_pagina: i32,
    pub conf_numero: i32,
    pub conf_num_confirmacion: i32,
}

#[derive(Serialize, Deserialize, FromRow)]
pub struct Establecimiento {
    pub est_id: i32,
    pub parr_id: i32,
    pub est_nombre: String,
}

#[derive(Serialize, Deserialize, FromRow)]
pub struct EstablecimientoAdd {
    pub parr_id: i32,
    pub est_nombre: String,
}

#[derive(Serialize, Deserialize, FromRow)]
pub struct EstablecimientoLista {
    pub est_id: i32,
    pub parr_id: i32,
    pub est_nombre: String,
    pub parr_nombre: String,
}

#[derive(Serialize, Deserialize, FromRow)]
pub struct ParroquiaLista {
    pub parr_id: i32,
    pub ciu_id: i32,
    pub parr_nombre: String,
    pub ciu_nom: String,
}

#[derive(Serialize, Deserialize, FromRow)]
pub struct Parroquia {
    pub parr_id: i32,
    pub ciu_id: i32,
    pub parr_nombre: String,
}

#[derive(Serialize, Deserialize, FromRow)]
pub struct ParroquiaAdd {
    pub ciu_id: i32,
    pub parr_nombre: String,
}

#[derive(Serialize, Deserialize, FromRow)]
pub struct Ministro {
    pub min_id: i32,
    pub min_nombre: String,
}

#[derive(Serialize, Deserialize, FromRow)]
pub struct MinistroAdd {
    pub min_nombre: String,
}
