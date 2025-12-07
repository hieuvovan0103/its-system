import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import type { LoginRequest } from "@/types";
import {
  BookOpen,
  AlertCircle,
  Eye,
  EyeOff,
  GraduationCap,
  Users,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      setError("");
      await login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (role: "admin" | "instructor" | "student") => {
    const credentials = {
      admin: "admin@its.edu",
      instructor: "instructor@its.edu",
      student: "student@its.edu",
    };
    setValue("email", credentials[role]);
    setValue("password", "password123");
  };

  const features = [
    { icon: GraduationCap, text: "Personalized Learning Paths" },
    { icon: BarChart3, text: "Real-time Progress Tracking" },
    { icon: Users, text: "Collaborative Learning" },
    { icon: CheckCircle2, text: "Smart Assessments" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-between w-full h-full px-12 xl:px-20 py-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">ITS Platform</span>
          </div>

          {/* Main Content */}
          <div className="space-y-10 my-auto">
            <div className="space-y-6">
              <h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight">
                Intelligent
                <br />
                Tutoring
                <br />
                <span className="text-white/80">System</span>
              </h1>
              <p className="text-lg text-white/70 max-w-sm leading-relaxed">
                Empower your learning journey with AI-driven personalized
                education and real-time feedback.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 text-white/90"
                >
                  <div className="w-11 h-11 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <span className="text-base font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div>
            <p className="text-white/50 text-sm">
              © 2024 ITS Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ITS Platform</h1>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>
            <p className="text-gray-500 mt-2">
              Please enter your credentials to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                id="email"
                autoComplete="off"
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-gray-900 placeholder:text-gray-400"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="off"
                  className="w-full px-4 pr-12 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-gray-900 placeholder:text-gray-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          {/*<div className="mt-8 p-5 bg-white border-2 border-dashed border-gray-200 rounded-xl">*/}
          {/*  <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">*/}
          {/*    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />*/}
          {/*    Quick Demo Access*/}
          {/*  </p>*/}
          {/*  <div className="grid grid-cols-3 gap-2">*/}
          {/*    <button*/}
          {/*      type="button"*/}
          {/*      onClick={() => fillDemoCredentials("admin")}*/}
          {/*      className="px-3 py-2.5 text-xs font-medium bg-gradient-to-r from-red-50 to-orange-50 text-red-700 rounded-lg hover:from-red-100 hover:to-orange-100 transition-all border border-red-100"*/}
          {/*    >*/}
          {/*      Admin*/}
          {/*    </button>*/}
          {/*    <button*/}
          {/*      type="button"*/}
          {/*      onClick={() => fillDemoCredentials("instructor")}*/}
          {/*      className="px-3 py-2.5 text-xs font-medium bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-lg hover:from-blue-100 hover:to-cyan-100 transition-all border border-blue-100"*/}
          {/*    >*/}
          {/*      Instructor*/}
          {/*    </button>*/}
          {/*    <button*/}
          {/*      type="button"*/}
          {/*      onClick={() => fillDemoCredentials("student")}*/}
          {/*      className="px-3 py-2.5 text-xs font-medium bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-all border border-green-100"*/}
          {/*    >*/}
          {/*      Student*/}
          {/*    </button>*/}
          {/*  </div>*/}
          {/*  <p className="text-xs text-gray-400 mt-3 text-center">*/}
          {/*    Click a role to auto-fill credentials*/}
          {/*  </p>*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
}
