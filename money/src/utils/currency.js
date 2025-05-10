export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ar-MA', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
};
