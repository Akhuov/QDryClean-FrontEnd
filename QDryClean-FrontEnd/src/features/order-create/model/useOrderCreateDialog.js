import { useEffect, useMemo, useRef, useState } from 'react';
import { EMPTY_NEW_ITEM } from './constants';
import { formatPhoneInput, getPhoneNumberForRequest } from '../lib/phone';
import { fetchItemTypesApi, searchCustomerByPhoneApi } from '../api/orderApi';
import { buildCreateOrderPayload, mapNewItemToOrderItem } from '../lib/orderCreateMappers';

export function useOrderCreateDialog() {
  const [phone, setPhone] = useState('');
  const [items, setItems] = useState([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState(EMPTY_NEW_ITEM);

  const [canCreateCustomer, setCanCreateCustomer] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [searchingCustomer, setSearchingCustomer] = useState(false);
  const [customerError, setCustomerError] = useState('');

  const [itemTypes, setItemTypes] = useState([]);
  const [itemTypesLoading, setItemTypesLoading] = useState(false);
  const [itemTypesError, setItemTypesError] = useState('');

  const itemsEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const selectedItemType = useMemo(() => {
    return itemTypes.find((x) => String(x.id) === String(newItem.type)) || null;
  }, [itemTypes, newItem.type]);

  const newItemPrice = selectedItemType?.cost ?? 0;

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price, 0) + (isAddingItem ? newItemPrice : 0);
  }, [items, isAddingItem, newItemPrice]);

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

  const resetAllState = () => {
    setPhone('');
    setCustomer(null);
    setCustomerError('');
    setItems([]);
    setIsAddingItem(false);
    clearNewItemPhoto();
    setNewItem(EMPTY_NEW_ITEM);

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
        throw new Error(data?.message || 'Failed to load item types');
      }

      setItemTypes(data.response ?? []);
    } catch (error) {
      setItemTypes([]);
      setItemTypesError(
        error.response?.data?.message ||
        error.message ||
        'Failed to load item types'
      );
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
        setCustomerError(data.message || 'Customer with this phone number does not exist');
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
    if (itemTypes.length === 0) {
      await fetchItemTypes();
    }

    setNewItem((prev) => ({
      ...EMPTY_NEW_ITEM,
      type: itemTypes[0] ? String(itemTypes[0].id) : prev.type,
    }));

    setIsAddingItem(true);
  };

  const handleCancelAddItem = () => {
    clearNewItemPhoto();
    setNewItem(EMPTY_NEW_ITEM);
    setIsAddingItem(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveItem = () => {
    if (!selectedItemType) return;

    const createdItem = mapNewItemToOrderItem(newItem, selectedItemType);

    setItems((prev) => [...prev, createdItem]);
    setNewItem(EMPTY_NEW_ITEM);
    setIsAddingItem(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

  const buildPayload = () => {
    if (!customer || items.length === 0) return null;

    return buildCreateOrderPayload(customer, items);
  };

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

  return {
    phone,
    setPhone,
    setCustomer,
    items,
    customer,
    searchingCustomer,
    itemTypes,
    itemTypesLoading,
    itemTypesError,
    isAddingItem,
    newItem,
    setNewItem,
    selectedItemType,
    newItemPrice,
    total,
    itemsEndRef,
    fileInputRef,
    canCreateCustomer,
    handlePhoneChange,
    handleSearchCustomer,
    handleStartAddItem,
    handleCancelAddItem,
    handleSaveItem,
    handleDeleteItem,
    handlePhotoChange,
    handleRemovePhoto,
    buildPayload,
    customerError,
    setCustomerError,
    setCustomer,
    canCreateCustomer,
    setCanCreateCustomer,
    resetAllState
  };
}