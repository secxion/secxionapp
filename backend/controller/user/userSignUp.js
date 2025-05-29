import userModel from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "../../utils/mailer.js";
import { updateWalletBalance } from "../wallet/walletController.js";

async function userSignUpController(req, res) {
  try {
    const { name, email, password, tag, profilePic, telegramNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    // Get IP address (support proxies)
    const signupIP =
      req.headers["x-forwarded-for"]?.split(",").shift() ||
      req.socket?.remoteAddress ||
      null;

    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const emailToken = uuidv4();

    const newUser = new userModel({
      name,
      email,
      password: hashPassword,
      tag,
      profilePic,
      telegramNumber,
      role: "GENERAL",
      isVerified: false,
      emailToken,
      signupIP, 
    });

    await newUser.save();

    await updateWalletBalance(
      newUser._id,
      900,
      "credit",
      "Signup Bonus",
      newUser._id.toString(),
      "User"
    );

    await sendVerificationEmail(email, emailToken);

    return res.status(201).json({
      success: true,
      message: "Thank You For Signing Up! ₦900 signup bonus awarded. Please verify your email.",
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Signup failed due to a server error.",
    });
  }
}

export default userSignUpController;
