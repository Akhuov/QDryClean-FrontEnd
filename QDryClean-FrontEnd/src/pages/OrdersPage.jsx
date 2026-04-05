import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import axiosInstance from '../shared/api/axiosInstance';
import StatusBadge from '../components/StatusBadge';
import { getAxiosErrorMessage, parseId } from '../utils/apiHelpers';
import OrderFormDialog from '../features/order/ui/OrderFormDialog';
import OrdersSearchToolbar from '../features/order/ui/OrdersSearchToolbar';
import { deleteOrderApi, getOrderByIdApi, completeOrderApi } from '../features/order/api/orderApi';
import { toast } from 'sonner';
import {
  AlertDialogTrigger,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '../components/ui/alert-dialog';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const fetchOrders = useCallback(
    async ({ page: pageArg, q, pageSize: pageSizeArg }) => {
      setLoading(true);
      setApiError('');

      try {
        const trimmed = String(q ?? '').trim();

        const res = await axiosInstance.get('/orders', {
          params: {
            page: pageArg,
            pageSize: pageSizeArg,
            search: trimmed || undefined,
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
    },
    []
  );

  useEffect(() => {
    fetchOrders({ page, q: appliedSearch, pageSize });
  }, [fetchOrders, page, appliedSearch, pageSize]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setAppliedSearch('');
    setPage(1);
  };

  const handlePageSizeChange = (value) => {
    const nextPageSize = Number(value);

    setPageSize(nextPageSize);
    setPage(1);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const data = await deleteOrderApi(orderId);

      if (data.code === 0) {
        toast.success('Order deleted successfully');

        fetchOrders({
          page: page,
          q: appliedSearch,
          pageSize,
        });

        return;
      }

      toast.error(data.message || 'Failed to delete order');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete order');
    }
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
      });
    }
  };

  const handleCreateOrder = () => {
    setDialogMode('create');
    setSelectedOrder(null);
    setIsModalOpen(true);
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
        });

        return;
      }

      toast.error(data.message || 'Failed to complete order');
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || 'Failed to complete order'
      );
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

  const handleSearch = () => {
    setPage(1);
    setAppliedSearch(searchQuery.trim());
  };

  const orders = useMemo(() => paged.items ?? [], [paged.items]);

  const isIdSearch = parseId(appliedSearch) !== null;

  const canPrev = !isIdSearch && page > 1;
  const canNext = !isIdSearch && page < (paged.totalPages || 1);

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


  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">Create and manage orders.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <OrdersSearchToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          onClear={handleSearchClear}
          loading={loading}
          error={apiError}
        />

        <div className="w-full lg:w-auto">
          <OrderFormDialog
            mode={dialogMode}
            open={isModalOpen}
            onOpenChange={handleOrderDialogOpenChange}
            loading={editLoading}
            initialOrder={selectedOrder}
          >
            <Button
              variant="default"
              className="h-10 w-full lg:w-auto flex items-center gap-2 border border-border"
              onClick={handleCreateOrder}
            >
              <Plus className="h-4 w-4" />
              Create Order
            </Button>
          </OrderFormDialog>
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-foreground">Orders</CardTitle>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Table Size
            </span>

            <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-muted-foreground">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Receipt Number</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Expected Date</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="text-muted-foreground">
                      {order.customer?.fullName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.receiptNumber}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.expectedCompletionDate
                        ? new Date(order.expectedCompletionDate).toLocaleDateString()
                        : '—'}
                    </TableCell>
                    <TableCell className="text-center text-foreground">
                      {order.itemsCount}
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={order.processStatus} />
                    </TableCell>
                    <TableCell className="text-right">{order.totalCost}</TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-muted"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </Button>

                        {order.processStatus === 0 && (
                          <Button
                            type="button"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-muted"
                            title="Edit"
                            onClick={() => handleEditOrder(order.id)}
                          >
                            <Edit className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        )}

                        {order.processStatus === 2 && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                type="button"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-muted"
                                title="Complete"
                                variant="default"
                              >
                                <Check />
                              </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Complete order?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will change the order status from Ready to Completed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  type="button"
                                  onClick={() => {
                                    handleCompleteOrder(order.id);
                                  }}
                                >
                                  Complete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant="delete"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete order?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                type="button"
                                onClick={() => {
                                  handleDeleteOrder(order.id);
                                }}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} of {paged.totalPages} • Total {paged.totalCount} • Showing up to {pageSize} rows
        </p>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="border-input"
            disabled={!canPrev || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button size="sm" className="bg-primary text-primary-foreground border-primary" disabled>
            {page}
          </Button>

          <Button
            size="sm"
            className="border-input"
            disabled={!canNext || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}