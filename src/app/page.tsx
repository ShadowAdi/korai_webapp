"use client";
import { Activity, ChartColumn, Shield, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="flex justify-between items-center p-6 bg-white shadow-sm">
        <div className="flex items-center space-x-2">
          <Activity className="h-8 w-8 text-indigo-600" />
          <span className="text-2xl font-bold text-gray-800">Korai Health</span>
        </div>
        <div className="space-x-4">
          <button
            onClick={() => {
              router.push("/login");
            }}
            className="px-4 py-2 cursor-pointer text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => {
              router.push("/register");
            }}
            className="px-6 py-2 cursor-pointer bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign Up
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Make Your Health Reports
            <span className="text-indigo-600"> Actually Understandable</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Upload your lab reports and instantly get clean, interactive
            insights. Track trends, spot abnormalities, and take control of your
            health data.
          </p>
          <button
            onClick={() => {
              router.push("/login");
            }}
            className="px-8 py-4 cursor-pointer bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transform hover:scale-105 transition-all shadow-lg"
          >
            Try It Now - Upload Your Report
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Upload className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Smart Upload</h3>
            <p className="text-gray-600">
              Upload PDFs or images of your lab reports. Our OCR technology
              extracts all the important data automatically.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <ChartColumn className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Visual Insights</h3>
            <p className="text-gray-600">
              See your health parameters in clean, interactive tables with trend
              analysis and abnormality detection.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Shield className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
            <p className="text-gray-600">
              Your health data is encrypted and secure. We never share your
              personal medical information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
