import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { EMPTY_NEW_ITEM } from './constants';
import { formatPhoneInput, getPhoneNumberForRequest } from '../lib/phone';
import { fetchItemTypesApi, searchCustomerByPhoneApi, getReceiptByIdApi } from '../api/orderApi';
import { buildCreateOrderPayload, mapNewItemToOrderItem } from '../lib/orderCreateMappers';
import { printReceipt } from '../../../shared/api/printService';

export function useOrderDialog() {
  const [paymentMethod, setPaymentMethod] = useState(null);

  const [submitted, setSubmitted] = useState(false);
  const [itemErrors, setItemErrors] = useState({});
  const [orderErrors, setOrderErrors] = useState({});

  const [phone, setPhone] = useState('+998 ');
  const [items, setItems] = useState([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState(EMPTY_NEW_ITEM);

  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paidAmount, setPaidAmount] = useState('');
  const [note, setNote] = useState('');

  const [canCreateCustomer, setCanCreateCustomer] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [searchingCustomer, setSearchingCustomer] = useState(false);
  const [customerError, setCustomerError] = useState('');

  const [itemTypes, setItemTypes] = useState([]);
  const [itemTypesLoading, setItemTypesLoading] = useState(false);
  const [itemTypesError, setItemTypesError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const itemsEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const isBlank = (value) => !String(value ?? '').trim();

  const isPositiveInteger = (value) => {
    if (value === null || value === undefined || value === '') return false;
    return /^\d+$/.test(String(value));
  };

  const selectedItemType = useMemo(() => {
    return itemTypes.find((x) => String(x.id) === String(newItem.type)) || null;
  }, [itemTypes, newItem.type]);

  const newItemPrice = selectedItemType?.cost ?? 0;

  const itemsTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);

  const previewTotal = useMemo(() => {
    return itemsTotal + (isAddingItem ? newItemPrice : 0);
  }, [itemsTotal, isAddingItem, newItemPrice]);

  const shouldShowPaymentStatus = items.length > 0;
  const shouldShowPaidAmount = paymentStatus === 1;

  const handlePhoneChange = (value) => {
    setPhone(formatPhoneInput(value));
  };

  const resetCustomerSearchState = () => {
    setCustomer(null);
    setCustomerError('');
    setCanCreateCustomer(false);
  };

  const clearNewItemPhoto = () => {
    if (newItem.photoPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(newItem.photoPreview);
    }
  };

  const validateNewItem = (item) => {
    const errors = {};

    if (isBlank(item.type)) {
      errors.type = 'Выберите тип вещи';
    }

    const hasAnyDetails =
      !isBlank(item.colour) ||
      !isBlank(item.brandName) ||
      !isBlank(item.description);

    if (!hasAnyDetails) {
      errors.details = 'Заполните хотя бы одно поле: цвет, бренд или дефекты/заметки';
    }

    return errors;
  };

  const currentItemErrors = useMemo(() => {
    if (!isAddingItem) return {};
    return validateNewItem(newItem);
  }, [isAddingItem, newItem]);

  const isNewItemValid = Object.keys(currentItemErrors).length === 0;

  const validateOrder = ({
    customer,
    items,
    paymentStatus,
    amount,
    total,
    isAddingItem,
    isNewItemValid,
  }) => {
    const errors = {};

    if (!customer) {
      errors.customer = 'Пожалуйста выберите клиента';
    }

    if (items.length === 0) {
      errors.items = 'Добавьте хотя бы один предмет';
    }

    if (items.length > 0 && (paymentStatus === null || paymentStatus === undefined || paymentStatus === '')) {
      errors.paymentStatus = 'Пожалуйста выберите статус оплаты';
    }

    if (isAddingItem && !isNewItemValid) {
      errors.newItem = 'Завершите или отмените форму предмета перед сохранением заказа';
    }

    if (paymentStatus === 1) {
      if (!isPositiveInteger(amount)) {
        errors.amount = 'Сумма оплаты должна быть целым числом';
      } else {
        const paymentAmount = Number(amount);

        if (paymentAmount <= 0) {
          errors.amount = 'Сумма оплаты должна быть больше 0';
        } else if (paymentAmount >= total) {
          errors.amount = 'Сумма оплаты должна быть меньше общей суммы';
        }
      }
    }

    return errors;
  };

  const currentOrderErrors = useMemo(() => {
    return validateOrder({
      customer,
      items,
      paymentStatus,
      amount: paidAmount,
      total: itemsTotal,
      isAddingItem,
      isNewItemValid,
    });
  }, [customer, items, paymentStatus, paidAmount, itemsTotal, isAddingItem, isNewItemValid]);

  const isOrderValid = Object.keys(currentOrderErrors).length === 0;
  const isSaveDisabled = !isOrderValid;

  useEffect(() => {
    if (!submitted) return;
    setOrderErrors(currentOrderErrors);
  }, [submitted, currentOrderErrors]);

  useEffect(() => {
    if (!isAddingItem) return;
    if (Object.keys(itemErrors).length === 0) return;

    setItemErrors(validateNewItem(newItem));
  }, [newItem, isAddingItem]);

  useEffect(() => {
    if (paymentStatus === 0 || paymentStatus === 2 || paymentStatus === null) {
      setPaidAmount('');
    }
  }, [paymentStatus]);

  useEffect(() => {
    itemsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [items, isAddingItem]);

  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.photoPreview?.startsWith('blob:')) {
          URL.revokeObjectURL(item.photoPreview);
        }
      });

      if (newItem.photoPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(newItem.photoPreview);
      }
    };
  }, [items, newItem.photoPreview]);

  const resetAllState = () => {
    setPhone('+998 ');
    setItems([]);
    setIsAddingItem(false);

    clearNewItemPhoto();
    setNewItem(EMPTY_NEW_ITEM);

    setCustomer(null);
    setCustomerError('');
    setCanCreateCustomer(false);

    setPaymentStatus(null);
    setPaidAmount('');
    setNote('');

    setSubmitted(false);
    setItemErrors({});
    setOrderErrors({});

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const fetchItemTypes = async () => {
    try {
      setItemTypesLoading(true);
      setItemTypesError('');

      const data = await fetchItemTypesApi();

      if (data?.code !== 0) {
        throw new Error(data?.message || 'Ошибка загрузки типов вещей');
      }

      const responseItems = data.response ?? [];
      setItemTypes(responseItems);
      return responseItems;
    } catch (error) {
      setItemTypes([]);
      setItemTypesError(
        error.response?.data?.message ||
        error.message ||
        'Ошибка загрузки типов вещей'
      );
      return [];
    } finally {
      setItemTypesLoading(false);
    }
  };

  const handleSearchCustomer = async () => {
    resetCustomerSearchState();

    const normalizedPhone = getPhoneNumberForRequest(phone);

    if (normalizedPhone.length !== 9) {
      setCustomerError('Введите номер полностью');
      return;
    }

    try {
      setSearchingCustomer(true);

      const data = await searchCustomerByPhoneApi(normalizedPhone);

      if (data.code === 0) {
        setCustomer(data.response);
        setCanCreateCustomer(false);
        return;
      }

      setCustomerError(data.message || 'Ошибка поиска клиента');
    } catch (error) {
      setCustomer(null);

      const data = error.response?.data;

      if (data?.code === 1001) {
        setCustomerError(data.message || 'Клиент с таким номером не найден');
        setCanCreateCustomer(true);
      } else if (data?.code === 1000) {
        setCustomerError(data.message);
        setCanCreateCustomer(false);
      } else {
        setCustomerError(data?.message || 'Ошибка соединения с сервером');
        setCanCreateCustomer(false);
      }
    } finally {
      setSearchingCustomer(false);
    }
  };

  const handleStartAddItem = async () => {
    const types = itemTypes.length > 0 ? itemTypes : await fetchItemTypes();

    setNewItem({
      ...EMPTY_NEW_ITEM,
      type: types?.[0] ? String(types[0].id) : '',
    });

    setItemErrors({});
    setIsAddingItem(true);
  };

  const handleCancelAddItem = () => {
    clearNewItemPhoto();
    setNewItem(EMPTY_NEW_ITEM);
    setItemErrors({});
    setIsAddingItem(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveItem = () => {
    const errors = validateNewItem(newItem);
    setItemErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    if (!selectedItemType) return;

    const createdItem = mapNewItemToOrderItem(newItem, selectedItemType);

    setItems((prev) => [...prev, createdItem]);
    setNewItem(EMPTY_NEW_ITEM);
    setItemErrors({});
    setIsAddingItem(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePhotoAnalysis = async (file) => {
    // Проверка на наличие файла и типов вещей
    if (!file || !itemTypes || itemTypes.length === 0) {
      toast.error('Файл не выбран или список типов вещей пуст');
      return;
    }

    try {
      setIsAnalyzing(true);
      const toastId = toast.loading('Анализирую фото...');

      const reader = new FileReader();

      // Оборачиваем чтение файла в Promise, чтобы дождаться base64
      const base64Data = await new Promise((resolve, reject) => {
        reader.onload = () => {
          try {
            const result = reader.result;
            const base64String = result.split(',')[1]; // Берем только часть после запятой
            resolve(base64String);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error('Ошибка чтения файла'));
        reader.readAsDataURL(file);
      });

      // Формируем строку из массива itemTypes в формате "ID: Name"
      const typesString = itemTypes
        .map((t) => `${t.id}: ${t.name}`)
        .join(', ');

      const response = await axios.post('http://192.168.1.4:5005/analyze-photo', {
        imageBase64: base64Data,
        itemTypes: typesString,
      });

      const data = response.data;

      if (data) {
        // Обновляем состояние newItem
        setNewItem((prev) => ({
          ...prev,
          colour: data.color || prev.colour, // Поле colour получает значение data.color
          type: data.itemTypeId ? String(data.itemTypeId) : prev.type, // Поле type получает значение String(data.itemTypeId)
        }));

        toast.success(`Анализ завершен: цвет - ${data.color}`, { id: toastId });
      } else {
        toast.error('Не получен ответ от сервера', { id: toastId });
      }
    } catch (error) {
      console.error('AI Error:', error);
      toast.error('Не удалось автоматически распознать фото');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteItem = (itemId) => {
    setItems((prev) => {
      const itemToDelete = prev.find((item) => item.id === itemId);

      if (itemToDelete?.photoPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(itemToDelete.photoPreview);
      }

      return prev.filter((item) => item.id !== itemId);
    });
  };

  const handleSubmitAttempt = () => {
    setSubmitted(true);
    setItemErrors(currentItemErrors);
    setOrderErrors(currentOrderErrors);

    if (!customer || !isOrderValid) {
      return null;
    }

    let safePaidAmount = null;

    if (paymentStatus === 1) {
      const parsed = Number(paidAmount);

      if (!Number.isFinite(parsed)) {
        return null; // защита от NaN
      }

      safePaidAmount = parsed;
    }

    return buildCreateOrderPayload(customer, items, {
      note,
      paymentStatus,
      amount: safePaidAmount,
      paymentMethod: paymentMethod ?? 1,
    });
  };

  const buildPayload = () => {
    return handleSubmitAttempt();
  };

  const handlePrint = async (orderId) => {
    try {
      const data = await getReceiptByIdApi(orderId);

      if (data.code !== 0 || !data.response) {
        throw new Error(data.message || 'Ошибка загрузки чека');
      }

      const receipt = data.response;

      if (!receipt) {
        toast.error('Данные чека не найдены');
        return;
      }

      await printReceipt(receipt);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        'Ошибка печати чека'
      );
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    clearNewItemPhoto();

    const previewUrl = URL.createObjectURL(file);

    setNewItem((prev) => ({
      ...prev,
      photoFile: file,
      photoPreview: previewUrl,
    }));
  };

  const handleRemovePhoto = () => {
    clearNewItemPhoto();

    setNewItem((prev) => ({
      ...prev,
      photoFile: null,
      photoPreview: '',
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    paymentStatus,
    setPaymentStatus,
    paidAmount,
    setPaidAmount,
    note,
    setNote,
    phone,
    setPhone,
    items,
    setItems,
    customer,
    setCustomer,
    searchingCustomer,
    itemTypes,
    itemTypesLoading,
    itemTypesError,
    isAnalyzing,
    isAddingItem,
    newItem,
    setNewItem,
    selectedItemType,
    newItemPrice,
    itemsTotal,
    previewTotal,
    total: previewTotal,
    itemsEndRef,
    fileInputRef,
    canCreateCustomer,
    customerError,
    setCustomerError,
    setCanCreateCustomer,
    itemErrors,
    orderErrors,
    submitted,
    shouldShowPaymentStatus,
    shouldShowPaidAmount,
    isSaveDisabled,
    handlePhoneChange,
    handleSearchCustomer,
    handleStartAddItem,
    handleCancelAddItem,
    handleSaveItem,
    handleDeleteItem,
    handlePhotoChange,
    handleRemovePhoto,
    buildPayload,
    resetAllState,
    handlePrint,
    handlePhotoAnalysis,
  };
}