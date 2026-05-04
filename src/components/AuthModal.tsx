import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, Eye, EyeOff, User } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
  onSuccess: (email?: string) => void;
  isLight: boolean;
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "signup",
  onSuccess,
  isLight,
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem("cmc_users") || "{}");

        if (mode === "signup") {
          if (users[email]) {
            setError("Account already exists. Please log in.");
          } else {
            users[email] = { password };
            localStorage.setItem("cmc_users", JSON.stringify(users));
            onSuccess(email);
            onClose();
          }
        } else {
          if (!users[email] || users[email].password !== password) {
            setError("Invalid email or password");
          } else {
            onSuccess(email);
            onClose();
          }
        }
      } catch (err) {
        setError("An unexpected error occurred");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleSocialLogin = () => {
    setIsLoading(true);
    setError("");
    setTimeout(() => {
      setIsLoading(false);
      onSuccess("social_user@example.com");
      onClose();
    }, 1000);
  };

  const bgClass = isLight ? "bg-white" : "bg-[#1E222D]";
  const textClass = isLight ? "text-[#0F172A]" : "text-white";
  const mutedTextClass = isLight ? "text-gray-500" : "text-gray-400";
  const borderClass = isLight ? "border-gray-200" : "border-[#2A2E39]";
  const inputBgClass = isLight ? "bg-gray-50" : "bg-[#131722]";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-md ${bgClass} rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]`}
        >
          {/* Header */}
          <div
            className={`p-6 border-b ${borderClass} flex items-center justify-between`}
          >
            <h2 className={`text-xl font-bold ${textClass}`}>
              {mode === "login" ? "Log In" : "Create an Account"}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl hover:bg-gray-500/10 transition-colors ${mutedTextClass}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold rounded-xl">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className={`text-sm font-bold ${textClass}`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${mutedTextClass}`}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${borderClass} ${inputBgClass} ${textClass} focus:outline-none focus:border-blue-500 transition-colors text-sm`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={`text-sm font-bold ${textClass}`}>
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${mutedTextClass}`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password..."
                    className={`w-full pl-11 pr-11 py-3 rounded-xl border ${borderClass} ${inputBgClass} ${textClass} focus:outline-none focus:border-blue-500 transition-colors text-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 ${mutedTextClass} hover:${textClass}`}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {mode === "login" && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-blue-500 text-sm font-bold hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors mt-2 flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-r-white animate-spin" />
                )}
                {mode === "login" ? "Log In" : "Create Account"}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className={`absolute inset-0 flex items-center`}>
                  <div className={`w-full border-t ${borderClass}`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span
                    className={`px-2 ${bgClass} ${mutedTextClass} text-xs font-bold uppercase`}
                  >
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleSocialLogin}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 border ${borderClass} ${inputBgClass} rounded-xl hover:opacity-80 transition-opacity`}
                >
                  <img
                    src="https://www.google.com/favicon.ico"
                    className="w-4 h-4"
                    alt="Google"
                  />
                  <span className={`text-sm font-bold ${textClass}`}>
                    Google
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleSocialLogin}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 border ${borderClass} ${inputBgClass} rounded-xl hover:opacity-80 transition-opacity`}
                >
                  <User className={`w-4 h-4 ${textClass}`} />
                  <span className={`text-sm font-bold ${textClass}`}>
                    Apple
                  </span>
                </button>
              </div>
            </div>

            <p className={`mt-8 text-center text-sm ${mutedTextClass}`}>
              {mode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-blue-500 font-bold hover:underline"
              >
                {mode === "login" ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
