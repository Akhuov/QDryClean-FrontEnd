import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
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
} from '../../../../components/ui/Table';
import axiosInstance from '../../../../shared/api/axiosInstance';
import OrderStatusBadge from '../../../../components/OrderStatusBadge';
import PaymentStatusBadge from '../../../../components/PaymentStatusBadge';
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
          pageSize: 10,
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

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('ru-RU') : '—';

  return (
    <Card className="border-slate-200 shadow-sm bg-white">
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-6">
        <CardTitle className="text-lg font-semibold">Последние заказы</CardTitle>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl cursor-pointer">
            Экспорт CSV
          </Button>
          <Button
            variant="outline"
            className="rounded-xl cursor-pointer"
            onClick={() => navigate('/orders')}
          >
            Все заказы
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="py-20 text-center text-slate-400 animate-pulse">Загрузка данных...</div>
        ) : apiError ? (
          <div className="py-20 text-center text-sm text-red-500">{apiError}</div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="pl-6 py-4 text-slate-500 font-medium">Клиент</TableHead>
                <TableHead className="text-slate-500 font-medium">Номер чека</TableHead>
                <TableHead className="text-slate-500 font-medium">Дата</TableHead>
                <TableHead className="text-center text-slate-500 font-medium">Позиции</TableHead>
                <TableHead className="text-center text-slate-500 font-medium">Статус</TableHead>
                <TableHead className="text-center text-slate-500 font-medium">Оплата</TableHead>
                <TableHead className="text-right text-slate-500 font-medium">Стоимость</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => (
                <TableRow 
                  key={order.id}
                  className="group cursor-pointer hover:bg-slate-100/80 transition-colors border-b border-slate-100 last:border-0 relative"
                  onClick={() => vm.handleViewOrder(order.id)}
                >
                  <TableCell className="pl-6 py-4">
                    <div className="font-semibold text-slate-900">{order.customer?.fullName}</div>
                    <div className="text-xs text-slate-400">{order.customer?.phoneNumber}</div>
                  </TableCell>

                  <TableCell className="font-mono text-slate-500">
                    {order.receiptNumber}
                  </TableCell>

                  <TableCell>
                    <div className="text-sm text-slate-700">{formatDate(order.createdAt)}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-tighter">
                      ожид: {formatDate(order.expectedCompletionDate)}
                    </div>
                  </TableCell>

                  <TableCell className="text-center font-medium text-slate-600">
                    {order.itemsCount}
                  </TableCell>

                  <TableCell className="text-center">
                    <OrderStatusBadge status={order.status} />
                  </TableCell>

                  <TableCell className="text-center">
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </TableCell>

                  <TableCell className="text-right font-semibold text-slate-900 whitespace-nowrap">
                    {order.totalCost?.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">СУМ</span>
                  </TableCell>
                </TableRow>
              ))}

              {!loading && orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-20 text-center text-slate-400 bg-slate-50/20">
                    Заказы не найдены
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