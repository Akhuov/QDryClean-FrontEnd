export function formatCurrency(value) {
  return new Intl.NumberFormat('ru-RU').format(value) + ' UZS';
}