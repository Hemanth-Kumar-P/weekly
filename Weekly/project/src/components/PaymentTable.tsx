import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Check, Clock, AlertTriangle, MessageCircle, Trash2, RotateCcw } from 'lucide-react';
import { Payment } from '../contexts/DataContext';

interface PaymentTableProps {
  payments: Payment[];
  isAdmin?: boolean;
  onStatusUpdate?: (paymentId: string, status: 'paid' | 'due' | 'missed') => void;
  onSendWhatsApp?: (payment: Payment) => void;
  onDeletePayment?: (paymentId: string) => void;
  customerName?: string;
}

const PaymentTable: React.FC<PaymentTableProps> = ({ 
  payments, 
  isAdmin = false, 
  onStatusUpdate, 
  onSendWhatsApp,
  onDeletePayment,
  customerName 
}) => {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'due': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'missed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <Check className="w-4 h-4" />;
      case 'due': return <Clock className="w-4 h-4" />;
      case 'missed': return <AlertTriangle className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          {t('paymentSchedule')}
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('week')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paid Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('amount')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('status')}
              </th>
              {isAdmin && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('actions')}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment, index) => (
              <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {t('week')} {payment.weekNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(payment.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.paidDate ? (
                    <span className="text-green-600 font-medium">
                      {formatDate(payment.paidDate)}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ₹{payment.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                    {getStatusIcon(payment.status)}
                    {t(payment.status)}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2 flex-wrap">
                      {payment.status !== 'paid' && (
                        <button
                          onClick={() => onStatusUpdate?.(payment.id, 'paid')}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                        >
                          {t('markPaid')}
                        </button>
                      )}
                      
                      {payment.status === 'paid' && (
                        <>
                          <button
                            onClick={() => onSendWhatsApp?.(payment)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
                          >
                            <MessageCircle className="w-3 h-3" />
                            {t('whatsapp')}
                          </button>
                          <button
                            onClick={() => onStatusUpdate?.(payment.id, 'due')}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
                            title={t('undoPayment')}
                          >
                            <RotateCcw className="w-3 h-3" />
                            {t('undoPayment')}
                          </button>
                        </>
                      )}
                      
                      {payment.status === 'missed' && (
                        <button
                          onClick={() => onStatusUpdate?.(payment.id, 'paid')}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                        >
                          {t('markPaid')}
                        </button>
                      )}
                      
                      <button
                        onClick={() => onDeletePayment?.(payment.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
                        title={t('deletePayment')}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentTable;