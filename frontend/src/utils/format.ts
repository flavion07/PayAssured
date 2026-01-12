import { format, parseISO } from 'date-fns';

export const formatDate = (date: string | Date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd MMM yyyy');
};

export const formatDateTime = (date: string | Date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd MMM yyyy HH:mm');
};

export const formatCurrency = (amount: string | number) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'New':
      return '#9E9E9E'; // Grey
    case 'In Follow-up':
      return '#2196F3'; // Blue
    case 'Partially Paid':
      return '#FF9800'; // Orange
    case 'Closed':
      return '#4CAF50'; // Green
    default:
      return '#9E9E9E';
  }
};

export const getStatusColorForMUI = (status: string) => {
  switch (status) {
    case 'New':
      return 'default';
    case 'In Follow-up':
      return 'info';
    case 'Partially Paid':
      return 'warning';
    case 'Closed':
      return 'success';
    default:
      return 'default';
  }
};
