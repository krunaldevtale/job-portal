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
import { FaCode, FaChartBar, FaPaintBrush, FaMobileAlt } from "react-icons/fa";
import axiosInstance from "../utils/axios";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: FaChartBar,
    label: "Marketing",
    count: "80+ jobs",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: FaPaintBrush,
    label: "Design",
    count: "60+ jobs",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: FaMobileAlt,
    label: "Mobile Dev",
    count: "45+ jobs",
    color: "bg-orange-50 text-orange-600",
  },
];

const steps = [
  {
    step: "01",
    title: "Create Account",
    desc: "Sign up as a candidate or recruiter in seconds",
  },
  {
    step: "02",
    title: "Browse Jobs",
    desc: "Search and filter jobs that match your skills",
  },
  {
    step: "03",
    title: "Get Hired",
    desc: "Apply with one click and track your applications",
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
    <div className="min-h-screen">
      {/* ── Hero Section ── */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-24 px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div
            variants={cardVariant}
            className="inline-flex items-center gap-2 bg-white/20 text-white text-sm px-4 py-1.5 rounded-full mb-6"
          >
            🚀 <span>Your next opportunity awaits</span>
          </motion.div>

          <motion.h1
            variants={cardVariant}
            className="text-5xl font-bold leading-tight mb-5"
          >
            Find Your Dream
            <br />
            Job Today
          </motion.h1>

          <motion.p
            variants={cardVariant}
            className="text-blue-100 text-lg mb-10 max-w-xl mx-auto"
          >
            Connect with top recruiters and land your next role. Thousands of
            jobs updated daily.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            variants={cardVariant}
            className="flex items-center bg-white rounded-xl overflow-hidden shadow-xl max-w-lg mx-auto"
          >
            <BsSearch className="text-gray-400 ml-4 text-base flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs, companies..."
              className="flex-1 px-3 py-3.5 text-gray-700 text-sm focus:outline-none"
            />
            <Link
              to={`/jobs?search=${search}`}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-3.5 transition flex-shrink-0"
            >
              Search
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={cardVariant}
            className="flex justify-center gap-10 mt-14 flex-wrap"
          >
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <Icon className="mx-auto mb-1 text-blue-200 text-xl" />
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-blue-200 text-sm">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Categories Section ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Browse by Category
            </h2>
            <p className="text-gray-500">
              Explore opportunities across different fields
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {categories.map(({ icon: Icon, label, count, color }) => (
              <motion.div
                key={label}
                variants={cardVariant}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Link
                  to={`/jobs?search=${label}`}
                  className="flex flex-col items-center p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition cursor-pointer bg-white"
                >
                  <div className={`p-3 rounded-xl ${color} mb-3`}>
                    <Icon className="text-xl" />
                  </div>
                  <p className="font-medium text-gray-800 text-sm">{label}</p>
                  <p className="text-xs text-gray-400 mt-1">{count}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Jobs Section ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Jobs
              </h2>
              <p className="text-gray-500">Latest opportunities just for you</p>
            </div>
            <Link
              to="/jobs"
              className="text-sm text-blue-600 font-medium hover:underline hidden md:block"
            >
              View all jobs →
            </Link>
          </motion.div>

          {featuredJobs.length === 0 ? (
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center text-gray-400 py-10"
            >
              No jobs posted yet. Be the first to post one!
            </motion.p>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {featuredJobs.map((job) => (
                <motion.div
                  key={job._id}
                  variants={cardVariant}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition cursor-pointer"
                >
                  <Link to={`/jobs/${job._id}`}>
                    <div className="flex items-start justify-between mb-3">
                      {/* Company Initials */}
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {job.company?.slice(0, 2).toUpperCase()}
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          job.type === "fulltime"
                            ? "bg-green-50 text-green-600"
                            : job.type === "internship"
                              ? "bg-purple-50 text-purple-600"
                              : job.type === "parttime"
                                ? "bg-yellow-50 text-yellow-600"
                                : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {job.type}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3">{job.company}</p>

                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <MdLocationOn className="text-sm" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <MdWork className="text-sm" />
                        {job.salary}
                      </span>
                    </div>

                    {/* Skills */}
                    <div className="flex gap-1.5 flex-wrap">
                      {job.skillsRequired?.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md"
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

          <div className="text-center mt-8 md:hidden">
            <Link
              to="/jobs"
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              View all jobs →
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              How It Works
            </h2>
            <p className="text-gray-500">Get hired in 3 simple steps</p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {steps.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                variants={cardVariant}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {step}
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute mt-7 ml-48 w-16 border-t-2 border-dashed border-blue-200" />
                )}
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-blue-800">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-bold text-white mb-4"
          >
            Ready to Take the Next Step?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-blue-100 mb-10">
            Browse hundreds of jobs or post your opening today
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex justify-center gap-4 flex-wrap"
          >
            <motion.div whileTap={{ scale: 0.96 }}>
              <Link
                to="/jobs"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-xl transition"
              >
                Browse Jobs
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.96 }}>
              <Link
                to="/register"
                className="border-2 border-white text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-xl transition"
              >
                Post a Job
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <BsBriefcaseFill className="text-white text-sm" />
            </div>
            <span className="font-semibold text-white">JobPortal</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>
            <Link to="/jobs" className="hover:text-white transition">
              Jobs
            </Link>
            <Link to="/login" className="hover:text-white transition">
              Login
            </Link>
            <Link to="/register" className="hover:text-white transition">
              Register
            </Link>
          </div>

          <p className="text-sm">© 2024 JobPortal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
