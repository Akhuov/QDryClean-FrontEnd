import axiosInstance from '../../../shared/api/axiosInstance';

export const getOrderByReceiptApi = async (receiptNumber) => {
  const response = await axiosInstance.get(`/orders/by-receipt/${receiptNumber}/items`);
  return response.data;
};

export const updateOrderItemsStatusApi = async (itemId, status) => {
  const response = await axiosInstance.patch(`/items/${itemId}/status`, {
    status: status,
  });
  return response.data;
};
