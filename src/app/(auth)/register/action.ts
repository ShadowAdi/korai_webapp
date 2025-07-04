"use server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";



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

