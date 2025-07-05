"use server";
import { parseParameters } from "@/lib/parseParameter";
import prisma from "@/lib/db";
import jwt from "jsonwebtoken";
import { InitializeWorker } from "@/lib/TessarectWorker";

const JWT_SECRET = process.env.JWT_SECRET!;

export const UploadReport = async (formData: FormData) => {
  try {
    const file = formData.get("file");
    const userId = formData.get("userId");
    const name = formData.get("name");

    if (!(file instanceof File)) {
      console.error("File not found or invalid in FormData");
      throw new Error("No valid file provided");
    }
    if (typeof name !== "string" || typeof userId !== "string") {
      console.error("Invalid name or userId");
      throw new Error("Invalid name or userId");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      console.error("Uploaded file is empty");
      throw new Error("Uploaded file is empty");
    }

    const text = await InitializeWorker(buffer);
    console.log("Extracted text:", text);

    const { parameters } = parseParameters(text);
    console.log("Parsed parameters:", parameters);

    const report = await prisma.report.create({
      data: {
        name,
        userId,
        createdAt: new Date(),
        parameters: {
          create: parameters.map((p: any) => ({
            name: p.name,
            value: p.value,
            unit: p.unit,
            normalMin: p?.normalMin,
            normalMax: p?.normalMax,
            flagged:
              (p.normalMin !== null && p.value < p.normalMin) ||
              (p.normalMax !== null && p.value > p.normalMax),
          })),
        },
      },
      include: { parameters: true },
    });

    console.log("Report created:", report);
    return report;
  } catch (error) {
    console.error("Error in UploadReport:", error);
    throw error;
  }
};

export const GetAllReports = async (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  const reports = await prisma.report.findMany({
    where: {
      userId: decoded.userId,
    },
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
    orderBy: {
      createdAt: "desc",
    },
  });
  return reports;
};

export const GetReport = async (token: string, reportId: string) => {
  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  const reports = await prisma.report.findFirst({
    where: {
      userId: decoded.userId,
      id: reportId,
    },
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
    orderBy: {
      createdAt: "desc",
    },
  });
  return reports;
};
