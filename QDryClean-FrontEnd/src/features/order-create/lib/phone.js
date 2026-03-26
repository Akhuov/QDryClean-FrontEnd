export function getPhoneDigits(value) {
  return value.replace(/\D/g, '');
}

export function formatPhoneInput(value) {
  let digits = getPhoneDigits(value);

  if (digits.startsWith('998')) {
    digits = digits.slice(3);
  }

  digits = digits.slice(0, 9);

  let result = '+998';

  if (digits.length > 0) result += ' ' + digits.slice(0, 2);
  if (digits.length >= 3) result += ' ' + digits.slice(2, 5);
  if (digits.length >= 6) result += ' ' + digits.slice(5, 7);
  if (digits.length >= 8) result += ' ' + digits.slice(7, 9);

  return result;
}

export function formatPhoneDisplay(phone) {
  if (!phone) return '';

  const digits = phone.replace(/\D/g, '').slice(-9);

  return digits.replace(
    /(\d{2})(\d{3})(\d{2})(\d{2})/,
    '+998 $1 $2 $3 $4'
  );
}

export function getPhoneNumberForRequest(value) {
  let digits = value.replace(/\D/g, '');

  if (digits.startsWith('998')) {
    digits = digits.slice(3);
  }

  return digits.slice(0, 9);
}