import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Phone, Lock, UserCog, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import LanguageToggle from '../components/LanguageToggle';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      error(t('phoneRequired'), 'Please enter your phone number');
      return;
    }
    
    if (isAdmin && !password.trim()) {
      error(t('passwordRequired'), 'Admin login requires a password');
      return;
    }

    setLoading(true);

    try {
      const loginSuccess = await login(phone, password, isAdmin);
      if (loginSuccess) {
        success(
          `Welcome ${isAdmin ? 'Admin' : 'Customer'}!`, 
          `Successfully logged in as ${isAdmin ? 'administrator' : 'customer'}`
        );
        
        // Small delay to show success message
        setTimeout(() => {
          navigate(isAdmin ? '/admin' : '/customer');
        }, 1000);
      } else {
        error(
          isAdmin ? t('invalidAdminCredentials') : t('phoneNotFound'),
          isAdmin ? 'Please check your credentials' : 'Contact admin to add your number'
        );
      }
    } catch (err) {
      error(t('loginFailed'), 'Please try again or contact support');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="glass rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="text-center flex-1">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                <UserCog className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t('welcomeBack')}</h2>
              <p className="text-gray-600 mt-2">{t('signInToAccount')}</p>
            </div>
            <LanguageToggle />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                type="button"
                onClick={() => setIsAdmin(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  !isAdmin 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <User className="w-4 h-4" />
                {t('customer')}
              </button>
              <button
                type="button"
                onClick={() => setIsAdmin(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isAdmin 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <UserCog className="w-4 h-4" />
                {t('admin')}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('phone')}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={t('enterPhoneNumber')}
                />
              </div>
            </div>

            {isAdmin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder={t('enterPassword')}
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
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  {t('signingIn')}
                </>
              ) : (
                t('signIn')
              )}
            </button>

            {isAdmin && (
              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t('forgotPassword')}
                </Link>
              </div>
            )}
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">{t('demoCredentials')}</p>
            <p className="text-xs text-blue-700">{t('adminCredentials')}</p>
            <p className="text-xs text-blue-700">{t('customerCredentials')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;