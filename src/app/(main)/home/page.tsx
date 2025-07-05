"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/store/UserAuthProvider";
import { UploadReport } from "@/actions/ReportAction";

const HomePage = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { user } = useUser();

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const supportedFormats = [
        "image/png",
        "image/jpeg",
        "image/bmp",
        "image/webp",
      ];
      if (!supportedFormats.includes(selectedFile.type)) {
        setError(
          "Please upload a supported image file (PNG, JPEG, BMP, WebP)."
        );
        setFile(null);
        setPreview(null);
        return;
      }
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError("File size exceeds 5MB limit.");
        setFile(null);
        setPreview(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      if (droppedFile.size > MAX_FILE_SIZE) {
        setError("File size exceeds 5MB limit.");
        return;
      }
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setError(null);
    } else {
      setError("Please upload an image file (e.g., PNG, JPEG).");
    }
  };

  const handleUpload = async () => {
    if (!file || !name) {
      setError("Please select an image file and provide a name for it.");
      return;
    }
    if (!user?.id) {
      setError("User is not logged in.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);
      formData.append("userId", user.id);

      const response = await UploadReport(formData);
      if (!response) {
        setError("Failed to process the report. Please try again.");
        return;
      }
      console.log("respojnse ",response)
    } catch (err) {
      console.error("Error in handleUpload:", err);
      setError(
        err instanceof Error ? err.message : "Unexpected error occurred."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Activity className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Korai Health</h1>
          <p className="text-gray-600 mt-2">
            Upload your lab report image to view health insights
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="report-name">Lab Report Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={error ? "border-red-500" : ""}
            />
          </div>
          <div
            className="space-y-2 border-2 border-dashed border-gray-300 rounded-lg p-4"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <Label htmlFor="report">Upload Lab Report Image</Label>
            <Input
              id="report"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={error ? "border-red-500" : ""}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 max-w-full h-auto rounded-lg"
              />
            )}
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
          >
            {isUploading ? "Uploading..." : "Upload Report"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
