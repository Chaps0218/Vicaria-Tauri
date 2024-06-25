import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/estilosNavbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faReceipt,
  faExchangeAlt,
  faSignOutAlt,
  faSun,
  faMoon,
} from '@fortawesome/free-solid-svg-icons';

const data = [
  { link: '/home', label: 'Inicio', icon: faBell },
  { link: '/confirmaciones', label: 'Confirmaciones', icon: faReceipt },
];

const Navbar = () => {
  const [active, setActive] = useState('Inicio');
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  const links = data.map((item) => (
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
    <nav className={`navbar ${darkMode ? 'dark' : 'light'}`}>
      <div className="navbarMain">
        <div className="header">
          <code className="code">v3.1.2</code>
          <button className="theme-toggle" onClick={toggleDarkMode}>
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="linkIcon" />
          </button>
        </div>
        {links}
      </div>
      <div className="footer">
        <a href="#" className="link" onClick={(event) => event.preventDefault()}>
          <FontAwesomeIcon icon={faExchangeAlt} className="linkIcon" />
          <span>Change account</span>
        </a>
        <a href="#" className="link" onClick={(event) => event.preventDefault()}>
          <FontAwesomeIcon icon={faSignOutAlt} className="linkIcon" />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
