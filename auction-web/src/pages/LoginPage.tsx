import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation 1: Check if email is provided
    if (!formData.email) {
      alert('Please enter your email address');
      return;
    }
    
    // Validation 2: Check if password is provided
    if (!formData.password) {
      alert('Please enter your password');
      return;
    }
    
    // Validation 3: Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Validation 4: Check minimum password length
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    // Attempt login
    if (login(formData.email, formData.password)) {
      navigate('/');
    } else {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-orange-600 hover:text-orange-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Sign in to your StorageMax account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-orange-600 hover:text-orange-700 transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <button 
              onClick={() => navigate('/register')}
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
