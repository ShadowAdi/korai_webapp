"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUser } from "@/store/UserAuthProvider";
import { BounceLoader } from "react-spinners";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const { globalLoading, user } = useUser();

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (resData.success) {
        if (resData.token) {
          toast.error("Login Successfull");
          localStorage.setItem("token", resData.token);
          router.push("/home");
        } else {
          console.log("Token is not there");
          toast.error("Login succeeded, but token missing!");
        }
      } else {
        console.log(`Login User Failed: ${resData.message}`);
        alert(`Login User Failed: ${resData.message}`);
      }
    } catch (error) {
      toast.error("Login error:");
      console.error("Login error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  if (globalLoading) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <BounceLoader color="#6d22e7" />
      </div>
    );
  }

  React.useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Activity className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">
            Sign in to access your health dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700"
          >
            Login Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => {
                router.push("/register");
              }}
              className="text-indigo-600 cursor-pointer hover:text-indigo-700 font-medium"
            >
              Sign In
            </button>
          </p>
          <button
            onClick={() => {
              router.push("/");
            }}
            className="mt-4 cursor-pointer text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
