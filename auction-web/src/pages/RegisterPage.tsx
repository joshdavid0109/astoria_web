import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation 1: Check if name is provided
    if (!formData.name) {
      alert('Please enter your full name');
      return;
    }
    
    // Validation 2: Check if email is provided
    if (!formData.email) {
      alert('Please enter your email address');
      return;
    }
    
    // Validation 3: Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Validation 4: Check if password is provided
    if (!formData.password) {
      alert('Please enter a password');
      return;
    }
    
    // Validation 5: Check minimum password length
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    // Validation 6: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Validation 7: Check if terms are agreed
    if (!formData.agreeTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    // Register user
    if (register({ name: formData.name, email: formData.email })) {
      alert('Registration successful! Welcome to StorageMax!');
      navigate('/');
    } else {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4 py-8">
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Join StorageMax</h1>
            <p className="text-gray-600">Create your account to start bidding and shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a password"
                  required
                  minLength={6}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                className="mt-1 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                required
              />
              <div className="ml-3 text-sm">
                <span className="text-gray-600">
                  I agree to the{' '}
                  <button type="button" className="text-orange-600 hover:text-orange-700 transition-colors">
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button type="button" className="text-orange-600 hover:text-orange-700 transition-colors">
                    Privacy Policy
                  </button>
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">Already have an account? </span>
            <button 
              onClick={() => navigate('/login')}
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
