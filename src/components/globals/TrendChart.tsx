"use client";
import { ReportResponse } from "@/types/Types";
import { formatDate } from "@/utils/Dashboard";
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  Line,
} from "recharts";
const TrendChart = ({
  reports,
  selectedTrends,
  setSelectedTrends,
}: {
  reports: ReportResponse[];
  selectedTrends: string[];
  setSelectedTrends: (trends: string[]) => void;
}) => {
  const trendData = React.useMemo(() => {
    return reports
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      .map((report) => {
        const point: { [key: string]: string | number } = {
          date: formatDate(report.createdAt),
        };
        selectedTrends.forEach((name) => {
          const param = report.parameters.find((p) => p.name === name);
          if (param) {
            point[name] = param.value;
          }
        });
        return point;
      });
  }, [reports, selectedTrends]);

  return (
    <div className="bg-white rounded-lg w-full shadow-sm border border-gray-200 p-6 mt-2">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Trends Over Time
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedTrends.map((name, idx) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={
                ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][idx % 5]
              }
              strokeWidth={2}
              dot={{ r: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
