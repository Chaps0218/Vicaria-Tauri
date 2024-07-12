import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/estilosNavbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUser } from '../UserContext';
import {
  faBell,
  faReceipt,
  faExchangeAlt,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';

const data = [
  { link: '/home', label: 'Inicio', icon: faBell, permisos: 1 },
  { link: '/confirmaciones', label: 'Confirmaciones', icon: faReceipt, permisos: 1 },
  { link: '/establecimientos', label: 'Establecimientos', icon: faExchangeAlt, permisos: 2 },
  { link: '/ciudades', label: 'Ciudades', icon: faExchangeAlt, permisos: 2 },
  { link: '/ministros', label: 'Ministros', icon: faExchangeAlt, permisos: 2 },
  { link: '/parroquias', label: 'Parroquias', icon: faExchangeAlt, permisos: 2 },
  { link: '/usuarios', label: 'Usuarios', icon: faExchangeAlt, permisos: 2 },
  { link: '/perfil', label: 'Perfil', icon: faExchangeAlt, permisos: 1 }
];

const permisosData = [
  { nivel: 1, nombre: "usuario" },
  { nivel: 2, nombre: "admin" },
  { nivel: 3, nombre: "superadmin" }
];

const Navbar = ({ onLogout }) => {
  const { user } = useUser();
  const [active, setActive] = useState('Inicio');
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  // Obtener el nivel del usuario basado en su rol
  const usuarioNivel = permisosData.find(permiso => permiso.nombre === user.usu_rol)?.nivel;

  // Filtrar los links según el nivel de permisos del usuario
  const links = data
    .filter(item => item.permisos <= usuarioNivel)
    .map((item) => (
      <Link
        className={`link ${item.label === active ? 'active' : ''}`}
        to={item.link}
        key={item.label}
        onClick={() => setActive(item.label)}
      >
        <FontAwesomeIcon icon={item.icon} className="linkIcon" />
        <span>{item.label}</span>
      </Link>
    ));

  return (
    <nav className="navbar light">
      <div className="navbarMain">
        <div className="header">
          <div className='aa gridCentrao3' >
            <img src="src/images/logo_4x.png" alt="Logo Vicaria" width="120vw" height="120vh"></img>
          </div>
        </div>
        {links}
      </div>
      <div className="footer">
        <a href="#" className="link" onClick={(event) => onLogout()}>
          <FontAwesomeIcon icon={faSignOutAlt} className="linkIcon" />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
