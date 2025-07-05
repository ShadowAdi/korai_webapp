import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  try {
    const { reportId } = await request.json();
    const token = request.headers.get("token");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token not provided." },
        { status: 400 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const report = await prisma.report.findFirst({
      where: { userId: decoded.userId, id: reportId },
      select: {
        createdAt: true,
        id: true,
        name: true,
        parameters: {
          select: {
            id: true,
            name: true,
            flagged: true,
            normalMax: true,
            normalMin: true,
            unit: true,
            value: true,
          },
        },
        _count: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("GetReport failed:", error);
    return NextResponse.json(null, { status: 500 });
  }
}
