"use client";
import { ParametersResponse, ReportResponse } from "@/types/Types";
import React, { useEffect, useState } from "react";
import {
  Search,
  FileText,
  AlertTriangle,
  CheckCircle,
  Eye,
  Activity,
} from "lucide-react";
import {
  formatDate,
  getNormalRange,
  getParameterStatus,
  getStatusColor,
} from "@/utils/Dashboard";
import { useUser } from "@/store/UserAuthProvider";
import { useRouter } from "next/navigation";
import TrendChart from "@/components/globals/TrendChart";
import { toast } from "react-toastify";

export default function Dashboard() {
  const router = useRouter();
  const { getToken } = useUser();
  const [reports, setReports] = useState<ReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportResponse | null>(
    null
  );
  const [selectedTrends, setSelectedTrends] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterFlagged, setFilterFlagged] = useState<boolean>(false);
  const filteredReports: ReportResponse[] = reports.filter(
    (report: ReportResponse) =>
      report.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const loadReports = async () => {
      try {
        const token = getToken();
        if (!token) {
          setError("Please log in.");
          return;
        }
        const res = await fetch(`/api/report/getAll`, {
          headers: {
            token,
          },
        });
        const data = await res.json();

        setReports(data.reports || []);
      } catch (err) {
        console.error(err);
        toast.success("Failed to load reports.");
        setError("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  const handleReportClick = (report: ReportResponse): void => {
    setSelectedReport(report);
  };

  const handleUploadClick = (): void => {
    router.push("/home");
  };

  const totalReports: number = reports.length;
  const flaggedParameters: number = reports.reduce(
    (acc, report) => acc + report.parameters.filter((p) => p.flagged).length,
    0
  );

  const totalParameters: number = reports.reduce(
    (acc, report) => acc + report.parameters.length,
    0
  );
  const normalParameters: number = totalParameters - flaggedParameters;

  const availableParameters = React.useMemo(() => {
    const set = new Set<string>();
    reports.forEach((report) => {
      report.parameters.forEach((p) => set.add(p.name));
    });
    return Array.from(set);
  }, [reports]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Medical Reports Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Analyze and track your health parameters
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleUploadClick}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Upload New Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Reports
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalReports}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Parameters
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalParameters}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Flagged Parameters
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {flaggedParameters}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Normal Parameters
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {normalParameters}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filterFlagged}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFilterFlagged(e.target.checked)
                  }
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Show flagged only</span>
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Reports
                </h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {filteredReports.map((report: ReportResponse) => (
                  <div
                    key={report.id}
                    onClick={() => handleReportClick(report)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedReport?.id === report.id
                        ? "bg-indigo-50 border-indigo-200"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {report.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(report.createdAt)}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {report._count.parameters} parameters
                          </span>
                          {report.parameters.some(
                            (p: ParametersResponse) => p.flagged
                          ) && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                              {
                                report.parameters.filter(
                                  (p: ParametersResponse) => p.flagged
                                ).length
                              }{" "}
                              flagged
                            </span>
                          )}
                        </div>
                      </div>
                      <Eye className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Report Details */}
          <div className="lg:col-span-2">
            {selectedReport ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {selectedReport.name}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Created on {formatDate(selectedReport.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                        {selectedReport._count.parameters} parameters
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Parameter
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Value
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Normal Range
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedReport.parameters.map(
                          (param: ParametersResponse) => (
                            <tr
                              key={param.id}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-3 px-4 font-medium text-gray-900">
                                {param.name}
                              </td>
                              <td className="py-3 px-4 text-gray-700">
                                {param.value} {param.unit}
                              </td>
                              <td className="py-3 px-4 text-gray-600">
                                {getNormalRange(param)} {param.unit}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                    getParameterStatus(param)
                                  )}`}
                                >
                                  {getParameterStatus(param) === "abnormal" ? (
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                  ) : (
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                  )}
                                  {getParameterStatus(param) === "abnormal"
                                    ? "Abnormal"
                                    : "Normal"}
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Report
                </h3>
                <p className="text-gray-600">
                  Choose a report from the list to view detailed parameters and
                  analysis.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-1 items-center my-4 mt-8">
          <div className="flex flex-wrap gap-2">
            {availableParameters.map((name) => (
              <label
                key={name}
                className="flex items-center space-x-2 text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  value={name}
                  checked={selectedTrends.includes(name)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTrends((prev) => [...prev, name]);
                    } else {
                      setSelectedTrends((prev) =>
                        prev.filter((item) => item !== name)
                      );
                    }
                  }}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span>{name}</span>
              </label>
            ))}
          </div>

          <TrendChart
            reports={reports}
            selectedTrends={selectedTrends}
            setSelectedTrends={setSelectedTrends}
          />
        </div>
      </div>
    </div>
  );
}
