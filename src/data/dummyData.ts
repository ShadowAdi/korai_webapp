import { ReportResponse } from "@/types/Types";

export const mockReports: ReportResponse[] = [
  {
    id: "report-1",
    name: "Blood Test Report - Jan 2025",
    createdAt: "2025-01-15T10:30:00Z",
    _count: { parameters: 8 },
    parameters: [
      {
        id: "p1",
        name: "Hemoglobin",
        value: 14.2,
        unit: "g/dL",
        normalMin: 12.0,
        normalMax: 16.0,
        flagged: false,
      },
      {
        id: "p2",
        name: "White Blood Cells",
        value: 11.5,
        unit: "×10³/μL",
        normalMin: 4.0,
        normalMax: 11.0,
        flagged: true,
      },
      {
        id: "p3",
        name: "Platelets",
        value: 250,
        unit: "×10³/μL",
        normalMin: 150,
        normalMax: 450,
        flagged: false,
      },
      {
        id: "p4",
        name: "Glucose",
        value: 95,
        unit: "mg/dL",
        normalMin: 70,
        normalMax: 100,
        flagged: false,
      },
      {
        id: "p5",
        name: "Cholesterol",
        value: 220,
        unit: "mg/dL",
        normalMin: null,
        normalMax: 200,
        flagged: true,
      },
      {
        id: "p6",
        name: "HDL",
        value: 45,
        unit: "mg/dL",
        normalMin: 40,
        normalMax: 100,
        flagged: false,
      },
      {
        id: "p7",
        name: "LDL",
        value: 150,
        unit: "mg/dL",
        normalMin: null,
        normalMax: 130,
        flagged: true,
      },
      {
        id: "p8",
        name: "Triglycerides",
        value: 125,
        unit: "mg/dL",
        normalMin: null,
        normalMax: 150,
        flagged: false,
      },
    ],
  },
  {
    id: "report-2",
    name: "Comprehensive Metabolic Panel",
    createdAt: "2025-01-10T14:20:00Z",
    _count: { parameters: 6 },
    parameters: [
      {
        id: "p9",
        name: "Sodium",
        value: 142,
        unit: "mmol/L",
        normalMin: 135,
        normalMax: 145,
        flagged: false,
      },
      {
        id: "p10",
        name: "Potassium",
        value: 4.2,
        unit: "mmol/L",
        normalMin: 3.5,
        normalMax: 5.0,
        flagged: false,
      },
      {
        id: "p11",
        name: "Creatinine",
        value: 1.8,
        unit: "mg/dL",
        normalMin: 0.6,
        normalMax: 1.3,
        flagged: true,
      },
      {
        id: "p12",
        name: "BUN",
        value: 25,
        unit: "mg/dL",
        normalMin: 7,
        normalMax: 20,
        flagged: true,
      },
      {
        id: "p13",
        name: "Albumin",
        value: 3.8,
        unit: "g/dL",
        normalMin: 3.5,
        normalMax: 5.0,
        flagged: false,
      },
      {
        id: "p14",
        name: "Total Protein",
        value: 7.2,
        unit: "g/dL",
        normalMin: 6.0,
        normalMax: 8.3,
        flagged: false,
      },
    ],
  },
  {
    id: "report-3",
    name: "Thyroid Function Test",
    createdAt: "2025-01-08T09:15:00Z",
    _count: { parameters: 3 },
    parameters: [
      {
        id: "p15",
        name: "TSH",
        value: 2.1,
        unit: "mIU/L",
        normalMin: 0.4,
        normalMax: 4.0,
        flagged: false,
      },
      {
        id: "p16",
        name: "T4",
        value: 8.5,
        unit: "μg/dL",
        normalMin: 5.0,
        normalMax: 12.0,
        flagged: false,
      },
      {
        id: "p17",
        name: "T3",
        value: 3.2,
        unit: "pg/mL",
        normalMin: 2.3,
        normalMax: 4.2,
        flagged: false,
      },
    ],
  },
];
