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
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Custom modern Status badge helper
const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    accepted: "bg-emerald-50 text-emerald-700 border-emerald-100",
    rejected: "bg-rose-50 text-rose-700 border-rose-100",
  };
  const icons = {
    pending: <BsClockFill className="text-xs" />,
    accepted: <BsCheckCircleFill className="text-xs" />,
    rejected: <BsXCircleFill className="text-xs" />,
  };
  return (
    <span
      className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${styles[status]}`}
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

  // Stats sums
  const total = applications.length;
  const pending = applications.filter((a) => a.status === "pending").length;
  const accepted = applications.filter((a) => a.status === "accepted").length;
  const rejected = applications.filter((a) => a.status === "rejected").length;

  const stats = [
    {
      label: "Total Applied",
      value: total,
      gradient: "from-blue-600/10 to-blue-600/5 text-blue-600 border-blue-600/20",
      icon: BsBriefcaseFill,
    },
    {
      label: "Pending",
      value: pending,
      gradient: "from-amber-600/10 to-amber-600/5 text-amber-600 border-amber-600/20",
      icon: BsClockFill,
    },
    {
      label: "Accepted",
      value: accepted,
      gradient: "from-emerald-600/10 to-emerald-600/5 text-emerald-600 border-emerald-600/20",
      icon: BsCheckCircleFill,
    },
    {
      label: "Rejected",
      value: rejected,
      gradient: "from-rose-600/10 to-rose-600/5 text-rose-600 border-rose-600/20",
      icon: BsXCircleFill,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 selection:bg-indigo-500 selection:text-white pb-16">
      {/* Header section */}
      <div className="bg-white border-b border-slate-100 py-12 px-6 relative overflow-hidden mb-10">
        {/* Ambient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 right-20 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto relative z-10"
        >
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 font-medium">
            Track and monitor the status of all your job applications
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Stats Cards grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map(({ label, value, gradient, icon: Icon }) => (
            <motion.div
              key={label}
              variants={cardVariant}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow duration-300"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} border flex items-center justify-center flex-shrink-0`}
              >
                <Icon className="text-lg" />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">{label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Applications List segment */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-6 pb-2.5 border-b border-slate-100">
            <h2 className="font-extrabold text-slate-800 text-xl tracking-tight">
              My Applications
            </h2>
            <Link
              to="/jobs"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition"
            >
              Browse more jobs →
            </Link>
          </div>

          {/* Skeletons loader */}
          {loading && (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl" />
                      <div className="flex-1">
                        <div className="h-4 bg-slate-100 rounded w-1/3 mb-2" />
                        <div className="h-3 bg-slate-100 rounded w-1/4" />
                      </div>
                    </div>
                    <div className="w-20 h-6 bg-slate-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty Applications state */}
          {!loading && applications.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm max-w-xl mx-auto"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-5 shadow-inner">
                <BsBriefcaseFill className="text-3xl" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-lg mb-2">
                No applications yet
              </h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
                You haven't submitted any job applications yet. Apply to jobs to start tracking status here.
              </p>
              <Link
                to="/jobs"
                className="inline-flex bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md transition duration-200"
              >
                Browse Jobs
              </Link>
            </motion.div>
          )}

          {/* Applications list render */}
          {!loading && applications.length > 0 && (
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {applications.map((app) => (
                <motion.div
                  key={app._id}
                  variants={cardVariant}
                  whileHover={{ x: 3, transition: { duration: 0.2 } }}
                  className={`bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-[0_12px_30px_rgba(0,0,0,0.03)] hover:border-indigo-100/50 transition-all duration-300 relative border-l-4 ${
                    app.status === "pending"
                      ? "border-l-amber-500"
                      : app.status === "accepted"
                        ? "border-l-emerald-500"
                        : "border-l-rose-500"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      {/* Logo box */}
                      <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center font-bold text-base border border-slate-100 shadow-sm uppercase flex-shrink-0">
                        {app.job?.company?.slice(0, 2).toUpperCase()}
                      </div>

                      <div>
                        <h3 className="font-extrabold text-slate-800 text-lg tracking-tight mb-0.5">
                          {app.job?.title}
                        </h3>
                        <p className="text-sm font-semibold text-slate-500 mb-3">
                          {app.job?.company}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                            <MdLocationOn className="text-slate-400" />
                            {app.job?.location}
                          </span>
                          <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                            <MdWork className="text-slate-400" />
                            {app.job?.salary}
                          </span>
                          <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                            <BsClockFill className="text-slate-400 text-xs" />
                            {new Date(app.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side options */}
                    <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-3 flex-shrink-0 border-t border-slate-50 pt-3 sm:border-0 sm:pt-0">
                      <StatusBadge status={app.status} />
                      <Link
                        to={`/jobs/${app.job?._id}`}
                        className="text-xs bg-indigo-50 hover:bg-indigo-100/80 text-indigo-600 border border-indigo-100/50 px-3.5 py-1.5 rounded-xl transition duration-200 font-bold"
                      >
                        View Job
                      </Link>
                    </div>
                  </div>

                  {/* Cover Letter letterbox message */}
                  {app.coverLetter && (
                    <div className="mt-4 pt-4 border-t border-slate-50">
                      <p className="text-xs text-slate-400 font-semibold italic bg-slate-50/50 border border-slate-100/50 p-3 rounded-xl leading-relaxed">
                        📝 Cover Letter: "{app.coverLetter}"
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
