import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { Package, LayoutDashboard, LogOut, Boxes } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/dashboard" className="brand">
        <Package size={26} />
        <span>StockFlow</span>
      </Link>

      <nav className="nav-links">
        <Link to="/dashboard">
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link to="/products">
          <Boxes size={18} />
          Products
        </Link>
      </nav>

      <button className="logout-button" onClick={handleLogout}>
        <LogOut size={18} />
        Logout
      </button>
    </header>
  );
};

export default Navbar;