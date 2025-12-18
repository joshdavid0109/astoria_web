import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.email || !formData.password) {
      setErrorMsg("Enter your email and password.");
      return;
    }

    setLoading(true);
    const success = await login(formData.email, formData.password);
    setLoading(false);

    if (!success) {
      setErrorMsg("Incorrect email or password.");
      return;
    }

    navigate("/");
  }

  return (
    <main className="bg-[#EAEDED] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* LOGO */}
        <div className="text-center mb-4">
          <img
            src="/src/assets/astoria_Logo_gray-nobg.png"
            className="mx-auto h-12 mb-2"
          />
          <h1 className="text-xl font-semibold">Sign in</h1>
        </div>

        {/* CARD */}
        <div className="bg-white border border-gray-300 rounded-md p-6">
          {errorMsg && (
            <div className="mb-3 text-sm text-red-600">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFD814] hover:bg-[#F7CA00] py-2 rounded-md font-medium text-sm"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* LINKS */}
          <div className="mt-4 text-sm">
            <button className="text-blue-600 hover:underline">
              Forgot password?
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-4 text-center text-sm">
          New to Astoria?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline"
          >
            Create your account
          </button>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
