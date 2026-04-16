import { useCallback, useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { useOrderPage } from '../../../order/model/useOrderPage';
import OrderViewDialog from '../../../order/ui/OrderViewDialog';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table';
import axiosInstance from '../../../../shared/api/axiosInstance';
import StatusBadge from '../../../../components/StatusBadge';
import { getAxiosErrorMessage } from '../../../../utils/apiHelpers';

export default function RecentOrdersCard() {
  const navigate = useNavigate();
  const vm = useOrderPage();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [orders, setOrders] = useState([]);

  const fetchRecentOrders = useCallback(async () => {
    setLoading(true);
    setApiError('');

    try {
      const res = await axiosInstance.get('/orders', {
        params: {
          page: 1,
          pageSize: 5,
        },
      });

      if (res.data?.code !== 0) {
        throw new Error(res.data?.message || 'API error');
      }

      const resp = res.data.response ?? res.data.responseBody;

      setOrders(resp?.items ?? []);
    } catch (err) {
      setApiError(getAxiosErrorMessage(err));
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentOrders();
  }, [fetchRecentOrders]);

  return (
    <Card className="rounded-[28px] border border-white/60 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)]">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-[30px] font-semibold tracking-tight text-slate-800">
          Recent Orders
        </CardTitle>

        <div className="flex items-center gap-3">
          <Button variant="default" className="rounded-xl cursor-pointer">
            Export CSV
          </Button>
          <Button
            variant="default"
            className="rounded-xl cursor-pointer"
            onClick={() => navigate('/orders')}
          >
            All Orders
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="py-10 text-center text-muted-foreground">Loading...</div>
        ) : apiError ? (
          <div className="py-10 text-center text-sm text-red-500">{apiError}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
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
                    {order.customer?.fullName ?? '—'}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {order.customer?.phoneNumber ?? '—'}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {order.receiptNumber ?? '—'}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString('ru-RU')
                      : '—'}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {order.expectedCompletionDate
                      ? new Date(order.expectedCompletionDate).toLocaleDateString('ru-RU')
                      : '—'}
                  </TableCell>

                  <TableCell className="text-center text-foreground">
                    {order.itemsCount ?? 0}
                  </TableCell>

                  <TableCell className="text-center">
                    <StatusBadge status={order.status} />
                  </TableCell>

                  <TableCell className="text-right">
                    {order.totalCost ?? '—'}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button className="cursor-pointer"
                        type="button"
                        variant="default"
                        size="icon"
                        title="View"
                        onClick={() => vm.handleViewOrder(order.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-10 text-center text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <OrderViewDialog
        open={vm.isViewOpen}
        onOpenChange={(open) => {
            vm.setIsViewOpen(open);
            if (!open) {
            vm.setViewOrder(null);
            }
        }}
        order={vm.viewOrder}
        loading={vm.viewLoading}
        />
    </Card>
  );
}