'use server';
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d";

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
        createdAt: user.createdAt,
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

export const fetchUserByToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { reports: true },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      reports: user.reports,
    };
  } catch (error) {
    console.error("Invalid or expired token:", error);
    return null;
  }
};


export const registerUser = async (formData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: formData.email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "A user with this email already exists.",
      };
    }

    const hashedPassword = await bcrypt.hash(formData.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: formData.name,
        email: formData.email,
        password: hashedPassword,
        createdAt:new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      message: "User registered successfully.",
      user: newUser,
    };
  } catch (error) {
    console.error("Registration failed:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
};

