import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalAmount: number;
  dateOfAmountTaken: string;
  dayOfAmountTaken: string;
  weeklyAmount: number;
  payments: Payment[];
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'due' | 'missed';
  weekNumber: number;
  paidDate?: string; // New field for tracking when payment was actually made
}

interface DataContextType {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'dayOfAmountTaken' | 'weeklyAmount' | 'payments'>) => void;
  updatePaymentStatus: (customerId: string, paymentId: string, status: 'paid' | 'due' | 'missed') => void;
  deleteCustomer: (customerId: string) => void;
  deletePayment: (customerId: string, paymentId: string) => void;
  getCustomersByPhone: (phone: string) => Customer[];
  generateWeeklyPayments: (startDate: string, weeklyAmount: number, totalAmount: number) => Payment[];
  searchCustomers: (query: string) => Customer[];
  filterCustomers: (filters: { status?: string; name?: string; phone?: string }) => Customer[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const savedCustomers = localStorage.getItem('customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  const generateWeeklyPayments = (startDate: string, weeklyAmount: number, totalAmount: number): Payment[] => {
    const payments: Payment[] = [];
    const start = new Date(startDate);
    // Start from next week (add 7 days to the start date)
    start.setDate(start.getDate() + 7);
    
    const numberOfWeeks = 10; // Fixed 10 weeks as per requirement
    
    for (let i = 0; i < numberOfWeeks; i++) {
      const paymentDate = new Date(start);
      paymentDate.setDate(start.getDate() + (i * 7));
      
      const today = new Date();
      const paymentDateOnly = new Date(paymentDate.getFullYear(), paymentDate.getMonth(), paymentDate.getDate());
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      let status: 'paid' | 'due' | 'missed' = 'due';
      
      if (paymentDateOnly < todayOnly) {
        status = 'missed';
      } else if (paymentDateOnly.getTime() === todayOnly.getTime()) {
        status = 'due';
      }
      
      payments.push({
        id: `payment-${i + 1}`,
        date: paymentDate.toISOString().split('T')[0],
        amount: weeklyAmount,
        status,
        weekNumber: i + 1
      });
    }
    
    return payments;
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'dayOfAmountTaken' | 'weeklyAmount' | 'payments'>) => {
    const date = new Date(customerData.dateOfAmountTaken);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Calculate weekly amount as total amount / 10
    const weeklyAmount = Math.ceil(customerData.totalAmount / 10);
    
    const payments = generateWeeklyPayments(
      customerData.dateOfAmountTaken, 
      weeklyAmount, 
      customerData.totalAmount
    );
    
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // Unique ID
      dayOfAmountTaken: dayOfWeek,
      weeklyAmount,
      payments
    };
    
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updatePaymentStatus = (customerId: string, paymentId: string, status: 'paid' | 'due' | 'missed') => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === customerId 
          ? {
              ...customer,
              payments: customer.payments.map(payment =>
                payment.id === paymentId 
                  ? { 
                      ...payment, 
                      status,
                      paidDate: status === 'paid' ? new Date().toISOString().split('T')[0] : undefined
                    } 
                  : payment
              )
            }
          : customer
      )
    );
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== customerId));
  };

  const deletePayment = (customerId: string, paymentId: string) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === customerId 
          ? {
              ...customer,
              payments: customer.payments.filter(payment => payment.id !== paymentId)
            }
          : customer
      )
    );
  };

  const getCustomersByPhone = (phone: string): Customer[] => {
    return customers.filter(customer => customer.phone === phone);
  };

  const searchCustomers = (query: string): Customer[] => {
    if (!query.trim()) return customers;
    
    const lowercaseQuery = query.toLowerCase();
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(lowercaseQuery) ||
      customer.phone.includes(query)
    );
  };

  const filterCustomers = (filters: { status?: string; name?: string; phone?: string }): Customer[] => {
    let filtered = customers;
    
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(customer => 
        customer.payments.some(payment => payment.status === filters.status)
      );
    }
    
    if (filters.name) {
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }
    
    if (filters.phone) {
      filtered = filtered.filter(customer => 
        customer.phone.includes(filters.phone!)
      );
    }
    
    return filtered;
  };

  return (
    <DataContext.Provider value={{ 
      customers, 
      addCustomer, 
      updatePaymentStatus,
      deleteCustomer,
      deletePayment,
      getCustomersByPhone,
      generateWeeklyPayments,
      searchCustomers,
      filterCustomers
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};