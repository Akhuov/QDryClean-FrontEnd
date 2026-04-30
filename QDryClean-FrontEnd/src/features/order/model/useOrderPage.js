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

export function useOrderPage(initialFrom = null, initialTo = null) {
  // =========================
  // ALL STATE HOOKS (must be first)
  // =========================
  // VIEW STATE
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  
  // FILTER STATE
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // DATA STATE
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [paged, setPaged] = useState({
    items: [],
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  });

  // =========================
  // FETCH (SINGLE SOURCE OF TRUTH)
  // =========================
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setApiError('');

    try {
      const trimmed = appliedSearch.trim();

      const res = await axiosInstance.get('/orders', {
        params: {
          page,
          pageSize,
          search: trimmed || undefined,
          status: selectedStatus !== 'all' ? Number(selectedStatus) : undefined,
          from: from ?? undefined,
          to: to ?? undefined,
        },
      });

      if (res.data?.code !== 0) {
        throw new Error(res.data?.message || 'Ошибка загрузки заказов');
      }

      const resp = res.data.response ?? res.data.responseBody;

      setPaged({
        items: resp?.items ?? [],
        page: resp?.page ?? page,
        pageSize: resp?.pageSize ?? pageSize,
        totalCount: resp?.totalCount ?? 0,
        totalPages: resp?.totalPages ?? 1,
      });
    } catch (err) {
      setApiError(getAxiosErrorMessage(err));
      setPaged((prev) => ({
        ...prev,
        items: [],
        totalCount: 0,
        totalPages: 1,
      }));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, appliedSearch, selectedStatus, from, to]);

  // =========================
  // AUTO FETCH (FIXED)
  // =========================
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // =========================
  // SEARCH DEBOUNCE
  // =========================
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchQuery.trim();
      setPage(1);
      setAppliedSearch(trimmed);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // =========================
  // ACTIONS
  // =========================
  const handleSearchChange = setSearchQuery;

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setPage(1);
  };

  const handlePageChange = (pageOrFn) => {
    setPage((prev) =>
      typeof pageOrFn === 'function' ? pageOrFn(prev) : pageOrFn
    );
  };

  const handlePageSizeChange = (value) => {
    setPageSize(Number(value));
    setPage(1);
  };

  const handleOrderDialogOpenChange = async (isOpen) => {
    setIsViewOpen(isOpen);

    if (!isOpen) {
      setViewOrder(null);
      await fetchOrders();
    }
  };

  // =========================
  // VIEW ORDER
  // =========================
  const handleViewOrder = async (orderId) => {
    try {
      setViewLoading(true);
      setIsViewOpen(true);
      setViewOrder(null);

      const data = await getOrderByIdApi(orderId);

      if (data.code !== 0 || !data.response) {
        throw new Error(data.message);
      }

      setViewOrder(data.response);
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
      setIsViewOpen(false);
    } finally {
      setViewLoading(false);
    }
  };

  // =========================
  // DELETE / COMPLETE
  // =========================
  const handleDeleteOrder = async (orderId) => {
    try {
      const data = await deleteOrderApi(orderId);

      if (data.code === 0) {
        toast.success('Заказ удалён');
        fetchOrders();
      }
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      const data = await completeOrderApi(orderId);

      if (data.code === 0) {
        toast.success('Заказ завершён');
        fetchOrders();
      }
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    }
  };

  // =========================
  // PRINT
  // =========================
  const handlePrint = async (orderId) => {
    try {
      const data = await getReceiptByIdApi(orderId);

      if (data.code !== 0 || !data.response) {
        throw new Error('Ошибка чека');
      }

      await printReceipt(data.response);
      toast.success('Чек напечатан');
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    }
  };

  // =========================
  // DERIVED STATE
  // =========================
  const orders = useMemo(() => paged.items ?? [], [paged.items]);
  const isIdSearch = parseId(appliedSearch) !== null;

  const canPrev = !isIdSearch && page > 1;
  const canNext = !isIdSearch && page < (paged.totalPages || 1);

  // =========================
  // API
  // =========================
  return {
    // view
    isViewOpen,
    setIsViewOpen,
    viewOrder,
    setViewOrder,
    viewLoading,

    // filters
    searchQuery,
    appliedSearch,
    from,
    to,
    setFrom,
    setTo,

    // pagination
    page,
    setPage,
    pageSize,
    selectedStatus,

    // data
    loading,
    apiError,
    paged,
    orders,

    canPrev,
    canNext,

    // actions
    fetchOrders,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    handlePageSizeChange,
    handleViewOrder,
    handleDeleteOrder,
    handleCompleteOrder,
    handlePrint,

    handleOrderDialogOpenChange,
  };
}