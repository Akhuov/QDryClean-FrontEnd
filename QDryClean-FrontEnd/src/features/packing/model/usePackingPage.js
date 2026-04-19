import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { getOrderByReceiptApi, updateOrderItemsStatusApi } from '../api/packingApi';
import { getAxiosErrorMessage } from '../../../utils/apiHelpers';

const ITEM_STATUS = {
  Accepted: 0,
  Packed: 1,
  Issued: 2,
  Reprocessing: 3,
  Damaged: 4,
  Lost: 5,
};

export function usePackingPage() {
  // State hooks - must be called first and in same order
  const [receiptNumber, setReceiptNumber] = useState('');
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Computed values
  const selectableItems = useMemo(() => {
    return items.filter((item) => item.status !== ITEM_STATUS.Packed);
  }, [items]);

  const selectedItem = useMemo(() => {
    return items.find((item) => item.id === selectedItemId);
  }, [items, selectedItemId]);

  // Callback hooks - must be called after state and useMemo
  const handleReceiptChange = useCallback((value) => {
    const digitsOnly = String(value).replace(/\D/g, '');
    setReceiptNumber(digitsOnly);
    setError('');
  }, []);

  const handleSearch = useCallback(async () => {
    if (!receiptNumber.trim()) {
      setError('Enter receipt number');
      return;
    }

    setLoading(true);
    setError('');
    setSelectedItemId(null);

    try {
      const data = await getOrderByReceiptApi(receiptNumber.trim());

      if (data.code !== 0) {
        setError(data.message || 'Order not found');
        setItems([]);
        setSelectedItemId(null);
        return;
      }

      const responseItems = data.response ?? [];

      if (responseItems.length === 0) {
        setError('No items found for this receipt number');
        setItems([]);
        setSelectedItemId(null);
        return;
      }

      setItems(responseItems);
    } catch (err) {
      const errorMessage = getAxiosErrorMessage(err);
      setError(errorMessage);
      setItems([]);
      setSelectedItemId(null);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [receiptNumber]);

  const selectItem = useCallback((itemId) => {
    setSelectedItemId(itemId === selectedItemId ? null : itemId);
  }, [selectedItemId]);

  const handleSubmit = useCallback(async () => {
    if (!selectedItemId) {
      setError('Select an item to pack');
      return false;
    }

    setSubmitting(true);
    setError('');

    try {
      const data = await updateOrderItemsStatusApi(selectedItemId, ITEM_STATUS.Packed);

      if (data.code !== 0) {
        setError(data.message || 'Failed to update item status');
        return false;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedItemId
            ? { ...item, status: ITEM_STATUS.Packed }
            : item
        )
      );

      setSelectedItemId(null);
      toast.success('Item packed successfully', {
        description: 'Item was updated to Packed status.',
      });
      return true;
    } catch (err) {
      const errorMessage = getAxiosErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [selectedItemId]);

  return {
    // State
    receiptNumber,
    items,
    selectedItemId,
    selectedItem,
    loading,
    submitting,
    error,

    // Computed
    selectableItems,

    // Actions
    handleReceiptChange,
    handleSearch,
    selectItem,
    handleSubmit,
  };
}