import jobModel from "../models/jobModel.js";
import applicationModel from "../models/applicationModel.js";
const getAllJobs = async (req, res) => {
  try {
    const jobs = await jobModel.findAll({
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "title",
        "company",
        "location",
        "createdAt",
        "salary",
        "yearsOfExperience",
      ],
    });
    res.status(200).json(jobs);
  } catch (error) {
    //console.log(error);
    res.status(500).json({ message: "Error fetching jobs", error });
  }
};

const getJobById = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await jobModel.findByPk(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job", error });
  }
};

const createJob = async (req, res) => {
  const {
    title,
    description,
    company,
    location,
    gender,
    minYearOfGraduation,
    maxYearOfGraduation,
    salary,
    yearsOfExperience,
    languagesKnown,
    degrees,
    skills,
    branch,
    requirements,
  } = req.body;
  //console.log(req.body);
  try {
    const newJob = await jobModel.create({
      title,
      description,
      company:company.toLowerCase().replace(" ",""),
      location,
      gender,
      minYearOfGraduation,
      maxYearOfGraduation,
      salary,
      yearsOfExperience,
      languagesKnown,
      degrees,
      skills,
      branch,
      requirements,
      applicationCount: 0,
    });
    res.status(201).json({message:"Job added successfully",newJob});
  } catch (error) {
    //console.log(error)
    res.status(500).json({ message: "Error creating job", error });
  }
};

const deleteJob = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await jobModel.findByPk(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    await job.destroy();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error });
  }
};

const getJobsByCompany = async (req, res) => {
  const { company } = req.params;
  try {
    const jobs = await jobModel.findAll({
      where: { company },
      attributes:["id","title","branch","company","salary","location","yearsOfExperience","applicationCount"],
      order: [["createdAt", "DESC"]],
    });
    if (jobs.length === 0) {
      return res
        .status(404)
        .json({ message: "No jobs found for this company" });
    }
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs by company", error });
  }
};

const applyForJob = async (req, res) => {
  const { jobId } = req.params;

  // Replace with authenticated user info
  const user = req.user;
  console.log(user)
  try {
    const job = await jobModel.findByPk(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const existingApplication = await applicationModel.findOne({
      where: { userId: user.userId, jobId },
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    await applicationModel.create({
      userId: user.userId,
      jobId,
      status: "applied",
      name: user.name || "Anonymous",
      email: user.email || "",
    });

    // Safely increment application count
    job.applicationCount = (job.applicationCount || 0) + 1;
    await job.save();
    //console.log(job.applicationCount);

    return res.status(200).json({ message: "Applied for job successfully" });
  } catch (error) {
    console.error("Apply for job error:", error);
    return res.status(400).json({ message: "Failed to apply for job" });
  }
};

const getApplicationsForJob = async (req, res) => {
  const { jobId } = req.params;
  try {
    const applications = await applicationModel.findAll({
      where: { jobId },
      attributes: ["id", "userId", "status", "name", "createdAt","comments"],
      order: [["createdAt", "DESC"]],
    });
    if (applications.length === 0) {
      return res
        .status(404)
        .json({ message: "No applications found for this job" });
    }
    res.status(200).json(applications);
  } catch (error) {
    //console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching applications for job", error });
  }
};

const editJob = async (req, res) => {
  const { id } = req.params;
  //console.log(id);
  const {
    title,
    description,
    company,
    location,
    gender,
    minYearOfGraduation,
    maxYearOfGraduation,
    salary,
    yearsOfExperience,
    languagesKnown,
    degrees,
    skills,
    branch,
    requirements,
  } = req.body;
  //console.log(req.body);
  try {
    const job = await jobModel.findByPk(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    job.title = title;
    job.description = description;
    job.company = company.toLowerCase().replace(" ","");
    job.location = location;
    job.gender = gender;
    job.minYearOfGraduation = minYearOfGraduation;
    job.maxYearOfGraduation = maxYearOfGraduation;
    job.salary = salary;
    job.yearsOfExperience = yearsOfExperience;
    job.languagesKnown = languagesKnown;
    job.degrees = degrees;
    job.skills = skills;
    job.branch = branch;
    job.requirements = requirements;
    await job.save();
    //console.log(job);
    res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Error updating job", error });
    //console.log(error);
  }
};


const addComment = async (req, res) => {
  const { applicationId } = req.params;
  const { comment, sender } = req.body;

  if (!comment?.trim() || !sender?.trim()) {
    return res.status(400).json({ message: "Sender and comment are required." });
  }

  try {
    const job = await applicationModel.findOne({ where: { id: applicationId } });

    if (!job) {
      return res.status(404).json({ message: "Application not found" });
    }

    const newComment = {
      sender: sender.trim(),
      time: new Date().toISOString(),
      comment: comment.trim(),
    };

    const updatedComments = [...(job.comments || []), newComment];

    job.comments = updatedComments;
    await job.save();

    res.status(200).json({ message: "Comment added successfully", comments: job.comment,newComment:newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

const editApplication = async(req,res)=>{
  const { applicationId } = req.params;
  console.log(applicationId)
  const { status } = req.body;
  try {
    const application = await applicationModel.findByPk(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    application.status = status;
    await application.save();
    res.status(200).json({ message: "Application updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating application", error });
  }
}

export default {
  getAllJobs,
  getJobById,
  createJob,
  deleteJob,
  getJobsByCompany,
  applyForJob,
  getApplicationsForJob,
  editJob,
  addComment,
  editApplication
};
