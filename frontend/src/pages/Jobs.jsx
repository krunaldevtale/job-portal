import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BsSearch, BsBriefcaseFill } from "react-icons/bs";
import { MdLocationOn, MdWork, MdFilterList } from "react-icons/md";
import axiosInstance from "../utils/axios";

const typeOptions = [
  { value: "", label: "All Types" },
  { value: "fulltime", label: "Full Time" },
  { value: "parttime", label: "Part Time" },
  { value: "internship", label: "Internship" },
  { value: "contract", label: "Contract" },
];

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (location) params.append("location", location);
      if (type) params.append("type", type);

      const res = await axiosInstance.get(`/jobs?${params.toString()}`);
      setJobs(res.data.jobs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on load
  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch when filters change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, location, type]);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 selection:bg-indigo-500 selection:text-white">
      {/* Header & Filter panel */}
      <div className="bg-white border-b border-slate-100 py-16 px-6 relative">
        {/* Background Accent Blobs Container */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto relative z-10"
        >
          <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full mb-3 font-semibold uppercase tracking-wider">
            Explore Openings
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Browse Jobs
          </h1>
          <p className="text-slate-500 mb-10 font-medium">
            Find your perfect role from {loading ? "..." : jobs.length} active opportunities
          </p>

          {/* Search + Filters row */}
          <div className="flex flex-col lg:flex-row gap-4 bg-slate-50 border border-slate-100 p-3 rounded-2xl shadow-sm">
            {/* Search input */}
            <div className="relative flex-1">
              <BsSearch className="absolute left-3.5 top-4 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search job title, skills, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 bg-white placeholder-slate-400 transition-all font-medium"
              />
            </div>

            {/* Location input */}
            <div className="relative min-w-[200px]">
              <MdLocationOn className="absolute left-3.5 top-3.5 text-slate-400 text-lg" />
              <input
                type="text"
                placeholder="Location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 bg-white placeholder-slate-400 transition-all font-medium"
              />
            </div>

            {/* Job Type custom dropdown selection */}
            <div className="relative min-w-[180px]">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 bg-white text-slate-700 font-semibold cursor-pointer transition-all duration-200 select-none text-left"
              >
                <div className="absolute left-3.5 top-[13px] text-slate-400 text-lg pointer-events-none">
                  <MdFilterList />
                </div>
                <span>
                  {typeOptions.find((opt) => opt.value === type)?.label || "All Types"}
                </span>
                <span className={`w-2.5 h-2.5 border-r-2 border-b-2 border-slate-400 transform transition-transform duration-200 pointer-events-none mt-[-3px] ${dropdownOpen ? "rotate-[225deg]" : "rotate-45"}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    {/* Backdrop layer to click close */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 overflow-hidden"
                    >
                      {typeOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setType(opt.value);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-5 py-2.5 text-sm font-semibold transition ${
                            type === opt.value
                              ? "bg-indigo-50 text-indigo-600"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Job Listings main grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Loading skeletons layout */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl" />
                  <div className="w-20 h-6 bg-slate-100 rounded-full" />
                </div>
                <div className="h-5 bg-slate-100 rounded w-3/4 mb-3" />
                <div className="h-4 bg-slate-100 rounded w-1/2 mb-6" />
                <div className="flex gap-2">
                  <div className="h-7 bg-slate-100 rounded-lg w-20" />
                  <div className="h-7 bg-slate-100 rounded-lg w-24" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty Search Results layout */}
        {!loading && jobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm max-w-xl mx-auto my-10"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-5 shadow-inner">
              <BsBriefcaseFill className="text-3xl" />
            </div>
            <h3 className="text-slate-800 font-extrabold text-lg mb-2">No jobs found</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
              We couldn't find matches. Try adjusting your keywords, locations, or types filters.
            </p>
          </motion.div>
        )}

        {/* Loaded Jobs List */}
        {!loading && jobs.length > 0 && (
          <>
            <p className="text-sm text-slate-500 mb-6 font-medium">
              Showing{" "}
              <span className="font-bold text-slate-800">{jobs.length}</span>{" "}
              matching roles
            </p>

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {jobs.map((job) => (
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
                      {/* Logo and Badges */}
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

                      {/* Header details */}
                      <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-indigo-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-slate-500 text-sm font-medium mb-4">
                        {job.company}
                      </p>

                      {/* Info badges */}
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

                    {/* Skill slots */}
                    <div className="flex gap-2 flex-wrap mt-auto">
                      {job.skillsRequired?.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-slate-50 text-slate-600 border border-slate-100 px-2.5 py-1 rounded-lg font-medium hover:bg-slate-100 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skillsRequired?.length > 3 && (
                        <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100/50 px-2.5 py-1 rounded-lg font-semibold select-none">
                          +{job.skillsRequired.length - 3} more
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default Jobs;
