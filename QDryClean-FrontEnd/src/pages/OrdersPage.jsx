import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import axiosInstance from '../shared/api/axiosInstance';
import StatusBadge from '../components/StatusBadge';
import { getAxiosErrorMessage, parseId } from '../utils/apiHelpers';
import OrderFormDialog from '../components/orders/OrderFormDialog';
import OrdersMetrics from '../components/orders/OrdersMetrics';
import OrdersSearchToolbar from '../components/orders/OrdersSearchToolbar';

export default function OrdersPage() {
  // search input (то, что пользователь печатает)
  const [searchQuery, setSearchQuery] = useState('');
  // appliedSearch (то, что реально применили кнопкой Search)
  const [appliedSearch, setAppliedSearch] = useState('');

  const [page, setPage] = useState(1);

  // api state
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [paged, setPaged] = useState({
    items: [],
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  });

  // modal form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerId: '',
    receiptNumber: '',
    processStatus: 0,
    expectedCompletionDate: '',
    notesText: '',
  });

  const pageSize = 10;

  const fetchOrders = useCallback(
    async ({ page: pageArg, q }) => {
      setLoading(true);
      setApiError('');

      try {
        const trimmed = String(q ?? '').trim();

        // ✅ список + search
        const res = await axiosInstance.get('/orders', {
          params: {
            page: pageArg,
            pageSize,
            search: trimmed || undefined, // ВОТ ЭТО НУЖНО
          },
        });

        if (res.data?.code !== 0) throw new Error(res.data?.message || 'API error');

        const resp = res.data.response ?? res.data.responseBody;

        setPaged({
          items: resp?.items ?? [],
          page: resp?.page ?? pageArg,
          pageSize: resp?.pageSize ?? pageSize,
          totalCount: resp?.totalCount ?? 0,
          totalPages: resp?.totalPages ?? 1,
        });
      } catch (err) {
        setApiError(getAxiosErrorMessage(err));
        setPaged((p) => ({ ...p, items: [], page: 1, totalCount: 0, totalPages: 1 }));
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  // Загружаем при старте и при смене page (по appliedSearch)
  useEffect(() => {
    fetchOrders({ page, q: appliedSearch });
  }, [fetchOrders, page, appliedSearch]);

  const handleSearchChange = (value) => setSearchQuery(value);
  const handleSearchClear = () => {
    setSearchQuery('');
    setAppliedSearch('');
    setPage(1);
  };

  const handleSearch = () => {
    setPage(1);
    setAppliedSearch(searchQuery.trim());
  };

  const handleCreateOrder = async () => {
    if (!newOrder.customerId || !newOrder.receiptNumber) {
      alert('Please fill in required fields: customerId, receiptNumber');
      return;
    }

    try {
      const payload = {
        customerId: Number(newOrder.customerId),
        receiptNumber: Number(newOrder.receiptNumber),
        processStatus: Number(newOrder.processStatus),
        expectedCompletionDate: newOrder.expectedCompletionDate || null,
        notes: newOrder.notesText
          ? newOrder.notesText.split('\n').map((s) => s.trim()).filter(Boolean)
          : [],
        items: [],
      };

      const res = await axiosInstance.post('/orders', payload);

      if (res.data?.code !== 0) {
        throw new Error(res.data?.message || 'Create order failed');
      }

      setIsModalOpen(false);
      setNewOrder({
        customerId: '',
        receiptNumber: '',
        processStatus: 0,
        expectedCompletionDate: '',
        notesText: '',
      });

      // перезагрузим текущую страницу с текущим appliedSearch
      fetchOrders({ page, q: appliedSearch });

      alert('Order created successfully!');
    } catch (err) {
      alert(getAxiosErrorMessage(err));
    }
  };

  // Таблица: тут уже НЕ делаем дополнительный фильтр, чтобы не "двойной фильтрации"
  const orders = useMemo(() => paged.items ?? [], [paged.items]);

  const isIdSearch = parseId(appliedSearch) !== null;

  const canPrev = !isIdSearch && page > 1;
  const canNext = !isIdSearch && page < (paged.totalPages || 1);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">Create and manage orders.</p>
        </div>
      </div>

      {/* Top toolbar */}
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
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            order={newOrder}
            onChange={setNewOrder}
            onSubmit={handleCreateOrder}
            loading={loading}
          >
            <Button variant="default" className="h-10 w-full lg:w-auto flex items-center gap-2 border border-border">
              <Plus className="h-4 w-4" />
              Add Order
            </Button>
          </OrderFormDialog>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">
            Orders
          </CardTitle>
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="text-muted-foreground">{order.customerName}</TableCell>
                    <TableCell className="text-muted-foreground">{order.receiptNumber}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.expectedCompletionDate ? new Date(order.expectedCompletionDate).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell className="text-center text-foreground">
                      {order.itemsCount}
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={order.processStatus} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" className="h-8 w-8 p-0 hover:bg-muted" title="View">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button size="sm" className="h-8 w-8 p-0 hover:bg-muted" title="Edit">
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="delete"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} of {paged.totalPages} • Total {paged.totalCount}
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