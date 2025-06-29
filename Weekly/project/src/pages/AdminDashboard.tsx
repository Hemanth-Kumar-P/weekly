import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  LogOut, 
  Users, 
  DollarSign, 
  Calendar, 
  Phone,
  AlertCircle,
  TrendingUp,
  Filter,
  Search,
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNotification } from '../contexts/NotificationContext';
import PaymentTable from '../components/PaymentTable';
import LanguageToggle from '../components/LanguageToggle';
import ConfirmDialog from '../components/ConfirmDialog';
import ExportDialog from '../components/ExportDialog';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { customers, updatePaymentStatus, deleteCustomer, deletePayment } = useData();
  const { success, error, warning } = useNotification();
  const navigate = useNavigate();
  
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    name: '',
    phone: ''
  });
  
  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'deleteCustomer' | 'deletePayment' | 'undoPayment';
    title: string;
    message: string;
    onConfirm: () => void;
    customerId?: string;
    paymentId?: string;
  }>({
    isOpen: false,
    type: 'deleteCustomer',
    title: '',
    message: '',
    onConfirm: () => {}
  });
  
  const [exportDialog, setExportDialog] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSendWhatsApp = (payment: any, customerName: string) => {
    const message = `Payment Receipt\n\nDear ${customerName},\nPayment of ₹${payment.amount} received for week ${payment.weekNumber} on ${new Date(payment.date).toLocaleDateString()}.\n\nThank you!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    success(t('whatsappMessageSent'), `Message sent for ${customerName}`);
  };

  const handleDeleteCustomer = (customerId: string, customerName: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'deleteCustomer',
      title: t('deleteCustomer'),
      message: t('confirmDeleteCustomer'),
      onConfirm: () => {
        deleteCustomer(customerId);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        success(t('customerDeleted'), `${customerName} has been removed from the system`);
      },
      customerId
    });
  };

  const handleDeletePayment = (customerId: string, paymentId: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'deletePayment',
      title: t('deletePayment'),
      message: t('confirmDeletePayment'),
      onConfirm: () => {
        deletePayment(customerId, paymentId);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        success(t('paymentDeleted'), 'Payment record has been removed');
      },
      customerId,
      paymentId
    });
  };

  const handleUndoPayment = (customerId: string, paymentId: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'undoPayment',
      title: t('undoPayment'),
      message: t('confirmUndoPayment'),
      onConfirm: () => {
        updatePaymentStatus(customerId, paymentId, 'due');
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        warning(t('paymentUpdated'), 'Payment status changed to Due');
      },
      customerId,
      paymentId
    });
  };

  const handlePaymentStatusUpdate = (customerId: string, paymentId: string, status: 'paid' | 'due' | 'missed') => {
    if (status === 'due') {
      const customer = customers.find(c => c.id === customerId);
      const payment = customer?.payments.find(p => p.id === paymentId);
      if (payment?.status === 'paid') {
        handleUndoPayment(customerId, paymentId);
        return;
      }
    }
    
    updatePaymentStatus(customerId, paymentId, status);
    
    if (status === 'paid') {
      success(t('paymentUpdated'), 'Payment marked as paid successfully');
    } else if (status === 'missed') {
      warning(t('paymentUpdated'), 'Payment marked as missed');
    } else {
      success(t('paymentUpdated'), 'Payment status updated');
    }
  };

  const getStats = () => {
    const totalCustomers = customers.length;
    const totalAmountGiven = customers.reduce((sum, customer) => sum + customer.totalAmount, 0);
    const paidPayments = customers.flatMap(c => c.payments).filter(p => p.status === 'paid');
    const amountReceived = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const remainingAmount = totalAmountGiven - amountReceived;
    const missedPayments = customers.flatMap(c => c.payments).filter(p => p.status === 'missed').length;
    
    // Calculate this week's collection (Monday to Sunday)
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    const thisWeekCollected = paidPayments
      .filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= startOfWeek && paymentDate <= endOfWeek;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    return { totalCustomers, totalAmountGiven, amountReceived, remainingAmount, missedPayments, thisWeekCollected };
  };

  const stats = getStats();

  const filteredCustomers = useMemo(() => {
    let filtered = customers;
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(query) ||
        customer.phone.includes(searchQuery)
      );
    }
    
    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(customer => 
        customer.payments.some(payment => payment.status === filters.status)
      );
    }
    
    // Name filter
    if (filters.name.trim()) {
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    
    // Phone filter
    if (filters.phone.trim()) {
      filtered = filtered.filter(customer => 
        customer.phone.includes(filters.phone)
      );
    }
    
    return filtered;
  }, [customers, searchQuery, filters]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({ status: 'all', name: '', phone: '' });
    success('Filters cleared', 'All filters have been reset');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('adminDashboard')}</h1>
              <p className="text-gray-600">{t('managePayments')}</p>
            </div>
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <button
                onClick={() => setExportDialog(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 hover-lift"
              >
                <Download className="w-4 h-4" />
                {t('export')}
              </button>
              <Link
                to="/admin/add-customer"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 hover-lift"
              >
                <Plus className="w-4 h-4" />
                {t('addCustomer')}
              </Link>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="glass rounded-xl p-6 shadow-sm hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('totalCustomers')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6 shadow-sm hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('totalAmountGiven')}</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalAmountGiven.toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6 shadow-sm hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('amountReceived')}</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.amountReceived.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6 shadow-sm hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('remainingAmount')}</p>
                <p className="text-2xl font-bold text-red-600">₹{stats.remainingAmount.toLocaleString()}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6 shadow-sm hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('thisWeekCollected')}</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.thisWeekCollected.toLocaleString()}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6 shadow-sm hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('missedPayments')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.missedPayments}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass rounded-xl p-6 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('searchCustomers')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-4 flex-wrap">
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t('all')} {t('status')}</option>
                <option value="paid">{t('paid')}</option>
                <option value="due">{t('due')}</option>
                <option value="missed">{t('missed')}</option>
              </select>
              
              <input
                type="text"
                placeholder={t('filterByName')}
                value={filters.name}
                onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <input
                type="text"
                placeholder={t('filterByPhone')}
                value={filters.phone}
                onChange={(e) => setFilters(prev => ({ ...prev, phone: e.target.value }))}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <button
                onClick={clearFilters}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {t('clearFilters')}
              </button>
            </div>
          </div>
        </div>

        {/* Customers List */}
        <div className="glass rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">{t('customers')} ({filteredCustomers.length})</h2>
          </div>
          
          {filteredCustomers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {customers.length === 0 ? t('noCustomersYet') : 'No customers match your filters'}
              </h3>
              <p className="text-gray-600 mb-6">
                {customers.length === 0 ? t('startByAdding') : 'Try adjusting your search or filters'}
              </p>
              {customers.length === 0 ? (
                <Link
                  to="/admin/add-customer"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all inline-flex items-center gap-2 hover-lift"
                >
                  <Plus className="w-4 h-4" />
                  {t('addFirstCustomer')}
                </Link>
              ) : (
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {t('clearFilters')}
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => {
                const remainingAmount = customer.totalAmount - customer.payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
                const isExpanded = selectedCustomer === customer.id;
                
                return (
                  <div key={customer.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex-1 cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors"
                        onClick={() => setSelectedCustomer(isExpanded ? null : customer.id)}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                          <div>
                            <p className="font-semibold text-gray-900">{customer.name}</p>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {customer.phone}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">{t('total')} {t('amount')}</p>
                            <p className="font-semibold text-gray-900">₹{customer.totalAmount.toLocaleString()}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">{t('amountReceived')}</p>
                            <p className="font-semibold text-green-600">₹{(customer.totalAmount - remainingAmount).toLocaleString()}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">{t('remaining')}</p>
                            <p className="font-semibold text-red-600">₹{remainingAmount.toLocaleString()}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">{t('dateTaken')}</p>
                            <p className="font-semibold text-gray-900">{new Date(customer.dateOfAmountTaken).toLocaleDateString()}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Day</p>
                            <p className="font-semibold text-gray-900">{customer.dayOfAmountTaken}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors hover-lift"
                          title={t('deleteCustomer')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <Calendar className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="mt-6">
                        <PaymentTable
                          payments={customer.payments}
                          isAdmin={true}
                          onStatusUpdate={(paymentId, status) => handlePaymentStatusUpdate(customer.id, paymentId, status)}
                          onSendWhatsApp={(payment) => handleSendWhatsApp(payment, customer.name)}
                          onDeletePayment={(paymentId) => handleDeletePayment(customer.id, paymentId)}
                          customerName={customer.name}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        type={confirmDialog.type === 'deleteCustomer' || confirmDialog.type === 'deletePayment' ? 'danger' : 'warning'}
      />
      
      <ExportDialog
        isOpen={exportDialog}
        onClose={() => setExportDialog(false)}
      />
    </div>
  );
};

export default AdminDashboard;