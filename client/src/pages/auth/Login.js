import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData);

      if (result.success) {
        console.log('Login successful, redirecting to dashboard');
        // Use window.location for hard redirect
        window.location.href = '/';
      } else {
        setError(result.message || 'Login failed');
        console.error('Login failed:', result.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-strong p-10 rounded-3xl animate-fade-in">
        <div>
          <div className="flex justify-center">
            <span className="text-7xl animate-bounce">🥗</span>
          </div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-readable bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to DietDash
          </h2>
          <p className="mt-3 text-center text-base" style={{ color: 'var(--color-text-secondary)' }}>
            Sign in to continue your learning journey
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="glass-strong border border-red-500 border-opacity-50 text-red-600 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-5">
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
                  placeholder="Enter your password"
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-300 shadow-lg"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center">
            <p className="text-sm text-readable">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-bold text-primary hover:text-accent transition-colors underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;