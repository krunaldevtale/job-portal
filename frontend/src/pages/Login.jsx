import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { MdEmail, MdLock } from "react-icons/md";
import { BsBriefcaseFill } from "react-icons/bs";
import axiosInstance from "../utils/axios";
import { useAuth } from "../context/AuthContext";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      if (res.data.user.role === "recruiter") {
        navigate("/dashboard/recruiter");
      } else {
        navigate("/dashboard/candidate");
      }
    } catch (error) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side — Branding */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex flex-col items-start justify-center bg-blue-600 p-12"
      >
        <div className="bg-white/20 p-3 rounded-xl mb-6">
          <BsBriefcaseFill className="text-white text-2xl" />
        </div>
        <h1 className="text-white text-4xl font-semibold leading-snug mb-4">
          Find your next
          <br />
          dream role
        </h1>
        <p className="text-blue-100 text-base max-w-xs">
          Join thousands of candidates and recruiters on JobPortal.
        </p>

        {/* Floating Cards */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="mt-12 bg-white/20 backdrop-blur rounded-xl p-4 w-64"
        >
          <p className="text-white text-sm font-medium">🎉 New job posted</p>
          <p className="text-blue-100 text-xs mt-1">
            Frontend Developer at TechCorp · Pune
          </p>
        </motion.div>

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{
            repeat: Infinity,
            duration: 3.5,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="mt-3 bg-white/20 backdrop-blur rounded-xl p-4 w-64"
        >
          <p className="text-white text-sm font-medium">
            ✅ Application accepted
          </p>
          <p className="text-blue-100 text-xs mt-1">
            Your profile matched 92% for this role
          </p>
        </motion.div>
      </motion.div>

      {/* Right Side — Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <motion.div
          className="w-full max-w-sm"
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Mobile Logo */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex items-center gap-2 mb-6 md:hidden">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <BsBriefcaseFill className="text-white text-sm" />
                </div>
                <span className="font-semibold text-gray-900">JobPortal</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                Welcome back
              </h2>
              <p className="text-gray-500 text-sm">
                Login to continue your job search
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <motion.div variants={itemVariants}>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Email address
                </label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-3 text-gray-400 text-base" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-gray-300"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <MdLock className="absolute left-3 top-3 text-gray-400 text-base" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-gray-300"
                  />
                </div>
              </motion.div>

              {/* Submit */}
              <motion.button
                variants={itemVariants}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center mt-2"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  "Login"
                )}
              </motion.button>
            </form>

            <motion.p
              variants={itemVariants}
              className="text-sm text-gray-500 text-center mt-6"
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-medium hover:underline"
              >
                Sign up free
              </Link>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
