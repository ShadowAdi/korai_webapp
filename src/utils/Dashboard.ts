import { ParametersResponse } from "@/types/Types";

export const getStatusColor = (status: "abnormal" | "normal"): string => {
  switch (status) {
    case "abnormal":
      return "text-red-600 bg-red-50";
    case "normal":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getParameterStatus = (
  param: ParametersResponse
): "abnormal" | "normal" => {
  return param.flagged ? "abnormal" : "normal";
};

export const getNormalRange = (param: ParametersResponse): string => {
  if (param.normalMin !== null && param.normalMax !== null) {
    return `${param.normalMin} - ${param.normalMax}`;
  } else if (param.normalMax !== null) {
    return `< ${param.normalMax}`;
  } else if (param.normalMin !== null) {
    return `> ${param.normalMin}`;
  }
  return "N/A";
};
