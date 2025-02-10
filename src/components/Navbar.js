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

      {/* Стили */}
      <style jsx="true">{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 60px;
          background: black;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0;
          z-index: 103;
        }
        
        .status {
          font-size: 22px;
          font-weight: bold;
          margin-right: 20px;
        }

        .logo {
          color: white;
          font-size: 22px;
          margin-left: 15px;
        }

        .menu-button {
          background: none;
          border: none;
          cursor: pointer;
          color: white;
        }

        .side-menu {
          position: fixed;
          top: 0;
          left: -250px;
          width: 250px;
          height: 100%;
          background: #333;
          padding: 20px;
          display: flex;
          flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.3s ease-in-out;
          z-index: 102;
        }

        .side-menu.open {
          transform: translateX(0);
          left: 0;
        }

        .close-button {
          align-self: flex-end;
          background: none;
          border: none;
          cursor: pointer;
          color: white;
        }

        .side-menu ul {
          list-style: none;
          padding: 0;
          margin: 20px 0;
        }

        .side-menu li {
          margin: 15px 0;
        }

        .side-menu a {
          text-decoration: none;
          font-size: 20px;
          color: white;
          display: block;
          padding: 10px;
        }

        .side-menu a:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 101;
        }
      `}</style>
    </>
  );
};

export default Navbar;
