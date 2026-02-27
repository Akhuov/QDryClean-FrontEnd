import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import axiosInstance from '../shared/api/axiosInstance';
import { ChevronLeft, ChevronRight } from "lucide-react";

// Маппинг статуса
const statusMap = {
  0: { label: "Created",   badge: "bg-zinc-200 text-zinc-900 border border-zinc-400" },
  1: { label: "Accepted",  badge: "bg-sky-200 text-sky-900 border border-sky-400" },
  2: { label: "Ready",     badge: "bg-yellow-200 text-yellow-950 border border-yellow-400" },
  3: { label: "Completed", badge: "bg-emerald-200 text-emerald-950 border border-emerald-400" },
  4: { label: "Canceled",  badge: "bg-rose-200 text-rose-950 border border-rose-400" },
  5: { label: "Donated",   badge: "bg-violet-200 text-violet-950 border border-violet-400" },
};

function StatusBadge({ status }) {
  const meta = statusMap[status] ?? { label: `Status ${status}`, badge: 'bg-muted text-muted-foreground' };
  return <span className={`px-3 py-1 rounded-full text-sm ${meta.badge}`}>{meta.label}</span>;
}

function getAxiosErrorMessage(err) {
  // axios error: err.response?.data?.message / err.message
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    'Request failed'
  );
}

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
        const res = await axiosInstance.get('/orders', {
          params: {
            page: pageArg,
            pageSize,
            //search: q || undefined,
          },
        });
        if (res.data?.code !== 0) {
          throw new Error(res.data?.message || 'API error');
        }

        // Ожидаем { items, page, pageSize, totalCount, totalPages }
        const resp = res.data.response;

        setPaged({
          items: resp?.items ?? [],
          page: resp?.page ?? pageArg,
          pageSize: resp?.pageSize ?? pageSize,
          totalCount: resp?.totalCount ?? 0,
          totalPages: resp?.totalPages ?? 1,
        });
      } catch (err) {
        setApiError(getAxiosErrorMessage(err));
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

  // Кнопка Search применяет строку и сбрасывает страницу на 1
  const handleSearch = () => {
    setPage(1);
    setAppliedSearch(searchQuery.trim());
  };

  // Enter в поле поиска
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
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

  const canPrev = page > 1;
  const canNext = page < (paged.totalPages || 1);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">Create and manage orders.</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary flex items-center gap-2 border border-primary">
              <Plus className="w-4 h-4" />
              Add Order
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[680px] bg-white opacity-100">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add New Order</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerId">Customer ID *</Label>
                  <Input
                    id="customerId"
                    placeholder="1"
                    value={newOrder.customerId}
                    onChange={(e) => setNewOrder((p) => ({ ...p, customerId: e.target.value }))}
                    className="bg-input-background border-input w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiptNumber">Receipt Number *</Label>
                  <Input
                    id="receiptNumber"
                    placeholder="1"
                    value={newOrder.receiptNumber}
                    onChange={(e) => setNewOrder((p) => ({ ...p, receiptNumber: e.target.value }))}
                    className="bg-input-background border-input w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Process Status</Label>
                  <Select
                    value={String(newOrder.processStatus)}
                    onValueChange={(v) => setNewOrder((p) => ({ ...p, processStatus: Number(v) }))}
                  >
                    <SelectTrigger className="bg-input-background border-input w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">New</SelectItem>
                      <SelectItem value="1">In Progress</SelectItem>
                      <SelectItem value="2">Ready</SelectItem>
                      <SelectItem value="3">Completed</SelectItem>
                      <SelectItem value="4">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedCompletionDate">Expected Completion Date</Label>
                  <Input
                    id="expectedCompletionDate"
                    type="date"
                    value={newOrder.expectedCompletionDate}
                    onChange={(e) => setNewOrder((p) => ({ ...p, expectedCompletionDate: e.target.value }))}
                    className="bg-input-background border-input w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (one per line)</Label>
                <Textarea
                  id="notes"
                  placeholder={'Test 1\nTest 2'}
                  value={newOrder.notesText}
                  onChange={(e) => setNewOrder((p) => ({ ...p, notesText: e.target.value }))}
                  className="bg-input-background border-input min-h-[140px] w-full resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Each line will be saved as a separate note.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" className="border-input" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateOrder} className="bg-primary hover:bg-primary/90">
                  Create Order
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="border-border shadow-sm">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search orders by id, receipt number, customerId..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="bg-input-background border-input pl-10"
              />
            </div>

            <Button onClick={handleSearch} variant="outline" className="border-input hover:shadow-sm" disabled={loading}>
              Search
            </Button>
          </div>

          {apiError && <p className="text-sm text-destructive mt-3">{apiError}</p>}
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">
            All Orders ({orders.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-muted-foreground">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Expected Date</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-foreground">{order.id}</TableCell>
                    <TableCell className="text-muted-foreground">{order.customerId}</TableCell>
                    <TableCell className="text-muted-foreground">{order.receiptNumber}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.expectedCompletionDate || '—'}
                    </TableCell>
                    <TableCell className="text-center text-foreground">
                      {Array.isArray(order.items) ? order.items.length : 0}
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={order.processStatus} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted" title="View">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted" title="Edit">
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
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
            variant="outline"
            size="sm"
            className="border-input"
            disabled={!canPrev || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground border-primary" disabled>
            {page}
          </Button>

          <Button
            variant="outline"
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