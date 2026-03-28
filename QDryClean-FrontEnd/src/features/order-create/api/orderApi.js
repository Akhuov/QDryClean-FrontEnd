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

export const deleteOrderApi = async (orderId) => {
  const response = await axiosInstance.delete(`/orders/${orderId}`);
  return response.data;
};