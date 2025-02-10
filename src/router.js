import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Agenda from "./pages/Agenda";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Clients from "./pages/Clients";
import Products from "./pages/Products";

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Agenda />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
