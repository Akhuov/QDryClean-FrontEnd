import axiosInstance from '@/shared/api/axiosInstance';

export async function fetchItemTypesApi() {
  const res = await axiosInstance.get('/item-types');
  return res.data;
}

export async function searchCustomerByPhoneApi(phone) {
  const res = await axiosInstance.get(`/customers/by-phone/${phone}`);
  return res.data;
}

export async function createOrderApi(payload) {
  const res = await axiosInstance.post('/orders', payload);
  return res.data;
}

export const updateOrderApi = async (id, payload) => {
  const { data } = await axiosInstance.put(`/orders/${id}`, payload);
  return data;
};

export const getOrderByIdApi = async (id) => {
  const { data } = await axiosInstance.get(`/orders/${id}`);
  return data;
};

export const deleteOrderApi = async (orderId) => {
  const response = await axiosInstance.delete(`/orders/${orderId}`);
  return response.data;
};

export const completeOrderApi = async (orderId) => {
  const response = await axiosInstance.patch(`/orders/${orderId}`, {
    status: 4,
    note: 'Order Completed!',
  });

  return response.data;
};

export const getReceiptByIdApi = async (id) => {
  const { data } = await axiosInstance.get(`/orders/${id}/receipt64`);
  return data;
};

export const createPaymentApi = async (orderId, payload) => {
  const { data } = await axiosInstance.post(`/orders/${orderId}/payments`, payload);
  return data;
};