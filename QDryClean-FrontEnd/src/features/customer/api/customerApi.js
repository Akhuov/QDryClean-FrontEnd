import axiosInstance from '@/shared/api/axiosInstance';


export async function createCustomerApi(payload) {
  const res = await axiosInstance.post('/customers', payload);
  return res.data;
}

export const getCustomersApi = async ({ page, pageSize, search }) => {
  const response = await axiosInstance.get('/customers', {
    params: {
      page,
      pageSize,
      search,
    },
  });

  return response.data;
};

export const getCustomerByIdApi = async (customerId) => {
  const response = await axiosInstance.get(`/customers/${customerId}`);
  return response.data;
};
