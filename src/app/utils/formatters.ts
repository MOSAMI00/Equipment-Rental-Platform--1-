export function calculateRentalDays(startDate: string, endDate: string) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  if (Number.isNaN(diff) || diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatCurrency(value: number) {
  return Math.round(value).toLocaleString('ar-YE');
}

export function formatRentalDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ar-YE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatRentalDateRange(startDate: string, endDate: string) {
  return `${formatRentalDate(startDate)} ← ${formatRentalDate(endDate)}`;
}
