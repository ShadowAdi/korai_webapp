"use server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Use env var in production (keep secret out of code)
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key"; 
const JWT_EXPIRES_IN = "7d"; // or "1h", adjust as needed

export const loginUser = async (formData: {
  email: string;
  password: string;
}) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: formData.email },
    });

    if (!user) {
      return {
        success: false,
        message: "No user found with this email.",
      };
    }

    const isPasswordValid = await bcrypt.compare(formData.password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid password. Please try again.",
      };
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Login failed:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
};
