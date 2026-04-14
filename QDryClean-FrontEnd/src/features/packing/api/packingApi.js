import axiosInstance from '../../../shared/api/axiosInstance';

export const getOrderByReceiptApi = async (receiptNumber) => {
  const response = await axiosInstance.get(`/orders/items/by-receipt/${receiptNumber}`);
  return response.data;
};

export const updateOrderItemsStatusApi = async (itemId, status) => {
  const response = await axiosInstance.patch(`/Items/status/${itemId}`, {
    status: status,
  });
  return response.data;
};

export const updateMultipleItemsStatusApi = async (itemIds, status) => {
  const promises = itemIds.map(itemId => 
    updateOrderItemsStatusApi(itemId, status)
  );
  
  const results = await Promise.all(promises);
  return {
    code: 0,
    message: 'Success',
    response: results
  };
};