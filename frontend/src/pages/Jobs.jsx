import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BsSearch, BsBriefcaseFill } from "react-icons/bs";
import { MdLocationOn, MdWork, MdFilterList } from "react-icons/md";
import axiosInstance from "../utils/axios";

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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

  // Fetch when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 500); // debounce 500ms
    return () => clearTimeout(timer);
  }, [search, location, type]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Jobs</h1>
          <p className="text-gray-500 mb-8">
            Find your perfect role from {jobs.length}+ opportunities
          </p>

          {/* Search + Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <BsSearch className="absolute left-3 top-3.5 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search job title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>

            {/* Location */}
            <div className="relative">
              <MdLocationOn className="absolute left-3 top-3.5 text-gray-400 text-base" />
              <input
                type="text"
                placeholder="Location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full md:w-44 pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <MdFilterList className="absolute left-3 top-3.5 text-gray-400 text-base" />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full md:w-44 pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none text-gray-600"
              >
                <option value="">All Types</option>
                <option value="fulltime">Full Time</option>
                <option value="parttime">Part Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Job Listings */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && jobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <BsBriefcaseFill className="text-gray-300 text-5xl mx-auto mb-4" />
            <h3 className="text-gray-500 font-medium mb-2">No jobs found</h3>
            <p className="text-gray-400 text-sm">
              Try changing your search or filters
            </p>
          </motion.div>
        )}

        {/* Jobs Grid */}
        {!loading && jobs.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Showing{" "}
              <span className="font-medium text-gray-900">{jobs.length}</span>{" "}
              jobs
            </p>

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {jobs.map((job) => (
                <motion.div
                  key={job._id}
                  variants={cardVariant}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition"
                >
                  <Link to={`/jobs/${job._id}`}>
                    {/* Top Row */}
                    <div className="flex items-start justify-between mb-3">
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

                    {/* Title + Company */}
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3">{job.company}</p>

                    {/* Location + Salary */}
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
                      {job.skillsRequired?.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-md">
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
