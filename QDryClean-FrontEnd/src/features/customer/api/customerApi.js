import axiosInstance from '@/shared/api/axiosInstance';


export async function createCustomerApi(payload) {
  const res = await axiosInstance.post('/customers', payload);
  return res.data;
}