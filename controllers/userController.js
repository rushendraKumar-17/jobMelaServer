import userModel from "../models/userModel.js";
import jobModel from "../models/jobModel.js";
import adminModel from "../models/adminModel.js";
import { sequelize } from "../config/connectDb.js";
import mailer from "../services/mailer.js";
import jwt from "jsonwebtoken";
import applicationModel from "../models/applicationModel.js";
import bcrypt from "bcryptjs";
(async () => {
  try {
    await sequelize.sync({ alter: true }); // creates/updates tables
    console.log("Tables synced");
  } catch (err) {
    //console.error("Error syncing tables:", err);
  }
})();
const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }
  const existingUser = await userModel.findOne({ where: { email } });

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);
  const hashedPassword = await bcrypt.hash(password, 10);
  let user;

  if (existingUser) {
    if (existingUser.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    existingUser.verificationCode = verificationCode;
    existingUser.verificationCodeExpiry = verificationCodeExpiry;
    existingUser.name = name;
    existingUser.password = hashedPassword;
    await existingUser.save();
    user = existingUser;
  } else {
    user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      verificationCode,
      isVerified: false,
      verificationCodeExpiry,
    });
  }

  await mailer(
    email,
    "Verify your account",
    `Your verification code is ${verificationCode}. It will expire in 15 minutes.`
  );

  res.status(201).json({ message: "User registered", userId: user.id });
};
const signIn = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const adminExists = await adminModel.findOne({ where: { email } });
    // console.log(adminExists);
    if (adminExists) {
      
      const passwordMatch = await bcrypt.compare(
        password,
        adminExists.password
      );
      if (adminExists && passwordMatch ) {
        const token = await jwt.sign(
          {
            userId: adminExists.id,
            email: adminExists.email,
            company: adminExists.company,
            role: adminExists.role,
          },
          process.env.JWT_SECRET || "secret"
        );
        return res.status(200).json({
          message: "Admin sign in successful",
          token,
          user: {
            email: adminExists.email,
            name: adminExists.name,
            company: adminExists.company,
            role: adminExists.role,
          },
        });
      }
    }

    const user = await userModel.findOne({ where: { email } });
    const passwordMatch = await bcrypt.compare(password, user?.password);
    console.log(passwordMatch);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!user.isVerified) {
      return res.status(403).json({ error: "User not verified" });
    }
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }
    // Generate a token (this is a placeholder, implement your own token generation logic)
    const token = await jwt.sign(
      { userId: user.id, email: user.email, name: user.name, role: "user" },
      process.env.JWT_SECRET || "secret"
    );
    res.status(200).json({
      message: "User sign in successful",
      token,
      user: {
        role: "user",
        email,
        id:user.id,
        name: user.name,
        phone: user.phone,
        CVUrl: user.CVUrl,
        yearsOfExperience: user.yearsOfExperience,
        skills: user.skills,
        degrees: user.degrees,
        address: user.address,
        yearOfGraduation: user.yearOfGraduation,
        gender: user.gender,
        languages: user.languages,
        formSubmitted: user.formSubmitted,
      },
    });
  } catch (error) {
    //console.error("Sign in error:", error);
    console.log(error);
    res.status(500).json({ error: "Failed to sign in" });
  }
};

const getProfile = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  //console.log("Token:",token);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    // console.log(decoded);
    if (decoded.company) {
      const user = await adminModel.findOne({
        where: { email: decoded.email },
      });
      if (user) {
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;

        return res.status(200).json({ user:{
          company:user.company,
          email:user.email,
          id:user.id,
          name:user.name,
          role:user.role
        } });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    }
    const user = await userModel.findOne({ where: { email: decoded.email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({user:{
      role: "user",
      email:user.email,
      id:user.id,
      name: user.name,
      phone: user.phone,
      CVUrl: user.CVUrl,
      yearsOfExperience: user.yearsOfExperience,
      skills: user.skills,
      degrees: user.degrees,
      address: user.address,
      yearOfGraduation: user.yearOfGraduation,
      gender: user.gender,
      languages: user.languages,
      formSubmitted: user.formSubmitted,
    }});
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
};

const verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;
  //console.log(email, verificationCode);
  if (!email || !verificationCode) {
    return res
      .status(400)
      .json({ error: "Email and verification code are required" });
  }
  try {
    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ error: "User already verified" });
    }
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ error: "Invalid verification code" });
    }
    if (new Date() > user.verificationCodeExpiry) {
      return res.status(400).json({ error: "Verification code expired" });
    }
    user.isVerified = true;
    await user.save();
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    //console.error("Email verification error:", error);
    res.status(500).json({ error: "Failed to verify email" });
  }
};

const getById = async (req, res) => {
  const { id } = req.params;
  const existingUser = await userModel.findOne({ where: { id } });
  //console.log(existingUser);
  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.json(existingUser);
};

const getAppliedJobs = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "User id is required" });
  }
  // console.log(id)
  const existingUser = await userModel.findOne({ where: { id } });
  //console.log(existingUser);
  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }
  const appliedJobs = await applicationModel.findAll({ where: { userId: id } });
  return res.json(appliedJobs);
};

const editProfile = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  // console.log(req.body)
  const {
    name,
    phone,
    CVUrl,
    yearsOfExperience,
    skills,
    degrees,
    address,
    yearOfGraduation,
    gender,
    languages,
  } = req.body;
  try {
    const existingUser = await userModel.findOne({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    existingUser.name = name;
    existingUser.phone = phone;
    existingUser.CVUrl = CVUrl;
    existingUser.yearsOfExperience = yearsOfExperience;
    existingUser.skills = skills;
    existingUser.degrees = degrees;
    existingUser.address = address;
    existingUser.yearOfGraduation = yearOfGraduation;
    existingUser.gender = gender;
    existingUser.languages = languages;
    await existingUser.save();
    return res.json(existingUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to edit user" });
  }
};

const googleFormData = async (req, res) => {
  console.log(req.body.responses);
  const formData = req.body.responses;
  const { Name, Gender, Phone, Email, Address, CV } = formData;

  const yearsOfExperience = formData["Years Of Experience"];
  const skills = formData["Skills (Comma Seperated )"];
  const degrees = formData["Degrees (Comma Seperated )"];
  const yearOfGraduation = formData["Year Of Graduation"];
  const Languages = formData["Languages( Comma Seperated )"]; 
  const existingUser = await userModel.findOne({ where: { email: Email } });

  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  existingUser.name = Name;
  existingUser.phone = Phone;
  existingUser.CVUrl = `https://drive.google.com/file/d/${CV[0]}/view`;
  existingUser.yearsOfExperience = yearsOfExperience;
  existingUser.skills = skills.replace(" ", "").split(",");
  existingUser.degrees = degrees.replace(" ", "").split(",");
  existingUser.address = Address;
  existingUser.yearOfGraduation = yearOfGraduation;
  existingUser.gender = Gender;
  existingUser.formSubmitted = true;
  existingUser.languages = Languages.replace(" ", "").split(",");
  await existingUser.save();
  return res.json(existingUser);
};
export default {
  signUp,
  signIn,
  getProfile,
  verifyEmail,
  getById,
  getAppliedJobs,
  editProfile,
  googleFormData,
};
