import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  BsBriefcaseFill,
  BsPeopleFill,
  BsCheckCircleFill,
  BsXCircleFill,
} from "react-icons/bs";
import { MdLocationOn, MdWork, MdAdd, MdClose, MdDelete } from "react-icons/md";
import axiosInstance from "../utils/axios";
import { useAuth } from "../context/AuthContext";

const typeOptions = [
  { value: "fulltime", label: "Full Time" },
  { value: "parttime", label: "Part Time" },
  { value: "internship", label: "Internship" },
  { value: "contract", label: "Contract" },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [posting, setPosting] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);

  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    type: "fulltime",
    salary: "",
    skillsRequired: [],
  });

  // Fetch recruiter's jobs
  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const res = await axiosInstance.get("/jobs");
      // Filter only jobs posted by this recruiter
      const myJobs = res.data.jobs.filter(
        (job) =>
          job.postedBy?._id === user?.id || job.postedBy?.id === user?.id,
      );
      setJobs(myJobs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Post new job
  const handlePostJob = async () => {
    if (
      !jobForm.title ||
      !jobForm.company ||
      !jobForm.description ||
      !jobForm.location
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    setPosting(true);
    try {
      await axiosInstance.post("/jobs", jobForm);
      toast.success("Job posted successfully!");
      setShowPostModal(false);
      setJobForm({
        title: "",
        company: "",
        description: "",
        location: "",
        type: "fulltime",
        salary: "",
        skillsRequired: [],
      });
      fetchMyJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post job");
    } finally {
      setPosting(false);
    }
  };

  // Delete job
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axiosInstance.delete(`/jobs/${jobId}`);
      toast.success("Job deleted");
      fetchMyJobs();
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  // View applicants
  const handleViewApplicants = async (job) => {
    setSelectedJob(job);
    try {
      const res = await axiosInstance.get(`/applications/job/${job._id}`);
      setApplicants(res.data.applications);
      setShowApplicantsModal(true);
    } catch (error) {
      toast.error("Failed to fetch applicants");
    }
  };

  // Update application status
  const handleUpdateStatus = async (applicationId, status) => {
    try {
      await axiosInstance.put(`/applications/${applicationId}`, { status });
      toast.success(`Application ${status}`);
      setApplicants((prev) =>
        prev.map((a) => (a._id === applicationId ? { ...a, status } : a)),
      );
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Add skill tag
  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !jobForm.skillsRequired.includes(skill)) {
      setJobForm({
        ...jobForm,
        skillsRequired: [...jobForm.skillsRequired, skill],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setJobForm({
      ...jobForm,
      skillsRequired: jobForm.skillsRequired.filter((s) => s !== skill),
    });
  };

  const totalApplicants = jobs.reduce(
    (sum, job) => sum + (job.applicantCount || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 selection:bg-indigo-500 selection:text-white pb-16">
      {/* Header section */}
      <div className="bg-white border-b border-slate-100 py-12 px-6 relative overflow-hidden mb-10">
        {/* Accent blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 right-20 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10"
        >
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
              Welcome, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-slate-500 font-medium">
              Manage your job postings and evaluate applicants
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPostModal(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold px-5 py-3 rounded-xl transition duration-300 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20"
          >
            <MdAdd className="text-lg" />
            Post a Job
          </motion.button>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Stats segment */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              label: "Jobs Posted",
              value: jobs.length,
              icon: BsBriefcaseFill,
              gradient: "from-blue-600/10 to-blue-600/5 text-blue-600 border-blue-600/20",
            },
            {
              label: "Total Applicants",
              value: totalApplicants,
              icon: BsPeopleFill,
              gradient: "from-purple-600/10 to-purple-600/5 text-purple-600 border-purple-600/20",
            },
          ].map(({ label, value, icon: Icon, gradient }) => (
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

        {/* Jobs list segment */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-6 pb-2.5 border-b border-slate-100">
            <h2 className="font-extrabold text-slate-800 text-xl tracking-tight">
              Your Job Postings
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
              {jobs.length} listed
            </span>
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
                    <div className="w-20 h-8 bg-slate-100 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty Listings layout */}
          {!loading && jobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm max-w-xl mx-auto"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-5 shadow-inner">
                <BsBriefcaseFill className="text-3xl" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-lg mb-2">
                No jobs posted yet
              </h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
                Publish your first vacancy opening to start collecting candidate job applications.
              </p>
              <button
                onClick={() => setShowPostModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md transition duration-200"
              >
                Post your first Job
              </button>
            </motion.div>
          )}

          {/* Jobs Listing grid */}
          {!loading && jobs.length > 0 && (
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-4"
            >
              {jobs.map((job) => (
                <motion.div
                  key={job._id}
                  variants={cardVariant}
                  className={`bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-[0_12px_30px_rgba(0,0,0,0.03)] hover:border-indigo-100/50 transition-all duration-300 relative border-l-4 ${
                    job.type === "fulltime"
                      ? "border-l-emerald-500"
                      : job.type === "internship"
                        ? "border-l-violet-500"
                        : job.type === "parttime"
                          ? "border-l-amber-500"
                          : "border-l-blue-500"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      {/* Logo squircle */}
                      <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center font-bold text-base border border-slate-100 shadow-sm uppercase flex-shrink-0">
                        {job.company?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-lg tracking-tight mb-0.5">
                          {job.title}
                        </h3>
                        <p className="text-sm font-semibold text-slate-500 mb-3">
                          {job.company}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                            <MdLocationOn className="text-slate-400" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                            <MdWork className="text-slate-400" />
                            {job.salary}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-full font-bold uppercase border ${
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
                      </div>
                    </div>

                    {/* Listing Action buttons */}
                    <div className="flex items-center gap-3 flex-shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleViewApplicants(job)}
                        className="flex items-center gap-1.5 text-xs bg-indigo-50 hover:bg-indigo-100/80 text-indigo-600 border border-indigo-100/50 px-4 py-2 rounded-xl transition duration-200 font-bold"
                      >
                        <BsPeopleFill className="text-sm" />
                        Applicants ({job.applicantCount || 0})
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="flex items-center gap-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-100/50 px-4 py-2 rounded-xl transition duration-200 font-bold"
                      >
                        <MdDelete className="text-sm" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ── Post Job Modal popup ── */}
      <AnimatePresence>
        {showPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-100 shadow-2xl relative no-scrollbar"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Post a New Job
                </h3>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
                >
                  <MdClose className="text-lg" />
                </button>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                {/* Title */}
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wider">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Frontend Developer"
                    value={jobForm.title}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 bg-slate-50/50 focus:bg-white placeholder:text-slate-400 font-medium transition-all"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wider">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TechCorp Solutions"
                    value={jobForm.company}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, company: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 bg-slate-50/50 focus:bg-white placeholder:text-slate-400 font-medium transition-all"
                  />
                </div>

                {/* Location + Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wider">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pune, IN (Hybrid)"
                      value={jobForm.location}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, location: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 bg-slate-50/50 focus:bg-white placeholder:text-slate-400 font-medium transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wider">
                      Job Type
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 bg-slate-50/50 focus:bg-white text-slate-700 font-semibold cursor-pointer transition-all duration-200 select-none text-left"
                      >
                        <span>
                          {typeOptions.find((opt) => opt.value === jobForm.type)?.label || "Full Time"}
                        </span>
                        <span className={`w-2.5 h-2.5 border-r-2 border-b-2 border-slate-400 transform transition-transform duration-200 pointer-events-none mt-[-3px] ${typeDropdownOpen ? "rotate-[225deg]" : "rotate-45"}`} />
                      </button>

                      <AnimatePresence>
                        {typeDropdownOpen && (
                          <>
                            {/* Backdrop layer to click close */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setTypeDropdownOpen(false)}
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
                                    setJobForm({ ...jobForm, type: opt.value });
                                    setTypeDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-5 py-2.5 text-sm font-semibold transition ${
                                    jobForm.type === opt.value
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
                </div>

                {/* Salary */}
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wider">
                    Salary range
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12 - 18 LPA"
                    value={jobForm.salary}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, salary: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 bg-slate-50/50 focus:bg-white placeholder:text-slate-400 font-medium transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wider">
                    Job Description *
                  </label>
                  <textarea
                    required
                    placeholder="Provide full description of job role responsibilities, perks..."
                    value={jobForm.description}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 bg-slate-50/50 focus:bg-white placeholder:text-slate-400 leading-relaxed transition-all resize-none"
                  />
                </div>

                {/* Skills fields */}
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wider">
                    Skills Required
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="e.g. React"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addSkill())
                      }
                      className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 bg-slate-50/50 focus:bg-white placeholder:text-slate-400 font-medium transition-all"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="bg-indigo-600 text-white font-bold px-5 py-3 rounded-xl hover:bg-indigo-500 transition duration-200 shadow-md shadow-indigo-600/10"
                    >
                      Add
                    </button>
                  </div>
                  {/* Selected Tags list */}
                  <div className="flex flex-wrap gap-2">
                    {jobForm.skillsRequired.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 text-xs bg-slate-50 text-slate-600 border border-slate-100 px-3 py-1.5 rounded-xl font-bold select-none"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-slate-200 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <MdClose className="text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions button rows */}
                <div className="flex gap-3 pt-4 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="flex-1 border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 font-bold py-3 rounded-xl transition duration-200 text-sm"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePostJob}
                    disabled={posting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-70 text-white font-bold py-3 rounded-xl transition duration-300 text-sm flex items-center justify-center shadow-lg shadow-indigo-600/10"
                  >
                    {posting ? (
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
                      "Post Job"
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Applicants Viewer Modal popup ── */}
      <AnimatePresence>
        {showApplicantsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[85vh] overflow-y-auto border border-slate-100 shadow-2xl relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-2 border-b border-slate-50 pb-3">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Applicants List
                </h3>
                <button
                  onClick={() => setShowApplicantsModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
                >
                  <MdClose className="text-lg" />
                </button>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                {selectedJob?.title} · {applicants.length} applicant(s)
              </p>

              {/* No Applicants indicator */}
              {applicants.length === 0 && (
                <div className="text-center py-12 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  <BsPeopleFill className="text-slate-300 text-4xl mx-auto mb-3" />
                  <p className="text-slate-500 text-sm font-semibold">
                    No applicants yet for this job
                  </p>
                </div>
              )}

              {/* Applicants Rows */}
              <div className="space-y-4">
                {applicants.map((app) => (
                  <div
                    key={app._id}
                    className="border border-slate-100 rounded-2xl p-5 bg-white hover:border-slate-200 transition duration-200 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50/60 text-indigo-600 border border-indigo-100/30 flex items-center justify-center font-bold text-sm uppercase flex-shrink-0">
                          {app.applicant?.name?.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800 text-sm">
                            {app.applicant?.name}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">
                            {app.applicant?.email}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${
                          app.status === "pending"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : app.status === "accepted"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-red-50 text-red-700 border-red-100"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    {/* Cover Letter message */}
                    {app.coverLetter && (
                      <div className="bg-slate-50 border border-slate-100/60 p-4 rounded-xl text-xs leading-relaxed text-slate-500 mb-4 font-medium italic relative">
                        "{app.coverLetter}"
                      </div>
                    )}

                    {/* Status updates action button bars */}
                    {app.status === "pending" && (
                      <div className="flex gap-2 border-t border-slate-50 pt-3 mt-3">
                        <button
                          onClick={() =>
                            handleUpdateStatus(app._id, "accepted")
                          }
                          className="flex items-center gap-1.5 text-xs bg-emerald-50 hover:bg-emerald-100/80 text-emerald-600 border border-emerald-100/50 px-4 py-2 rounded-xl transition duration-200 font-bold"
                        >
                          <BsCheckCircleFill className="text-xs" />
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(app._id, "rejected")
                          }
                          className="flex items-center gap-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-100/50 px-4 py-2 rounded-xl transition duration-200 font-bold"
                        >
                          <BsXCircleFill className="text-xs" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RecruiterDashboard;
