import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, User, Phone, DollarSign, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import PaymentTable from '../components/PaymentTable';
import LanguageToggle from '../components/LanguageToggle';

const CustomerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { getCustomersByPhone } = useData();
  const navigate = useNavigate();

  // Get all customers with the same phone number
  const customers = user ? getCustomersByPhone(user.phone) : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user || customers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('customerNotFound')}</h2>
          <p className="text-gray-600 mb-6">{t('contactAdmin')}</p>
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {t('backToLogin')}
          </button>
        </div>
      </div>
    );
  }

  // Calculate combined stats for all customer accounts with same phone
  const totalAmount = customers.reduce((sum, customer) => sum + customer.totalAmount, 0);
  const allPayments = customers.flatMap(customer => customer.payments);
  const paidPayments = allPayments.filter(p => p.status === 'paid');
  const remainingAmount = totalAmount - paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalPaymentsCount = allPayments.length;
  const paidPaymentsCount = paidPayments.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('myPaymentDashboard')}</h1>
              <p className="text-gray-600">{t('trackPaymentSchedule')}</p>
            </div>
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Customer Info Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-sm mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{customers[0].name}</h2>
              <p className="text-gray-600 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {user.phone}
              </p>
              {customers.length > 1 && (
                <p className="text-sm text-blue-600 font-medium">
                  {customers.length} accounts found
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">{t('total')} {t('amount')}</p>
              <p className="text-xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">{t('remaining')}</p>
              <p className="text-xl font-bold text-red-600">₹{remainingAmount.toLocaleString()}</p>
            </div>

            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <Calendar className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">{t('dateTaken')}</p>
              <p className="text-xl font-bold text-gray-900">{new Date(customers[0].dateOfAmountTaken).toLocaleDateString()}</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">{t('progress')}</p>
              <p className="text-xl font-bold text-gray-900">{paidPaymentsCount}/{totalPaymentsCount}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('paymentProgress')}</h3>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(paidPaymentsCount / totalPaymentsCount) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{paidPaymentsCount} {t('paymentsCompleted')}</span>
            <span>{totalPaymentsCount - paidPaymentsCount} {t('paymentsRemaining')}</span>
          </div>
        </div>

        {/* Payment Tables for each customer account */}
        {customers.map((customer, index) => (
          <div key={customer.id} className="mb-8">
            {customers.length > 1 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Account {index + 1} - {t('total')}: ₹{customer.totalAmount.toLocaleString()}
                </h4>
                <p className="text-sm text-blue-700">
                  {t('dateTaken')}: {new Date(customer.dateOfAmountTaken).toLocaleDateString()}
                </p>
              </div>
            )}
            <PaymentTable
              payments={customer.payments}
              isAdmin={false}
              customerName={customer.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;