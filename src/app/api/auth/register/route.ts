import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Data Not Provided." },
        { status: 500 }
      );
    }
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "A user with this email already exists.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        createdAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Registration failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to register user. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
}
