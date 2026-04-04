import { useState } from 'react';
import {
  formatPhoneInput,
  getPhoneDigits,
  getPhoneNumberForRequest,
  isValidPhone,
} from '../../order/lib/phone';

const INITIAL_ERRORS = {
  fullName: '',
  phone: '',
  additionalPhone: '',
};

export function useCustomerCreateDialog() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [additionalPhone, setAdditionalPhone] = useState('+998 ');
  const [errors, setErrors] = useState(INITIAL_ERRORS);

  const clearFieldError = (field) => {
    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const handleFullNameChange = (value) => {
    setFullName(value);
    clearFieldError('fullName');
  };

  const handlePhoneChange = (value) => {
    setPhone(formatPhoneInput(value));
    clearFieldError('phone');
  };

  const handleAdditionalPhoneChange = (value) => {
    setAdditionalPhone(formatPhoneInput(value));
    clearFieldError('additionalPhone');
  };

  const validate = () => {
    const nextErrors = {
      fullName: '',
      phone: '',
      additionalPhone: '',
    };

    const trimmedFullName = fullName.trim();

    if (!trimmedFullName) {
      nextErrors.fullName = 'Full name is required';
    }

    if (!isValidPhone(phone)) {
      nextErrors.phone = 'Phone number is invalid';
    }

    const additionalDigits = getPhoneDigits(additionalPhone);
    const hasAdditionalPhone =
      additionalDigits.length > 0 && additionalDigits !== '998';

    if (hasAdditionalPhone && !isValidPhone(additionalPhone)) {
      nextErrors.additionalPhone = 'Additional phone number is invalid';
    }

    setErrors(nextErrors);

    return !Object.values(nextErrors).some(Boolean);
  };

  const buildPayload = () => {
    if (!validate()) return null;

    const trimmedFullName = fullName.trim();

    const additionalDigits = getPhoneDigits(additionalPhone);
    const hasAdditionalPhone =
        additionalDigits.length > 0 && additionalDigits !== '998';

    return {
        fullName: trimmedFullName,
        phoneNumber: `+998${getPhoneNumberForRequest(phone)}`,
        additionalPhoneNumber: hasAdditionalPhone
        ? `+998${getPhoneNumberForRequest(additionalPhone)}`
        : null,
    };
  };

  const resetForm = () => {
    setFullName('');
    setPhone('+998 ');
    setAdditionalPhone('+998 ');
    setErrors(INITIAL_ERRORS);
  };

  return {
    fullName,
    phone,
    additionalPhone,
    errors,

    setPhone,

    handleFullNameChange,
    handlePhoneChange,
    handleAdditionalPhoneChange,

    buildPayload,
    resetForm,
  };
}