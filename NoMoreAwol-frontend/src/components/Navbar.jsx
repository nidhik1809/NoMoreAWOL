import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white/10 backdrop-blur-md shadow-md text-white px-6 py-4 flex justify-between items-center fixed top-0 w-full z-50">
      <Link to="/" className="text-2xl font-bold text-rosegold">
        NoMoreAwol
      </Link>
      <ul className="flex space-x-6 font-semibold">
        <li>
          <Link to="/employee-dashboard" className="hover:text-primary">Dashboard</Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="bg-rosegold hover:bg-primary px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
