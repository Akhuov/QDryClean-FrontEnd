import { useCallback, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardPagination } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { useOrderPage } from '../../../order/model/useOrderPage';
import OrderViewDialog from '../../../order/ui/OrderViewDialog';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/Table';

import OrderStatusBadge from '../../../../components/OrderStatusBadge';
import PaymentStatusBadge from '../../../../components/PaymentStatusBadge';

export default function RecentOrdersCard({ selectedPeriod }) {
  const navigate = useNavigate();
  
  const from = useMemo(
    () => (selectedPeriod?.from ? format(selectedPeriod.from, 'yyyy-MM-dd') : null),
    [selectedPeriod?.from]
  );

  const to = useMemo(
    () => (selectedPeriod?.to ? format(selectedPeriod.to, 'yyyy-MM-dd') : null),
    [selectedPeriod?.to]
  );

  const vm = useOrderPage(from, to);

  // source of truth (без локального state)
  const orders = vm.paged.items ?? [];
  const loading = vm.loading;
  const apiError = vm.apiError;

  // =========================
  // PAGE CHANGE (fixed)
  // =========================
  const handlePageChange = useCallback(
    (pageOrFn) => {
      vm.handlePageChange(pageOrFn);
    },
    [vm]
  );

  const paginationVm = useMemo(
    () => ({
      page: vm.page,
      loading: vm.loading,
      canNext: vm.canNext,
      paged: vm.paged,
      setPage: handlePageChange,
    }),
    [vm.page, vm.loading, vm.canNext, vm.paged, handlePageChange]
  );

  // =========================
  // PERIOD CHANGE (update from/to in useOrderPage)
  // =========================
  useEffect(() => {
    vm.setFrom(from);
    vm.setTo(to);
  }, [from, to, vm]);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('ru-RU') : '—';

  return (
    <Card className="border-slate-200 shadow-sm bg-white">
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-6">
        <CardTitle className="text-lg font-semibold">
          Последние заказы
        </CardTitle>

        <div className="flex items-center gap-3">
          <Button variant="outline">Экспорт CSV</Button>
          <Button onClick={() => navigate('/orders')}>
            Все заказы
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="py-20 text-center text-slate-400 animate-pulse">
            Загрузка...
          </div>
        ) : apiError ? (
          <div className="py-20 text-center text-red-500 text-sm">
            {apiError}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Клиент</TableHead>
                <TableHead>Чек</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead className="text-center">Позиции</TableHead>
                <TableHead className="text-center">Статус</TableHead>
                <TableHead className="text-center">Оплата</TableHead>
                <TableHead className="text-right">Сумма</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-slate-100"
                  onClick={() => vm.handleViewOrder(order.id)}
                >
                  <TableCell>
                    <div className="font-semibold">{order.customer?.fullName}</div>
                    <div className="text-xs text-slate-400">
                      {order.customer?.phoneNumber}
                    </div>
                  </TableCell>

                  <TableCell className="font-mono">
                    {order.receiptNumber}
                  </TableCell>

                  <TableCell>
                    <div>{formatDate(order.createdAt)}</div>
                    <div className="text-xs text-slate-400">
                      ожид: {formatDate(order.expectedCompletionDate)}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    {order.itemsCount}
                  </TableCell>

                  <TableCell className="text-center">
                    <OrderStatusBadge status={order.status} />
                  </TableCell>

                  <TableCell className="text-center">
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </TableCell>

                  <TableCell className="text-right font-semibold">
                    {order.totalCost?.toLocaleString()} СУМ
                  </TableCell>
                </TableRow>
              ))}

              {!loading && orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-20 text-center text-slate-400">
                    Заказы не найдены
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        <CardPagination vm={paginationVm} />
      </CardContent>

      <OrderViewDialog
        open={vm.isViewOpen}
        onOpenChange={(open) => {
          vm.setIsViewOpen(open);
          if (!open) vm.setViewOrder(null);
        }}
        order={vm.viewOrder}
        loading={vm.viewLoading}
      />
    </Card>
  );
}