import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { MdLocationOn, MdWork, MdArrowBack } from "react-icons/md";
import { BsBriefcaseFill, BsClockFill, BsPersonFill } from "react-icons/bs";
import axiosInstance from "../utils/axios";
import { useAuth } from "../context/AuthContext";

function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axiosInstance.get(`/jobs/${id}`);
        setJob(res.data.job);
      } catch (error) {
        toast.error("Job not found");
        navigate("/jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      toast.error("Please login to apply");
      navigate("/login");
      return;
    }
    if (user.role === "recruiter") {
      toast.error("Recruiters cannot apply to jobs");
      return;
    }
    setShowModal(true);
  };

  const submitApplication = async () => {
    setApplying(true);
    try {
      await axiosInstance.post(`/applications/${id}`, { coverLetter });
      toast.success("Application submitted successfully!");
      setApplied(true);
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  // Loading skeleton matching modern aesthetics
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-12 px-6">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-5 bg-slate-200 rounded-lg w-28 mb-8" />
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <div className="flex gap-4 mb-6">
              <div className="w-16 h-16 bg-slate-200 rounded-2xl" />
              <div className="flex-1 mt-2">
                <div className="h-6 bg-slate-200 rounded w-2/3 mb-3" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
              </div>
            </div>
            <div className="h-[1px] bg-slate-100 w-full mb-6" />
            <div className="space-y-4">
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-6 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/jobs"
            className="group inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 font-semibold transition mb-8 duration-200"
          >
            <MdArrowBack className="text-base group-hover:-translate-x-0.5 transition-transform" />
            Back to Jobs
          </Link>
        </motion.div>

        {/* Main Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-white rounded-3xl border border-slate-100 p-8 md:p-10 shadow-xl shadow-slate-100/50 mb-6 relative overflow-hidden border-l-4 ${
            job.type === "fulltime"
              ? "border-l-emerald-500"
              : job.type === "internship"
                ? "border-l-violet-500"
                : job.type === "parttime"
                  ? "border-l-amber-500"
                  : "border-l-blue-500"
          }`}
        >
          {/* Job Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center font-bold text-xl border border-slate-100 shadow-sm uppercase flex-shrink-0">
                {job.company?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-1.5">
                  {job.title}
                </h1>
                <p className="text-slate-500 font-semibold text-sm md:text-base">
                  {job.company}
                </p>
              </div>
            </div>

            <span
              className={`text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider border self-start ${
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

          {/* Metadata Icons Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl">
              <MdLocationOn className="text-indigo-500 text-base flex-shrink-0" />
              <span className="font-semibold truncate">{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-indigo-50/40 border border-indigo-100/30 px-3.5 py-2 rounded-xl">
              <MdWork className="text-indigo-600 text-base flex-shrink-0" />
              <span className="font-bold text-indigo-600 truncate">{job.salary}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl col-span-1 md:col-span-1">
              <BsPersonFill className="text-slate-400 text-base flex-shrink-0" />
              <span className="font-semibold truncate">{job.postedBy?.name || "Recruiter"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl">
              <BsClockFill className="text-slate-400 text-base flex-shrink-0" />
              <span className="font-semibold truncate">
                {new Date(job.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          </div>

          {/* Job Description details */}
          <div className="mb-8">
            <h2 className="font-bold text-slate-800 text-lg mb-3 border-b border-slate-50 pb-2.5">
              Job Description
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-medium">
              {job.description}
            </p>
          </div>

          {/* Required Skills list */}
          {job.skillsRequired?.length > 0 && (
            <div className="mb-8">
              <h2 className="font-bold text-slate-800 text-lg mb-3.5 border-b border-slate-50 pb-2.5">
                Skills Required
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-slate-50 text-slate-600 border border-slate-100 px-3.5 py-1.5 rounded-lg font-bold hover:bg-slate-100 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA Row */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            {applied ? (
              <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 border border-emerald-100/50 px-5 py-2.5 rounded-xl text-sm">
                ✅ Application submitted successfully!
              </div>
            ) : user?.role === "recruiter" ? (
              <p className="text-sm text-slate-400 font-semibold italic bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl">
                Recruiters cannot apply to jobs
              </p>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApply}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl transition duration-300 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20"
              >
                <BsBriefcaseFill className="text-sm" />
                {user ? "Apply Now" : "Login to Apply"}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Apply Modal popup */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-8 w-full max-w-md relative overflow-hidden"
            >
              <h3 className="text-xl font-extrabold text-slate-900 mb-1 tracking-tight">
                Apply for {job.title}
              </h3>
              <p className="text-slate-500 text-xs font-semibold mb-6">
                {job.company} · {job.location}
              </p>

              <label className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wider">
                Cover Letter (optional)
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Write a brief pitch telling the recruiter why you're an excellent fit for this role..."
                rows={5}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 bg-slate-50/50 focus:bg-white resize-none mb-6 placeholder:text-slate-400 leading-relaxed"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 font-bold py-3 rounded-xl transition duration-200 text-sm"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={submitApplication}
                  disabled={applying}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-70 text-white font-bold py-3 rounded-xl transition duration-300 text-sm flex items-center justify-center shadow-lg shadow-indigo-600/10"
                >
                  {applying ? (
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
                    "Submit App"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default JobDetail;
