import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BsBriefcaseFill,
  BsClockFill,
  BsCheckCircleFill,
  BsXCircleFill,
} from "react-icons/bs";
import { MdLocationOn, MdWork } from "react-icons/md";
import axiosInstance from "../utils/axios";
import { useAuth } from "../context/AuthContext";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Status badge helper
const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-yellow-50 text-yellow-600",
    accepted: "bg-green-50 text-green-600",
    rejected: "bg-red-50 text-red-500",
  };
  const icons = {
    pending: <BsClockFill className="text-xs" />,
    accepted: <BsCheckCircleFill className="text-xs" />,
    rejected: <BsXCircleFill className="text-xs" />,
  };
  return (
    <span
      className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium capitalize ${styles[status]}`}
    >
      {icons[status]} {status}
    </span>
  );
};

function CandidateDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axiosInstance.get("/applications/my");
        setApplications(res.data.applications);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // Stats
  const total = applications.length;
  const pending = applications.filter((a) => a.status === "pending").length;
  const accepted = applications.filter((a) => a.status === "accepted").length;
  const rejected = applications.filter((a) => a.status === "rejected").length;

  const stats = [
    {
      label: "Total Applied",
      value: total,
      color: "bg-blue-50 text-blue-600",
      icon: BsBriefcaseFill,
    },
    {
      label: "Pending",
      value: pending,
      color: "bg-yellow-50 text-yellow-600",
      icon: BsClockFill,
    },
    {
      label: "Accepted",
      value: accepted,
      color: "bg-green-50 text-green-600",
      icon: BsCheckCircleFill,
    },
    {
      label: "Rejected",
      value: rejected,
      color: "bg-red-50 text-red-500",
      icon: BsXCircleFill,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm">
            Track all your job applications here
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {stats.map(({ label, value, color, icon: Icon }) => (
            <motion.div
              key={label}
              variants={cardVariant}
              className="bg-white rounded-xl border border-gray-100 p-5"
            >
              <div
                className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}
              >
                <Icon className="text-base" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Applications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 text-lg">
              My Applications
            </h2>
            <Link
              to="/jobs"
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              Browse more jobs →
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-40 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-24" />
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && applications.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl border border-gray-100 p-16 text-center"
            >
              <BsBriefcaseFill className="text-gray-300 text-5xl mx-auto mb-4" />
              <h3 className="font-medium text-gray-500 mb-2">
                No applications yet
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Start applying to jobs to track them here
              </p>
              <Link
                to="/jobs"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
              >
                Browse Jobs
              </Link>
            </motion.div>
          )}

          {/* Applications */}
          {!loading && applications.length > 0 && (
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {applications.map((app) => (
                <motion.div
                  key={app._id}
                  variants={cardVariant}
                  whileHover={{ x: 3, transition: { duration: 0.2 } }}
                  className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {/* Company Initials */}
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {app.job?.company?.slice(0, 2).toUpperCase()}
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900 mb-0.5">
                          {app.job?.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {app.job?.company}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <MdLocationOn />
                            {app.job?.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <MdWork />
                            {app.job?.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <BsClockFill />
                            {new Date(app.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={app.status} />
                      <Link
                        to={`/jobs/${app.job?._id}`}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View Job
                      </Link>
                    </div>
                  </div>

                  {/* Cover Letter Preview */}
                  {app.coverLetter && (
                    <div className="mt-3 pt-3 border-t border-gray-50">
                      <p className="text-xs text-gray-400 line-clamp-2">
                        📝 {app.coverLetter}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default CandidateDashboard;
