import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";
import { BsBriefcaseFill } from "react-icons/bs";
import axiosInstance from "../utils/axios";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/auth/register", formData);
      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
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
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 9,
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
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 w-full">
          <div className="bg-indigo-600 p-3 rounded-2xl mb-8 inline-block shadow-lg shadow-indigo-600/25">
            <BsBriefcaseFill className="text-white text-3xl" />
          </div>
          <h1 className="text-white text-5xl font-extrabold leading-tight mb-6 tracking-tight">
            Start your
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              career journey
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-sm font-light leading-relaxed">
            Create your account as a candidate or recruiter and take your next big professional step today.
          </p>

          {/* Steps Timeline Badges */}
          <div className="space-y-4 mt-12 w-full">
            {[
              { step: "01", text: "Create your account", emoji: "🙋" },
              { step: "02", text: "Complete your profile", emoji: "📝" },
              { step: "03", text: "Apply to your dream job", emoji: "💼" },
            ].map(({ step, text, emoji }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
                className="bg-slate-900/40 border border-slate-900/60 backdrop-blur-sm rounded-2xl p-4 w-76 flex items-center gap-4 hover:border-slate-800 transition duration-300"
              >
                <span className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">
                  {step}
                </span>
                <span className="text-slate-300 text-sm font-medium flex items-center gap-1.5">
                  <span>{emoji}</span> {text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Column — Beautiful Sign Up Form Card */}
      <div className="flex items-center justify-center p-6 md:p-12 md:h-full md:overflow-y-auto">
        <div className="w-full max-w-md bg-white border border-slate-100 p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-100/50 my-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Mobile Header Logo */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="flex items-center gap-2 mb-6 md:hidden">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                  <BsBriefcaseFill className="text-white text-sm" />
                </div>
                <span className="font-extrabold text-slate-900 tracking-tight">
                  Job<span className="text-indigo-600">Portal</span>
                </span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
                Create account
              </h2>
              <p className="text-slate-500 text-sm">
                Join JobPortal today — it's free
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <motion.div variants={itemVariants}>
                <label className="text-xs font-bold text-slate-600 mb-1.5 block uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <MdPerson className="absolute left-3.5 top-3.5 text-slate-400 text-lg" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </motion.div>

              {/* Email Address */}
              <motion.div variants={itemVariants}>
                <label className="text-xs font-bold text-slate-600 mb-1.5 block uppercase tracking-wider">
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
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <label className="text-xs font-bold text-slate-600 mb-1.5 block uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <MdLock className="absolute left-3.5 top-3.5 text-slate-400 text-lg" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    required
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </motion.div>

              {/* Role Toggle Select */}
              <motion.div variants={itemVariants}>
                <label className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wider">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "candidate", label: "🙋 Candidate" },
                    { value: "recruiter", label: "🏢 Recruiter" },
                  ].map((r) => (
                    <motion.button
                      key={r.value}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setFormData({ ...formData, role: r.value })
                      }
                      className={`py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                        formData.role === r.value
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10"
                          : "bg-slate-50 text-slate-500 border-slate-200/80 hover:border-slate-300"
                      }`}
                    >
                      {r.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition duration-300 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 disabled:opacity-75 flex items-center justify-center mt-6"
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
                  "Create Account"
                )}
              </motion.button>
            </form>

            {/* Bottom Redirect */}
            <motion.p
              variants={itemVariants}
              className="text-sm text-slate-500 text-center mt-6 font-medium"
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-bold hover:text-indigo-700 transition"
              >
                Login
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Register;
