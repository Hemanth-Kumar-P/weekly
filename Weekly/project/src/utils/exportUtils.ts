import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export interface ExportData {
  customerName: string;
  phone: string;
  totalAmount: number;
  amountReceived: number;
  remainingAmount: number;
  paymentDate?: string;
  paidDate?: string;
  weekNumber?: number;
  status?: string;
  dateOfAmountTaken: string;
}

export const exportToExcel = (data: ExportData[], filename: string, reportType: string) => {
  if (data.length === 0) {
    throw new Error('No data to export');
  }

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  
  // Add title and metadata
  const titleData = [
    [`${reportType} Report`],
    [`Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`],
    [`Total Records: ${data.length}`],
    [] // Empty row
  ];
  
  // Convert data to array format for Excel
  const headers = Object.keys(data[0]).map(key => 
    key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
  );
  
  const rows = data.map(item => Object.values(item));
  
  // Combine title, headers, and data
  const worksheetData = [
    ...titleData,
    headers,
    ...rows
  ];
  
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Style the worksheet
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  
  // Auto-size columns
  const colWidths = headers.map((header, i) => {
    const maxLength = Math.max(
      header.length,
      ...rows.map(row => String(row[i] || '').length)
    );
    return { wch: Math.min(Math.max(maxLength + 2, 10), 30) };
  });
  worksheet['!cols'] = colWidths;
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, reportType);
  
  // Write file
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToPDF = (data: ExportData[], filename: string, reportType: string) => {
  if (data.length === 0) {
    throw new Error('No data to export');
  }

  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(`${reportType} Report`, 14, 20);
  
  doc.setFontSize(10);
  doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 30);
  doc.text(`Total Records: ${data.length}`, 14, 36);
  
  // Prepare table data
  const headers = Object.keys(data[0]).map(key => 
    key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
  );
  
  const rows = data.map(item => 
    Object.values(item).map(value => 
      value === null || value === undefined ? '-' : String(value)
    )
  );
  
  // Add table
  (doc as any).autoTable({
    head: [headers],
    body: rows,
    startY: 45,
    styles: { 
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: { 
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: { 
      fillColor: [248, 250, 252] 
    },
    columnStyles: {
      0: { cellWidth: 25 }, // Customer Name
      1: { cellWidth: 20 }, // Phone
      2: { cellWidth: 20 }, // Total Amount
      3: { cellWidth: 20 }, // Amount Received
      4: { cellWidth: 20 }, // Remaining Amount
    },
    margin: { top: 45 },
    didDrawPage: function (data: any) {
      // Add page numbers
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
    }
  });
  
  doc.save(`${filename}.pdf`);
};

export const generateReportData = (
  customers: any[],
  reportType: 'daily' | 'weekly' | 'monthly' | 'yearly',
  fromDate?: Date,
  toDate?: Date
): ExportData[] => {
  if (!customers || customers.length === 0) {
    return [];
  }

  const now = new Date();
  let startDate: Date;
  let endDate: Date = toDate || now;
  
  if (fromDate) {
    startDate = fromDate;
  } else {
    switch (reportType) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(0);
    }
  }
  
  const reportData: ExportData[] = [];
  
  customers.forEach(customer => {
    const allPaidPayments = customer.payments.filter((p: any) => p.status === 'paid');
    const totalAmountReceived = allPaidPayments.reduce((sum: number, p: any) => sum + p.amount, 0);
    const remainingAmount = customer.totalAmount - totalAmountReceived;
    
    if (reportType === 'daily' || reportType === 'weekly') {
      // Include individual payment details for daily/weekly reports
      const filteredPayments = customer.payments.filter((p: any) => {
        if (p.status !== 'paid' || !p.paidDate) return false;
        const paidDate = new Date(p.paidDate);
        return paidDate >= startDate && paidDate <= endDate;
      });
      
      if (filteredPayments.length > 0) {
        filteredPayments.forEach((payment: any) => {
          reportData.push({
            customerName: customer.name,
            phone: customer.phone,
            totalAmount: customer.totalAmount,
            amountReceived: payment.amount,
            remainingAmount,
            paymentDate: payment.date,
            paidDate: payment.paidDate,
            weekNumber: payment.weekNumber,
            status: payment.status,
            dateOfAmountTaken: customer.dateOfAmountTaken
          });
        });
      }
    } else {
      // Summary for monthly/yearly reports
      const periodPayments = allPaidPayments.filter((p: any) => {
        if (!p.paidDate) return false;
        const paidDate = new Date(p.paidDate);
        return paidDate >= startDate && paidDate <= endDate;
      });
      
      const periodAmount = periodPayments.reduce((sum: number, p: any) => sum + p.amount, 0);
      
      if (periodAmount > 0) {
        reportData.push({
          customerName: customer.name,
          phone: customer.phone,
          totalAmount: customer.totalAmount,
          amountReceived: periodAmount,
          remainingAmount,
          dateOfAmountTaken: customer.dateOfAmountTaken
        });
      }
    }
  });
  
  return reportData;
};