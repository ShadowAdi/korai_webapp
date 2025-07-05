import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log("email ",email)
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Data Not Provided." },
        { status: 500 }
      );
    }
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User Already Exists" },
        { status: 500 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid password. Please try again." },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        token,
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          createdAt: existingUser.createdAt,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to Login user. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
}
