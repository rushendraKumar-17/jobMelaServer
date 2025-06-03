import { sequelize } from "../config/connectDb.js";
import admin from "../models/adminModel.js";
import jwt from "jsonwebtoken";
import mailer from "../services/mailer.js";
const signup = async (req, res) => {
  try {
    let { name, email, password, company,role } = req.body;
    company = company.trim().replace(" ", "").toLowerCase();

    // Validate input
    if (!name || !email || !password || !company ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Check if admin already exists
    const existingAdmin = await admin.findOne({ where: { email } });
    if (existingAdmin && existingAdmin.isVerified) {
      return res.status(400).json({ error: "Admin already exists" });
    }
    

    // Create new admin
    const createdAdmin = await admin.create({
      name,
      email,
      password,
      company,
      isVerified: true,
      role
    });
    // Respond with success

    return res
      .status(201)
      .json({ message: "Admin signed up successfully", admin: createdAdmin });
  } catch (error) {
    res.status(500).json({ message: "Error signing up admin", error });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    // Check if admin exists
    const existingAdmin = await admin.findOne({ where: { email } });
    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    // Check if password matches
    if (existingAdmin.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Check if admin is verified
    if (!existingAdmin.isVerified) {
      return res.status(403).json({ message: "Admin not verified" });
    }
    // Sign in successful
    const token = await jwt.sign(
      { id: existingAdmin.id, email: existingAdmin.email },
      process.env.JWT_SECRET || "secret"
    );
    res
      .status(200)
      .json({
        message: "Admin signed in successfully",
        token,
        company: existingAdmin.company,
      });
  } catch (error) {
    //console.log(error)
    res.status(500).json({ message: "Error signing in admin", error });
  }
};

const verifyUser = async (req, res) => {
  const { email, verificationCode } = req.body;
  //console.log(email, verificationCode)
  try {
    // Validate input
    if (!email || !verificationCode) {
      return res
        .status(400)
        .json({ message: "Email and verification token are required" });
    }

    // Find admin by email
    const existingAdmin = await admin.findOne({ where: { email } });
    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if the verification token matches
    if (existingAdmin.verificationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    // Check if the token has expired
    if (new Date() > existingAdmin.verificationCodeExpiry) {
      return res
        .status(400)
        .json({ message: "Verification token has expired" });
    }

    // Update admin to verified
    await admin.update({ isVerified: true }, { where: { email } });

    res.status(200).json({ message: "Admin verified successfully" });
  } catch (error) {
    //console.error(error);
    res.status(500).json({ message: "Error verifying admin", error });
  }
};

const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const adminDel = await admin.findByPk(id);
    if (!adminDel) {
      return res.status(404).json({ message: "Admin not found" });
    }
    await adminDel.destroy();
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting admin", error });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await admin.findAll();
    res.status(200).json(admins);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching admins", error });
  }
};

const editAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, company, location, phone, role } = req.body;
  try {
    const existingAdmin = await admin.findByPk(id);
    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    await existingAdmin.update({
      name,
      email,
      password,
      company,
      location,
      phone,
      role,
    });
    existingAdmin.save();
    res.status(200).json({ message: "Admin updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating admin", error });
  }
};


const changeRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if(!role){
    return res.status(400).json({ message: "Role is required" });
  }
  try {
    const existingAdmin = await admin.findByPk(id);
    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    await existingAdmin.update({ role });
    existingAdmin.save();
    res.status(200).json({ message: "Admin updated successfully" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error updating admin", error });
  }
}
export default {
  signin,
  signup,
  verifyUser,
  deleteAdmin,
  getAllAdmins,
  editAdmin,
  changeRole
};
