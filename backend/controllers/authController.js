import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req , res) => {
    try{
        const {username , email , password: rawPassword} = req.body;
        const password = typeof rawPassword === "string" || typeof rawPassword === "number"
            ? String(rawPassword)
            : rawPassword;

        if(!username || !email || !password) {
            return res.status(400).json({
                message:"All fields are required"
            });
        }

        if (typeof password !== "string") {
            return res.status(400).json({
                message: "Password must be a string or number",
            });
        }

        const existingUser = await User.findOne({
            $or:[
               {email} ,
               {username}
            ]
        });

        if(existingUser) {
            return res.status(400).json({
              message:"User already exists"  
            });
        }

        const hashedPassword = await bcrypt.hash(password , 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message:"User registered successfully",
            user: {
                id:user._id,
                username: user.username ,
                email: user.email
            }
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
};

export const login = async (req , res) => {
    try {
        const { email , password: rawPassword } = req.body;
        const password = typeof rawPassword === "string" || typeof rawPassword === "number"
            ? String(rawPassword)
            : rawPassword;

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message:"Email and password are required",

            });
        }

        if (typeof password !== "string") {
            return res.status(400).json({
                success: false,
                message: "Password must be a string or number",
            });
        }

        const user = await User.findOne({email});

        if(!user) {
            return res.status(401).json({
                success: false,
                message:"Invalid email or password",
            });
        }

        if (typeof password !== "string") {
            return res.status(400).json({
                success: false,
                message: "Password must be a string",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(401).json({
                success: false,
                message:"Invalid email or password",

            });
        }

        const token = jwt.sign(
            {
                id:user._id,
                username : user.username ,
            },

            process.env.JWT_SECRET ,
            {
             expiresIn: "7d" ,

            }
        );

        res.status(200).json({
          success:true ,
          message: "Login successful",
          token,
          user: {
            id:user._id,
            username : user.username,
            email: user.email,
          },

        });
    } catch(error) {
        console.error(error);

        res.status(500).json({
            success: false ,
            message: "Server Error",
        });
    }
};


export const getCurrentUser = async(req , res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if(!user) {
            return res.status(404).json({
                success: false,
                message:"User not found ",

            });
        }

        res.status(200).json({
            success:true,
            user,
        });
    } catch(error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};