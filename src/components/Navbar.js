import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("access_token"));
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateAuthStatus = () => {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("tokenChanged", updateAuthStatus);

    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    }

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("tokenChanged", updateAuthStatus);
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };

  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
    setIsLoggedIn(false);
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/clients':
        return 'Clients';
      case '/products':
        return 'Products';
      case '/profile':
        return 'Profile';
      case '/login':
        return 'Login';
      case '/register':
        return 'Register';
      default:
        return 'Manager';
    }
  };

  return (
      <>
        <header className="navbar">
          <button className="menu-button" onClick={toggleMenu}>
            <FiMenu size={30} />
          </button>
          <h1 className="logo">{getPageTitle()}</h1>
          <div className="status" style={{ color: isOnline ? "#4CAF50" : "#F44336" }}>
            {isOnline ? "Online" : "Offline"}
          </div>
        </header>

        {menuOpen && <div className="overlay" onClick={toggleMenu}></div>}

        <nav className={`side-menu ${menuOpen ? "open" : ""}`}>
          <button className="close-button" onClick={toggleMenu}>
            <FiX size={30} />
          </button>
          <ul>
            <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
            <li><Link to="/clients" onClick={toggleMenu}>Clients</Link></li>
            <li><Link to="/products" onClick={toggleMenu}>Products</Link></li>
            <li><Link to="/profile" onClick={toggleMenu}>Profile</Link></li>
            {!isLoggedIn ? (
                <li><Link to="/register" onClick={toggleMenu}>Register</Link></li>
            ) : (
                <li>
                  <button className="logout-button" onClick={handleLogout} style={{ color: "red" }}>
                    Logout
                  </button>
                </li>
            )}
          </ul>
        </nav>
      </>
  );
};

export default Navbar;
