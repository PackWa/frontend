import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
    }

    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
  };

  return (
    <>
      <header className="navbar">
        <button className="menu-button" onClick={toggleMenu}>
          <FiMenu size={30} />
        </button>
        <h1 className="logo">Менеджер</h1>
        <div className="status" style={{ color: isOnline ? "#4CAF50" : "#F44336" }}>
          {isOnline ? "Онлайн" : "Оффлайн"}
        </div>
      </header>

      {menuOpen && <div className="overlay" onClick={toggleMenu}></div>}

      <nav className={`side-menu ${menuOpen ? "open" : ""}`}>
        <button className="close-button" onClick={toggleMenu}>
          <FiX size={30} />
        </button>
        <ul>
          <li><Link to="/" onClick={toggleMenu}>Главная</Link></li>
          <li><Link to="/clients" onClick={toggleMenu}>Клиенты</Link></li>
          <li><Link to="/products" onClick={toggleMenu}>Продукты</Link></li>
          <li><Link to="/profile" onClick={toggleMenu}>Профиль</Link></li>
          {!isLoggedIn ? (
            <li><Link to="/register" onClick={toggleMenu}>Регистрация</Link></li>
          ) : (
            <li>
              <button className="logout-button" onClick={handleLogout} style={{ color: "red" }}>
                Выход
              </button>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
