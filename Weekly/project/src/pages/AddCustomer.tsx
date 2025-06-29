import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, User, Phone, DollarSign, Calendar, Save } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useNotification } from '../contexts/NotificationContext';
import LanguageToggle from '../components/LanguageToggle';

const AddCustomer: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    totalAmount: '',
    dateOfAmountTaken: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { addCustomer } = useData();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim() || !formData.totalAmount || !formData.dateOfAmountTaken) {
      error(t('allFieldsRequired'), 'Please fill in all required fields');
      return;
    }
    
    const totalAmount = parseFloat(formData.totalAmount);
    
    if (totalAmount <= 0) {
      error(t('amountsMustBePositive'), 'Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      addCustomer({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        totalAmount,
        dateOfAmountTaken: formData.dateOfAmountTaken
      });
      
      success(
        'Customer Added Successfully!', 
        `${formData.name} has been added with ₹${totalAmount.toLocaleString()} loan amount`
      );
      
      // Small delay to show the success message before navigating
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (err) {
      error(t('failedToAddCustomer'), 'Please check your information and try again');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const weeklyAmount = formData.totalAmount ? Math.ceil(parseFloat(formData.totalAmount) / 10) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="glass border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link 
                to="/admin" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mr-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('backToDashboard')}
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('addNewCustomer')}</h1>
                <p className="text-gray-600">{t('createNewCustomer')}</p>
              </div>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fullName')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder={t('enterCustomerName')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('phone')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder={t('enterPhoneNumber')}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('totalAmountTaken')}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    min="1"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder={t('enterTotalAmount')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('dateOfAmountTaken')}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    name="dateOfAmountTaken"
                    value={formData.dateOfAmountTaken}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {formData.totalAmount && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">{t('paymentSchedulePreview')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">{t('total')} {t('amount')}:</span>
                    <span className="font-semibold ml-2">₹{parseFloat(formData.totalAmount || '0').toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">{t('weeklyPayment')}:</span>
                    <span className="font-semibold ml-2">₹{weeklyAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">{t('numberOfWeeks')}:</span>
                    <span className="font-semibold ml-2">10</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 hover-lift"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    {t('addingCustomer')}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {t('addCustomer')}
                  </>
                )}
              </button>
              <Link
                to="/admin"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
              >
                {t('cancel')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;