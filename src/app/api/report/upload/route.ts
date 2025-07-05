import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { parseParameters } from "@/lib/parseParameter";
import { InitializeWorker } from "@/lib/TessarectWorker";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const userId = formData.get("userId") as string;

    if (!file || !name || !userId) {
      return NextResponse.json({ success: false, message: "Missing fields." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length === 0) throw new Error("Empty file");

    const text = await InitializeWorker(buffer);
    const { parameters } = parseParameters(text);

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
            flagged: (p.normalMin !== null && p.value < p.normalMin) || (p.normalMax !== null && p.value > p.normalMax),
          })),
        },
      },
      include: { parameters: true },
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ success: false, message: "Failed to upload report." }, { status: 500 });
  }
}
