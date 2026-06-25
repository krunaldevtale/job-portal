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
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
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
          Start your
          <br />
          career journey
        </h1>
        <p className="text-blue-100 text-base max-w-xs">
          Create your account as a candidate or recruiter and take the next step
          today.
        </p>

        {/* Steps */}
        <div className="mt-12 space-y-4">
          {[
            { step: "01", text: "Create your account" },
            { step: "02", text: "Complete your profile" },
            { step: "03", text: "Apply to your dream job" },
          ].map(({ step, text }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <span className="bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                {step}
              </span>
              <span className="text-blue-100 text-sm">{text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right Side — Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <motion.div className="w-full max-w-sm">
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
                Create account
              </h2>
              <p className="text-gray-500 text-sm">
                Join JobPortal today — it's free
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <motion.div variants={itemVariants}>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Full Name
                </label>
                <div className="relative">
                  <MdPerson className="absolute left-3 top-3 text-gray-400 text-base" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Krunal Shah"
                    required
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-gray-300"
                  />
                </div>
              </motion.div>

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
                    placeholder="Min 6 characters"
                    required
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-gray-300"
                  />
                </div>
              </motion.div>

              {/* Role Toggle */}
              <motion.div variants={itemVariants}>
                <label className="text-xs font-medium text-gray-600 mb-2 block">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "candidate", label: "🙋 Candidate" },
                    { value: "recruiter", label: "🏢 Recruiter" },
                  ].map((r) => (
                    <motion.button
                      key={r.value}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        setFormData({ ...formData, role: r.value })
                      }
                      className={`py-2.5 rounded-lg text-sm font-medium border transition ${
                        formData.role === r.value
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-500 border-gray-200 hover:border-blue-400"
                      }`}
                    >
                      {r.label}
                    </motion.button>
                  ))}
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
                  "Create Account"
                )}
              </motion.button>
            </form>

            <motion.p
              variants={itemVariants}
              className="text-sm text-gray-500 text-center mt-6"
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Login
              </Link>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
