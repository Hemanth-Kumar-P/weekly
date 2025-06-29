import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Calendar, FileText, X, AlertCircle } from 'lucide-react';
import { exportToExcel, exportToPDF, generateReportData } from '../utils/exportUtils';
import { useData } from '../contexts/DataContext';
import { useNotification } from '../contexts/NotificationContext';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { customers } = useData();
  const { success, error } = useNotification();
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleExport = async (format: 'excel' | 'pdf') => {
    setLoading(true);
    try {
      // Validate date range
      if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
        error('Invalid Date Range', 'From date cannot be later than to date');
        return;
      }

      const from = fromDate ? new Date(fromDate) : undefined;
      const to = toDate ? new Date(toDate) : undefined;
      
      const data = generateReportData(customers, reportType, from, to);
      
      if (data.length === 0) {
        error(t('noDataFound'), 'Try adjusting your date range or report type. Make sure there are paid payments in the selected period.');
        return;
      }
      
      const filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}`;
      
      if (format === 'excel') {
        exportToExcel(data, filename, t(reportType));
        success(t('reportExported'), `Excel report downloaded with ${data.length} records`);
      } else {
        exportToPDF(data, filename, t(reportType));
        success(t('reportExported'), `PDF report downloaded with ${data.length} records`);
      }
      
      onClose();
    } catch (exportError) {
      console.error('Export error:', exportError);
      error('Export Failed', exportError instanceof Error ? exportError.message : 'Please try again or contact support');
    } finally {
      setLoading(false);
    }
  };

  const previewDataCount = () => {
    try {
      const from = fromDate ? new Date(fromDate) : undefined;
      const to = toDate ? new Date(toDate) : undefined;
      const data = generateReportData(customers, reportType, from, to);
      return data.length;
    } catch {
      return 0;
    }
  };

  const dataCount = previewDataCount();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{t('exportReports')}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('reportType')}
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="daily">{t('daily')}</option>
                <option value="weekly">{t('weekly')}</option>
                <option value="monthly">{t('monthly')}</option>
                <option value="yearly">{t('yearly')}</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fromDate')}
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('toDate')}
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Data Preview */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Preview: {dataCount} records will be exported
                </span>
              </div>
              {dataCount === 0 && (
                <p className="text-xs text-blue-600 mt-1">
                  No data found for the selected criteria. Try adjusting your filters.
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={() => handleExport('excel')}
              disabled={loading || dataCount === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <div className="loading-spinner"></div> : <FileText className="w-4 h-4" />}
              {t('downloadExcel')}
            </button>
            <button
              onClick={() => handleExport('pdf')}
              disabled={loading || dataCount === 0}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <div className="loading-spinner"></div> : <FileText className="w-4 h-4" />}
              {t('downloadPDF')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;