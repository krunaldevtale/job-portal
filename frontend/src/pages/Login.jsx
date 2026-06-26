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
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
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
    <div className="h-fit md:h-[calc(100vh-73px)] md:overflow-hidden grid grid-cols-1 md:grid-cols-2 bg-slate-50 selection:bg-indigo-500 selection:text-white">
      {/* Left Column — Premium Branding Showcase */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex flex-col items-start justify-center bg-slate-950 p-16 relative overflow-hidden border-r border-slate-900"
      >
        {/* Ambient colored background blobs */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-10 -left-10 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10">
          <div className="bg-indigo-600 p-3 rounded-2xl mb-8 inline-block shadow-lg shadow-indigo-600/25">
            <BsBriefcaseFill className="text-white text-3xl" />
          </div>
          <h1 className="text-white text-5xl font-extrabold leading-tight mb-6 tracking-tight">
            Find your next
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              dream role
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-sm font-light leading-relaxed">
            Join thousands of candidates and recruiters connecting everyday on JobPortal.
          </p>

          {/* Floating Badges */}
          <div className="space-y-6 mt-16">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="bg-slate-900/50 border border-slate-800/80 backdrop-blur-md rounded-2xl p-5 w-80 shadow-2xl flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                🚀
              </div>
              <div>
                <p className="text-white text-sm font-semibold">New job posted</p>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  Frontend Developer at TechCorp · Pune
                </p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 4.5,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="bg-slate-900/50 border border-slate-800/80 backdrop-blur-md rounded-2xl p-5 w-80 shadow-2xl flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                ✅
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Application matched</p>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  Your profile matched 92% for this role
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Right Column — Beautiful Login Form Card */}
      <div className="flex items-center justify-center p-6 md:p-12 md:h-full md:overflow-y-auto">
        <motion.div
          className="w-full max-w-md bg-white border border-slate-100 p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-100/50"
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Mobile Header Logo */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex items-center gap-2 mb-6 md:hidden">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                  <BsBriefcaseFill className="text-white text-sm" />
                </div>
                <span className="font-extrabold text-slate-900 tracking-tight">
                  Job<span className="text-indigo-600">Portal</span>
                </span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
                Welcome back
              </h2>
              <p className="text-slate-500 text-sm">
                Login to continue your job search
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Address */}
              <motion.div variants={itemVariants}>
                <label className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wider">
                  Email address
                </label>
                <div className="relative">
                  <MdEmail className="absolute left-3.5 top-3.5 text-slate-400 text-lg" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <label className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <MdLock className="absolute left-3.5 top-3.5 text-slate-400 text-lg" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition duration-300 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 disabled:opacity-70 flex items-center justify-center mt-6"
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

            {/* Bottom Redirect */}
            <motion.p
              variants={itemVariants}
              className="text-sm text-slate-500 text-center mt-8 font-medium"
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 font-bold hover:text-indigo-700 transition"
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
