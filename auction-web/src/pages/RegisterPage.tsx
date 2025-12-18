import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAppContext();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (success) {
      navigate("/login");
    }
  };

  return (
    <main className="bg-[#EAEDED] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* LOGO */}
        <div className="text-center mb-4">
          <img
            src="/src/assets/astoria_Logo_gray-nobg.png"
            className="mx-auto h-12 mb-2"
          />
          <h1 className="text-xl font-semibold">Create account</h1>
        </div>

        {/* CARD */}
        <div className="bg-white border border-gray-300 rounded-md p-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAME */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Your name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>

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

            {/* CONFIRM */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Re-enter password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-gray-400"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] py-2 rounded-md font-medium text-sm">
              Create your Astoria account
            </button>
          </form>
        </div>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
