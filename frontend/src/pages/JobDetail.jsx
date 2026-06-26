import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
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

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-24 mb-8" />
          <div className="bg-white rounded-2xl p-8">
            <div className="flex gap-4 mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-xl" />
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/jobs"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition mb-6"
          >
            <MdArrowBack />
            Back to Jobs
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 p-8 mb-4"
        >
          {/* Job Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                {job.company?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {job.title}
                </h1>
                <p className="text-gray-500">{job.company}</p>
              </div>
            </div>

            <span
              className={`text-xs px-3 py-1.5 rounded-full font-medium ${
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

          {/* Job Meta */}
          <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <MdLocationOn className="text-blue-500" />
              {job.location}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <MdWork className="text-blue-500" />
              {job.salary}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <BsPersonFill className="text-blue-500" />
              Posted by {job.postedBy?.name}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <BsClockFill className="text-blue-500" />
              {new Date(job.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">
              Job Description
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Skills Required */}
          {job.skillsRequired?.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold text-gray-900 mb-3">
                Skills Required
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Apply Button */}
          <div className="pt-4 border-t border-gray-100">
            {applied ? (
              <div className="flex items-center gap-2 text-green-600 font-medium">
                ✅ Application submitted successfully!
              </div>
            ) : user?.role === "recruiter" ? (
              <p className="text-sm text-gray-400">
                Recruiters cannot apply to jobs
              </p>
            ) : (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleApply}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-xl transition flex items-center gap-2"
              >
                <BsBriefcaseFill />
                {user ? "Apply Now" : "Login to Apply"}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Apply for {job.title}
            </h3>
            <p className="text-gray-500 text-sm mb-5">
              {job.company} · {job.location}
            </p>

            <label className="text-xs font-medium text-gray-600 mb-1.5 block">
              Cover Letter (optional)
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell the recruiter why you're a great fit..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-500 hover:bg-gray-50 font-medium py-2.5 rounded-xl transition text-sm"
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={submitApplication}
                disabled={applying}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-medium py-2.5 rounded-xl transition text-sm flex items-center justify-center"
              >
                {applying ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  "Submit Application"
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default JobDetail;
