import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  BsSearch,
  BsBriefcaseFill,
  BsPeopleFill,
  BsGraphUpArrow,
} from "react-icons/bs";
import { MdLocationOn, MdWork } from "react-icons/md";
import {
  FaCode,
  FaChartBar,
  FaPaintBrush,
  FaMobileAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaArrowRight,
} from "react-icons/fa";
import axiosInstance from "../utils/axios";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Data
const stats = [
  { icon: BsBriefcaseFill, label: "Jobs Posted", value: "500+" },
  { icon: BsPeopleFill, label: "Candidates", value: "2000+" },
  { icon: BsGraphUpArrow, label: "Placements", value: "300+" },
];

const categories = [
  {
    icon: FaCode,
    label: "Technology",
    count: "120+ jobs",
    color: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
  },
  {
    icon: FaChartBar,
    label: "Marketing",
    count: "80+ jobs",
    color: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
  },
  {
    icon: FaPaintBrush,
    label: "Design",
    count: "60+ jobs",
    color: "bg-violet-500/10 text-violet-500 border border-violet-200/20",
  },
  {
    icon: FaMobileAlt,
    label: "Mobile Dev",
    count: "45+ jobs",
    color: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
  },
];

const steps = [
  {
    step: "01",
    title: "Create Account",
    desc: "Sign up as a candidate or recruiter in seconds to get started",
  },
  {
    step: "02",
    title: "Browse Jobs",
    desc: "Search and filter premium jobs that match your skillset",
  },
  {
    step: "03",
    title: "Get Hired",
    desc: "Apply with a single click and easily track application status",
  },
];

function Home() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const res = await axiosInstance.get("/jobs");
        setFeaturedJobs(res.data.jobs.slice(0, 4));
      } catch (error) {
        console.log(error);
      }
    };
    fetchFeaturedJobs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-indigo-500 selection:text-white">
      {/* ── Hero Section ── */}
      <section className="relative bg-slate-950 text-white py-28 md:py-36 px-6 overflow-hidden border-b border-slate-900">
        {/* Animated Background Blobs */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-16 -left-16 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          {/* Tagline Badge */}
          <motion.div
            variants={cardVariant}
            className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs px-4 py-2 rounded-full mb-8 font-semibold tracking-wider uppercase backdrop-blur-md"
          >
            🚀 <span>Your next career transition starts here</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={cardVariant}
            className="text-5xl md:text-7xl font-extrabold leading-tight md:leading-tight mb-6 tracking-tight"
          >
            Find Your{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Dream Job
            </span>{" "}
            Today
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={cardVariant}
            className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Connect with top-tier recruiters, access thousands of daily updated listings, and take your next big career step.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            variants={cardVariant}
            className="flex items-center bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-2 max-w-xl mx-auto shadow-2xl focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/25 transition-all duration-300"
          >
            <BsSearch className="text-slate-500 ml-4 text-lg flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs, titles, or companies..."
              className="flex-1 bg-transparent px-4 py-3.5 text-slate-200 placeholder-slate-500 text-sm focus:outline-none"
            />
            <Link
              to={`/jobs?search=${search}`}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold px-6 py-3.5 rounded-xl transition duration-300 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 flex-shrink-0 flex items-center gap-2"
            >
              Search
            </Link>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={cardVariant}
            className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mt-20 pt-10 border-t border-slate-900/80"
          >
            {stats.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="text-center p-4 rounded-2xl bg-slate-900/20 border border-slate-900/40 backdrop-blur-sm"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-600/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 mb-2">
                  <Icon className="text-lg" />
                </div>
                <p className="text-2xl md:text-3xl font-extrabold text-white">
                  {value}
                </p>
                <p className="text-slate-500 text-xs mt-1 uppercase tracking-wider font-semibold">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Categories Section ── */}
      <section className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full mb-3 font-semibold uppercase tracking-wider">
              Explore Careers
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Browse by Category
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Find openings across high-demand industrial sectors.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map(({ icon: Icon, label, count, color }) => (
              <motion.div
                key={label}
                variants={cardVariant}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <Link
                  to={`/jobs?search=${label}`}
                  className="group flex flex-col items-center p-8 rounded-2xl border border-slate-200/60 hover:border-indigo-200 hover:shadow-[0_12px_30px_rgba(0,0,0,0.03)] transition-all duration-300 cursor-pointer bg-white"
                >
                  <div className={`p-4 rounded-2xl ${color} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-2xl" />
                  </div>
                  <p className="font-bold text-slate-800 text-base mb-1 group-hover:text-indigo-600 transition-colors">
                    {label}
                  </p>
                  <p className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full font-medium border border-slate-100/50 mt-2">
                    {count}
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Jobs Section ── */}
      <section className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-4"
          >
            <div>
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full mb-3 font-semibold uppercase tracking-wider">
                Recommendations
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
                Featured Jobs
              </h2>
              <p className="text-slate-500">
                Explore handpicked premium roles posted recently.
              </p>
            </div>
            <Link
              to="/jobs"
              className="group text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition flex items-center gap-1.5"
            >
              View all jobs
              <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {featuredJobs.length === 0 ? (
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center text-slate-400 py-16 border border-dashed border-slate-200 rounded-3xl"
            >
              No jobs posted yet. Be the first to post a vacancy!
            </motion.p>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {featuredJobs.map((job) => (
                <motion.div
                  key={job._id}
                  variants={cardVariant}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-[0_15px_45px_-10px_rgba(0,0,0,0.06)] hover:border-indigo-100 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full relative group border-l-4 ${
                    job.type === "fulltime"
                      ? "border-l-emerald-500"
                      : job.type === "internship"
                        ? "border-l-violet-500"
                        : job.type === "parttime"
                          ? "border-l-amber-500"
                          : "border-l-blue-500"
                  }`}
                >
                  <Link to={`/jobs/${job._id}`} className="flex flex-col h-full justify-between">
                    <div>
                      {/* Top Header Row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center font-bold text-base border border-slate-100 shadow-sm uppercase flex-shrink-0">
                          {job.company?.slice(0, 2).toUpperCase()}
                        </div>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider border ${
                            job.type === "fulltime"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : job.type === "internship"
                                ? "bg-violet-50 text-violet-700 border-violet-100"
                                : job.type === "parttime"
                                  ? "bg-amber-50 text-amber-700 border-amber-100"
                                  : "bg-blue-50 text-blue-700 border-blue-100"
                          }`}
                        >
                          {job.type}
                        </span>
                      </div>

                      {/* Title & Company */}
                      <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-indigo-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-slate-500 text-sm font-medium mb-4">
                        {job.company}
                      </p>

                      {/* Location & Salary badges */}
                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-6 border-t border-slate-50 pt-4 flex-wrap">
                        <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1 rounded-md text-slate-500">
                          <MdLocationOn className="text-sm text-slate-400" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5 bg-indigo-50/40 border border-indigo-100/30 px-3 py-1 rounded-md text-indigo-600 font-semibold">
                          <MdWork className="text-sm text-indigo-400" />
                          {job.salary}
                        </span>
                      </div>
                    </div>

                    {/* Skills Required */}
                    <div className="flex gap-2 flex-wrap mt-auto">
                      {job.skillsRequired?.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-slate-50 text-slate-600 border border-slate-100 px-2.5 py-1 rounded-lg font-medium hover:bg-slate-100 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-12 md:hidden">
            <Link
              to="/jobs"
              className="group inline-flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:text-indigo-700"
            >
              View all jobs
              <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full mb-3 font-semibold uppercase tracking-wider">
              Simple Flow
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-slate-500 max-w-sm mx-auto">
              Get connected and hired in three uncomplicated phases.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          >
            {/* Step cards */}
            {steps.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                variants={cardVariant}
                className="group flex flex-col items-center text-center bg-white p-8 rounded-3xl border border-slate-200/50 hover:shadow-lg transition-all duration-300 relative z-10"
              >
                {/* Step Circle with animated ripple */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-indigo-600/25 mb-6 relative">
                  <span className="relative z-10">{step}</span>
                  <div className="absolute -inset-1 bg-indigo-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-3">
                  {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-[240px]">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 px-6 bg-slate-950 relative overflow-hidden border-t border-slate-900">
        {/* Ambient background accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.div
            variants={fadeUp}
            className="bg-gradient-to-br from-indigo-900/40 to-slate-900/60 border border-slate-800/80 backdrop-blur-2xl rounded-3xl p-10 md:p-16"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Ready to Take the Next Step?
            </h2>
            <p className="text-slate-400 mb-10 max-w-lg mx-auto text-sm md:text-base font-light">
              Create an account to browse thousands of premium jobs or publish your openings to hire top candidate talent.
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-950 font-bold px-8 py-4 rounded-xl transition duration-300 shadow-xl shadow-white/5"
                >
                  Browse Jobs
                  <FaArrowRight className="text-xs" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/register"
                  className="inline-flex items-center bg-transparent border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white font-semibold px-8 py-4 rounded-xl transition duration-300"
                >
                  Post a Job
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-6 border-t border-slate-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1.5">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <BsBriefcaseFill className="text-white text-sm" />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">JobPortal</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Simplifying the job hunt and hiring process. Connecting the best talents with the greatest opportunities worldwide.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition duration-300">
                <FaFacebook className="text-sm" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition duration-300">
                <FaTwitter className="text-sm" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition duration-300">
                <FaLinkedin className="text-sm" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition duration-300">
                <FaGithub className="text-sm" />
              </a>
            </div>
          </div>

          {/* Col 2: For Candidates */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">For Candidates</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-white transition duration-200">Browse Jobs</Link>
              </li>
              <li>
                <Link to="/dashboard/candidate" className="hover:text-white transition duration-200">Candidate Dashboard</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition duration-200">Create Account</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Recruiters */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">For Employers</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/register" className="hover:text-white transition duration-200">Post a Vacancy</Link>
              </li>
              <li>
                <Link to="/dashboard/recruiter" className="hover:text-white transition duration-200">Recruiter Dashboard</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition duration-200">Employer Login</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Stay Updated</h4>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              Subscribe to get alerts for the latest career opportunities.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 w-full"
              />
              <button className="bg-indigo-600 text-white font-bold text-xs px-3 py-2 rounded-lg hover:bg-indigo-500 transition duration-200 flex-shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="max-w-6xl mx-auto pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© 2026 JobPortal. All rights reserved. Created and maintained by Krunal Devtale.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
