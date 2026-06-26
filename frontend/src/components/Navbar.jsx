import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BsBriefcaseFill } from "react-icons/bs";
import { MdDashboard, MdLogout, MdMenu, MdClose } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useState } from "react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <BsBriefcaseFill className="text-white text-sm" />
          </div>
          <span className="font-semibold text-gray-900 text-lg">JobPortal</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/jobs"
            className="text-sm text-gray-500 hover:text-blue-600 transition font-medium"
          >
            Browse Jobs
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={
                  user.role === "recruiter"
                    ? "/dashboard/recruiter"
                    : "/dashboard/candidate"
                }
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition font-medium"
              >
                <MdDashboard className="text-base" />
                Dashboard
              </Link>

              <span className="text-sm text-gray-700 font-medium bg-gray-100 px-3 py-1.5 rounded-lg">
                Hi, {user.name.split(" ")[0]} 👋
              </span>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg transition font-medium"
              >
                <MdLogout className="text-base" />
                Logout
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm text-gray-500 hover:text-blue-600 transition font-medium px-3 py-1.5"
              >
                Login
              </Link>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition font-medium"
                >
                  Sign Up
                </Link>
              </motion.div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-500 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <MdClose /> : <MdMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4 flex flex-col gap-3"
        >
          <Link
            to="/jobs"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-gray-600 font-medium"
          >
            Browse Jobs
          </Link>

          {user ? (
            <>
              <Link
                to={
                  user.role === "recruiter"
                    ? "/dashboard/recruiter"
                    : "/dashboard/candidate"
                }
                onClick={() => setMenuOpen(false)}
                className="text-sm text-gray-600 font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 font-medium text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-gray-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-blue-600 font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}

export default Navbar;
