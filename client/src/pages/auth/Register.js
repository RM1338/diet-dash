import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { EyeIcon, EyeSlashIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    avatar: '🧑'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const avatars = ['🧑', '👦', '👧', '🧒', '👨', '👩', '🧑‍🎓', '👨‍🎓', '👩‍🎓'];

  const roles = [
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'parent', label: 'Parent' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleSelect = (roleValue) => {
    setFormData({ ...formData, role: roleValue });
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registerData } = formData;
    registerData.profile = { avatar: formData.avatar };

    const result = await register(registerData);

    if (result.success) {
      console.log('Registration successful, redirecting to dashboard');
      window.location.href = '/';
    } else {
      setError(result.message);
      console.error('Registration failed:', result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 glass-strong p-10 rounded-3xl animate-fade-in">
        <div>
          <div className="flex justify-center">
            <span className="text-7xl animate-bounce">🥗</span>
          </div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-readable bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Join NutriQuest
          </h2>
          <p className="mt-3 text-center text-base" style={{ color: 'var(--color-text-secondary)' }}>
            Start your nutrition learning adventure
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="glass-strong border border-red-500 border-opacity-50 text-red-600 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Avatar Selection - 5 in first row, 4 centered in second row */}
            <div>
              <label className="block text-sm font-bold mb-2 text-readable">
                Choose Your Avatar
              </label>
              <div className="flex flex-col items-center gap-2">
                {/* First row - 5 avatars */}
                <div className="flex gap-2">
                  {avatars.slice(0, 5).map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar })}
                      className={`text-3xl p-3 rounded-xl transition-all duration-300 ${
                        formData.avatar === avatar
                          ? 'glass-strong ring-2 ring-primary scale-110'
                          : 'glass hover:glass-strong hover:scale-105'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
                {/* Second row - 4 avatars centered */}
                <div className="flex gap-2">
                  {avatars.slice(5).map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar })}
                      className={`text-3xl p-3 rounded-xl transition-all duration-300 ${
                        formData.avatar === avatar
                          ? 'glass-strong ring-2 ring-primary scale-110'
                          : 'glass hover:glass-strong hover:scale-105'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-bold mb-2 text-readable">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="glass appearance-none relative block w-full px-4 py-3 rounded-xl placeholder-opacity-60 text-readable focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Choose a username"
                style={{ color: 'var(--color-text)' }}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-2 text-readable">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="glass appearance-none relative block w-full px-4 py-3 rounded-xl placeholder-opacity-60 text-readable focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter your email"
                style={{ color: 'var(--color-text)' }}
              />
            </div>

            {/* Custom iOS/macOS Dropdown */}
            <div className="relative">
              <label className="block text-sm font-bold mb-2 text-readable">
                I am a...
              </label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="glass relative block w-full px-4 py-3 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
              >
                <span className="text-readable font-semibold">
                  {roles.find(r => r.value === formData.role)?.label}
                </span>
                <ChevronDownIcon 
                  className={`w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-300 text-readable ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 glass-strong rounded-xl overflow-hidden shadow-2xl border border-primary border-opacity-20 animate-fade-in">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => handleRoleSelect(role.value)}
                      className={`w-full px-4 py-3 text-left transition-all duration-200 font-semibold ${
                        formData.role === role.value
                          ? 'bg-gradient-to-r from-primary to-accent text-white'
                          : 'text-readable hover:bg-primary hover:bg-opacity-10 hover:text-primary'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold mb-2 text-readable">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="glass appearance-none relative block w-full px-4 py-3 pr-12 rounded-xl placeholder-opacity-60 text-readable focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Create a password"
                  style={{ color: 'var(--color-text)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-readable hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold mb-2 text-readable">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="glass appearance-none relative block w-full px-4 py-3 pr-12 rounded-xl placeholder-opacity-60 text-readable focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                  style={{ color: 'var(--color-text)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-readable hover:text-primary transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-300 shadow-lg"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="text-center">
            <p className="text-sm text-readable">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-bold text-primary hover:text-accent transition-colors underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;