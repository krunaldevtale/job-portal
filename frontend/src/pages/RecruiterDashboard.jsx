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

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-start justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-gray-500 text-sm">
              Manage your job postings and applicants
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition"
          >
            <MdAdd className="text-lg" />
            Post a Job
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10"
        >
          {[
            {
              label: "Jobs Posted",
              value: jobs.length,
              icon: BsBriefcaseFill,
              color: "bg-blue-50 text-blue-600",
            },
            {
              label: "Total Applicants",
              value: totalApplicants,
              icon: BsPeopleFill,
              color: "bg-purple-50 text-purple-600",
            },
          ].map(({ label, value, icon: Icon, color }) => (
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

        {/* Jobs List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="font-semibold text-gray-900 text-lg mb-5">
            Your Job Postings
          </h2>

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
                    <div className="h-8 bg-gray-200 rounded w-24" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && jobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl border border-gray-100 p-16 text-center"
            >
              <BsBriefcaseFill className="text-gray-300 text-5xl mx-auto mb-4" />
              <h3 className="font-medium text-gray-500 mb-2">
                No jobs posted yet
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Post your first job to start finding candidates
              </p>
              <button
                onClick={() => setShowPostModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
              >
                Post a Job
              </button>
            </motion.div>
          )}

          {/* Jobs */}
          {!loading && jobs.length > 0 && (
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {jobs.map((job) => (
                <motion.div
                  key={job._id}
                  variants={cardVariant}
                  className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {job.company?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-0.5">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {job.company}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <MdLocationOn />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <MdWork />
                            {job.salary}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-medium ${
                              job.type === "fulltime"
                                ? "bg-green-50 text-green-600"
                                : "bg-purple-50 text-purple-600"
                            }`}
                          >
                            {job.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewApplicants(job)}
                        className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition font-medium"
                      >
                        <BsPeopleFill />
                        Applicants
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="flex items-center gap-1 text-xs bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg transition font-medium"
                      >
                        <MdDelete />
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

      {/* ── Post Job Modal ── */}
      <AnimatePresence>
        {showPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Post a New Job
                </h3>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <MdClose className="text-xl" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Frontend Developer"
                    value={jobForm.title}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, title: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TechCorp"
                    value={jobForm.company}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, company: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Location + Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                      Location *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Pune"
                      value={jobForm.location}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, location: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                      Job Type
                    </label>
                    <select
                      value={jobForm.type}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, type: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="fulltime">Full Time</option>
                      <option value="parttime">Part Time</option>
                      <option value="internship">Internship</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>
                </div>

                {/* Salary */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                    Salary
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 6-8 LPA"
                    value={jobForm.salary}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, salary: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                    Job Description *
                  </label>
                  <textarea
                    placeholder="Describe the role, responsibilities..."
                    value={jobForm.description}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                    Skills Required
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="e.g. React"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addSkill())
                      }
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                      Add
                    </button>
                  </div>
                  {/* Skill Tags */}
                  <div className="flex flex-wrap gap-2">
                    {jobForm.skillsRequired.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg"
                      >
                        {skill}
                        <button onClick={() => removeSkill(skill)}>
                          <MdClose className="text-xs hover:text-red-500" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowPostModal(false)}
                    className="flex-1 border border-gray-200 text-gray-500 hover:bg-gray-50 font-medium py-2.5 rounded-xl transition text-sm"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handlePostJob}
                    disabled={posting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-medium py-2.5 rounded-xl transition text-sm flex items-center justify-center"
                  >
                    {posting ? (
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
                      "Post Job"
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Applicants Modal ── */}
      <AnimatePresence>
        {showApplicantsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Applicants
                </h3>
                <button
                  onClick={() => setShowApplicantsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <MdClose className="text-xl" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                {selectedJob?.title} · {applicants.length} applicant(s)
              </p>

              {/* No Applicants */}
              {applicants.length === 0 && (
                <div className="text-center py-10">
                  <BsPeopleFill className="text-gray-300 text-4xl mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">
                    No applicants yet for this job
                  </p>
                </div>
              )}

              {/* Applicants List */}
              <div className="space-y-3">
                {applicants.map((app) => (
                  <div
                    key={app._id}
                    className="border border-gray-100 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                          {app.applicant?.name?.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {app.applicant?.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {app.applicant?.email}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                          app.status === "pending"
                            ? "bg-yellow-50 text-yellow-600"
                            : app.status === "accepted"
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-500"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    {/* Cover Letter */}
                    {app.coverLetter && (
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                        "{app.coverLetter}"
                      </p>
                    )}

                    {/* Action Buttons */}
                    {app.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleUpdateStatus(app._id, "accepted")
                          }
                          className="flex items-center gap-1 text-xs bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-lg transition font-medium"
                        >
                          <BsCheckCircleFill />
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(app._id, "rejected")
                          }
                          className="flex items-center gap-1 text-xs bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg transition font-medium"
                        >
                          <BsXCircleFill />
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
