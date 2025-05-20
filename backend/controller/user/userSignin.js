import bcrypt from 'bcryptjs';
import userModel from '../../models/userModel.js';
import jwt from 'jsonwebtoken';

async function userSignInController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email) return res.status(400).json({ message: "Please provide email", error: true, success: false });
        if (!password) return res.status(400).json({ message: "Please provide password", error: true, success: false });

        const user = await userModel.findOne({ email }).select('+password');

        if (!user) return res.status(404).json({ message: "User not found", error: true, success: false });

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(401).json({ message: "Incorrect password", error: true, success: false });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                message: "Please verify your email before logging in.",
                error: true,
                success: false
            });
        }

        const tokenData = {
            _id: user._id,
            email: user.email,
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: 60 * 60 * 8 });

        const tokenOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/'
        };

        res.cookie("token", token, tokenOptions).status(200).json({
            message: "Login successful",
            data: {
                token,
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                }
            },
            success: true,
            error: false
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

export default userSignInController;
