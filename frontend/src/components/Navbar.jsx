import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
      className="bg-white/85 backdrop-blur-lg border-b border-slate-100 px-6 py-4 sticky top-0 z-50 transition-all duration-300"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl shadow-md shadow-indigo-600/10 group-hover:scale-105 transition-transform duration-300">
            <BsBriefcaseFill className="text-white text-sm" />
          </div>
          <span className="font-extrabold text-slate-900 text-xl tracking-tight">
            Job<span className="text-indigo-600">Portal</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/jobs"
            className="text-sm text-slate-600 hover:text-indigo-600 font-semibold hover:-translate-y-0.5 transition-all duration-200"
          >
            Browse Jobs
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to={
                  user.role === "recruiter"
                    ? "/dashboard/recruiter"
                    : "/dashboard/candidate"
                }
                className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-indigo-600 font-semibold hover:-translate-y-0.5 transition-all duration-200"
              >
                <MdDashboard className="text-base text-slate-400 group-hover:text-indigo-600" />
                Dashboard
              </Link>

              <span className="text-sm text-slate-700 font-medium bg-slate-50 border border-slate-200/50 px-3.5 py-2 rounded-xl select-none">
                Hi, {user.name.split(" ")[0]} 👋
              </span>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-100/50 px-3.5 py-2 rounded-xl transition duration-200 font-semibold"
              >
                <MdLogout className="text-base" />
                Logout
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm text-slate-600 hover:text-indigo-600 font-semibold px-2 py-1.5 hover:-translate-y-0.5 transition-all duration-200"
              >
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/register"
                  className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl transition duration-300 font-semibold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 block"
                >
                  Sign Up
                </Link>
              </motion.div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-slate-600 hover:text-indigo-600 text-2xl transition duration-200 p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100/60"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {menuOpen ? <MdClose /> : <MdMenu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-slate-100 mt-4 pt-4 flex flex-col gap-4 bg-white"
          >
            <Link
              to="/jobs"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-slate-600 hover:text-indigo-600 font-semibold transition py-1"
            >
              Browse Jobs
            </Link>
            {user ? (
              <div className="flex flex-col gap-4">
                <Link
                  to={
                    user.role === "recruiter"
                      ? "/dashboard/recruiter"
                      : "/dashboard/candidate"
                  }
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-indigo-600 font-semibold transition py-1"
                >
                  <MdDashboard className="text-base" />
                  Dashboard
                </Link>
                <div className="h-[1px] bg-slate-100 w-full" />
                <div className="flex items-center justify-between gap-4 pb-2">
                  <span className="text-sm text-slate-700 font-medium bg-slate-50 border border-slate-200/50 px-3.5 py-2 rounded-xl">
                    Hi, {user.name.split(" ")[0]} 👋
                  </span>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 border border-red-100/50 px-3.5 py-2 rounded-xl transition duration-200 font-semibold"
                  >
                    <MdLogout className="text-base" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-2 border-t border-slate-50 pb-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-slate-600 hover:text-indigo-600 font-semibold transition py-2.5 text-center bg-slate-50 border border-slate-100/60 rounded-xl"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2.5 rounded-xl transition duration-300 block shadow-md shadow-indigo-600/10"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
