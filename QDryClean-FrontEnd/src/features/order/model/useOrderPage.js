import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import axiosInstance from '../../../shared/api/axiosInstance';
import { printReceipt } from '../../../shared/api/printService';
import { getAxiosErrorMessage, parseId } from '../../../utils/apiHelpers';
import {
  deleteOrderApi,
  getOrderByIdApi,
  completeOrderApi,
  getReceiptByIdApi,
} from '../api/orderApi';

export function useOrderPage() {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [paged, setPaged] = useState({
    items: [],
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  });

  const [editLoading, setEditLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async ({ page: pageArg, q, pageSize: pageSizeArg, status }) => {
    setLoading(true);
    setApiError('');

    try {
      const trimmed = String(q ?? '').trim();

      const res = await axiosInstance.get('/orders', {
        params: {
          page: pageArg,
          pageSize: pageSizeArg,
          search: trimmed || undefined,
          status: status !== 'all' ? Number(status) : undefined,
        },
      });

      if (res.data?.code !== 0) {
        throw new Error(res.data?.message || 'API error');
      }

      const resp = res.data.response ?? res.data.responseBody;

      setPaged({
        items: resp?.items ?? [],
        page: resp?.page ?? pageArg,
        pageSize: resp?.pageSize ?? pageSizeArg,
        totalCount: resp?.totalCount ?? 0,
        totalPages: resp?.totalPages ?? 1,
      });
    } catch (err) {
      setApiError(getAxiosErrorMessage(err));
      setPaged((prev) => ({
        ...prev,
        items: [],
        page: 1,
        totalCount: 0,
        totalPages: 1,
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders({ page, q: appliedSearch, pageSize, status: selectedStatus });
  }, [fetchOrders, page, appliedSearch, pageSize, selectedStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchQuery.trim();

      if (trimmed !== appliedSearch) {
        setPage(1);
        setAppliedSearch(trimmed);
      }

      if (!trimmed && appliedSearch !== '') {
        setPage(1);
        setAppliedSearch('');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, appliedSearch]);

  const handleSearchChange = (value) => setSearchQuery(value);

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setPage(1);
  };

  const handleSearch = () => {
    setPage(1);
    setAppliedSearch(searchQuery.trim());
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setAppliedSearch('');
    setPage(1);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(Number(value));
    setPage(1);
  };

  const handleCreateOrder = () => {
    setDialogMode('create');
    setSelectedOrder(null);
    setIsModalOpen(true);
  };

  const handleOrderDialogOpenChange = async (isOpen) => {
    setIsModalOpen(isOpen);

    if (!isOpen) {
      setDialogMode('create');
      setSelectedOrder(null);

      await fetchOrders({
        page,
        q: appliedSearch,
        pageSize,
        status: selectedStatus,
      });
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      setViewLoading(true);
      setIsViewOpen(true);
      setViewOrder(null);

      const data = await getOrderByIdApi(orderId);

      if (data.code !== 0 || !data.response) {
        throw new Error(data.message || 'Failed to load order');
      }

      setViewOrder(data.response);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to load order details'
      );
      setIsViewOpen(false);
    } finally {
      setViewLoading(false);
    }
  };

  const handleEditOrder = async (orderId) => {
    try {
      setEditLoading(true);

      const data = await getOrderByIdApi(orderId);

      if (data.code !== 0 || !data.response) {
        throw new Error(data.message || 'Failed to load order');
      }

      setDialogMode('edit');
      setSelectedOrder(data.response);
      setIsModalOpen(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to load order details'
      );
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const data = await deleteOrderApi(orderId);

      if (data.code === 0) {
        toast.success('Order deleted successfully');

        fetchOrders({
          page,
          q: appliedSearch,
          pageSize,
          status: selectedStatus,
        });
        return;
      }

      toast.error(data.message || 'Failed to delete order');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete order');
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      const data = await completeOrderApi(orderId);

      if (data.code === 0) {
        toast.success('Order completed successfully');

        await fetchOrders({
          page,
          q: appliedSearch,
          pageSize,
          status: selectedStatus,
        });
        return;
      }

      toast.error(data.message || 'Failed to closed order');
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || 'Failed to closed order'
      );
    }
  };

  const handlePrint = async (orderId) => {
    try {
      const data = await getReceiptByIdApi(orderId);

      if (data.code !== 0 || !data.response) {
        throw new Error(data.message || 'Failed to load order');
      }

      const reseipt = data.response;

      if (!reseipt) {
        toast.error('Receipt data not found');
        return;
      }

      await printReceipt(reseipt);
      toast.success('Receipt printed successfully');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to print receipt'
      );
    }
  };

  const orders = useMemo(() => paged.items ?? [], [paged.items]);
  const isIdSearch = parseId(appliedSearch) !== null;
  const canPrev = !isIdSearch && page > 1;
  const canNext = !isIdSearch && page < (paged.totalPages || 1);

  return {
    isViewOpen,
    setIsViewOpen,
    viewOrder,
    setViewOrder,
    viewLoading,

    searchQuery,
    appliedSearch,
    page,
    setPage,
    pageSize,
    selectedStatus,
    loading,
    apiError,
    paged,
    editLoading,
    isModalOpen,
    dialogMode,
    selectedOrder,

    orders,
    canPrev,
    canNext,

    handleSearchChange,
    handleStatusChange,
    handleSearch,
    handleSearchClear,
    handlePageSizeChange,
    handleCreateOrder,
    handleOrderDialogOpenChange,
    handleViewOrder,
    handleEditOrder,
    handleDeleteOrder,
    handleCompleteOrder,
    handlePrint,
  };
}