import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: Request) {
  try {
    const token = request.headers.get("token");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token not provided." },
        { status: 400 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const reports = await prisma.report.findMany({
      where: { userId: decoded.userId },
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

    const mappedReports = reports.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, reports: mappedReports });
  } catch (error) {
    console.error("Get AllReports failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get reports." },
      { status: 500 }
    );
  }
}
