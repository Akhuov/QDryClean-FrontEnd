const PREFIX = '+998 ';

export function getPhoneDigits(value = '') {
  return String(value).replace(/\D/g, '');
}

export function formatPhoneInput(value = '') {
  const stringValue = String(value);

  if (!stringValue.startsWith(PREFIX)) {
    return PREFIX;
  }

  const digits = stringValue
    .slice(PREFIX.length)
    .replace(/\D/g, '')
    .slice(0, 9);

  const parts = [];

  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 5));
  if (digits.length > 5) parts.push(digits.slice(5, 7));
  if (digits.length > 7) parts.push(digits.slice(7, 9));

  return PREFIX + parts.join(' ');
}

export function formatPhoneDisplay(phone = '') {
  const digits = getPhoneDigits(phone);

  const localDigits = digits.startsWith('998')
    ? digits.slice(3, 12)
    : digits.slice(0, 9);

  const parts = [];

  if (localDigits.length > 0) parts.push(localDigits.slice(0, 2));
  if (localDigits.length > 2) parts.push(localDigits.slice(2, 5));
  if (localDigits.length > 5) parts.push(localDigits.slice(5, 7));
  if (localDigits.length > 7) parts.push(localDigits.slice(7, 9));

  return PREFIX + parts.join(' ');
}

export function getPhoneNumberForRequest(value = '') {
  if (!value.startsWith(PREFIX)) {
    return '';
  }

  return value
    .slice(PREFIX.length)
    .replace(/\D/g, '')
    .slice(0, 9);
}

export function isValidPhone(phone = '') {
  const phoneRegex = /^\+998 \d{2} \d{3} \d{2} \d{2}$/;
  return phoneRegex.test(phone);
}