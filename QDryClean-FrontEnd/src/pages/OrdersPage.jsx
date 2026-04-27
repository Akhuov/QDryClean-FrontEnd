"use client";

import { Plus, Trash2, Check, Printer, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardPagination } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import CopyableCell from '../components/CopyableCell';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/Table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/DropdownMenu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/Select';
import OrderStatusBadge from '../components/OrderStatusBadge';
import PaymentStatusBadge from '../components/PaymentStatusBadge';
import OrderFormDialog from '../features/order/ui/OrderFormDialog';
import OrderViewDialog from '../features/order/ui/OrderViewDialog';
import OrdersSearchToolbar from '../features/order/ui/OrdersSearchToolbar';
import { useOrderPage } from '../features/order/model/useOrderPage';
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
} from '../components/ui/AlertDialog';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const ORDER_STATUS_OPTIONS = [
  { value: 'all', label: 'Все' },
  { value: '0', label: 'Черновик' },
  { value: '1', label: 'Создан' },
  { value: '2', label: 'В процессе' },
  { value: '3', label: 'Готов' },
  { value: '4', label: 'Завершен' },
  { value: '5', label: 'Отменен' },
  { value: '6', label: 'Подарен' },
];

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('ru-RU') : '—';

export default function OrdersPage() {
  const vm = useOrderPage();

  function ConfirmAction({ trigger, title, description, onConfirm }) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          {trigger}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={(e) => e.stopPropagation()}
              className="cursor-pointer"
            >
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.stopPropagation();
                onConfirm();
              }}
              className={title.includes('Удалить') ? "hover:bg-red-700 hover:text-white cursor-pointer" : "cursor-pointer"}
            >
              {title.includes('Удалить') ? 'Удалить' : 'Подтвердить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <div className="p-8 space-y-6 bg-slate-50/30 min-h-screen text-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Заказы</h1>
          <p className="text-sm text-slate-500">Создание и управление заказами.</p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-6">
          <CardTitle className="text-lg font-semibold">Список заказов</CardTitle>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center w-full lg:w-auto">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <OrdersSearchToolbar
                searchQuery={vm.searchQuery}
                onSearchChange={vm.handleSearchChange}
                onSearch={vm.handleSearch}
                onClear={vm.handleSearchClear}
                loading={vm.loading}
                error={vm.apiError}
              />

              <Select value={vm.selectedStatus} onValueChange={vm.handleStatusChange}>
                <SelectTrigger className="w-[180px] bg-white border-slate-200">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={String(vm.pageSize)} onValueChange={vm.handlePageSizeChange}>
                <SelectTrigger className="w-[100px] bg-white border-slate-200">
                  <SelectValue placeholder="Размер" />
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

            <OrderFormDialog
              mode={vm.dialogMode}
              open={vm.isModalOpen}
              onOpenChange={vm.handleOrderDialogOpenChange}
              loading={vm.editLoading}
              initialOrder={vm.selectedOrder}
            >
              <Button className="h-10 px-4">
                <Plus className="h-4 w-4" />
                Создать заказ
              </Button>
            </OrderFormDialog>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {vm.loading ? (
            <div className="py-20 text-center text-slate-400 animate-pulse">Загрузка данных...</div>
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
                  <TableHead className="text-right pr-6 text-slate-500 font-medium">Действия</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {vm.orders.map((order) => (
                <TableRow 
                  key={order.id}
                  className="group cursor-pointer hover:bg-slate-100/80 transition-colors border-b border-slate-100 last:border-0 relative"
                  onClick={() => vm.handleViewOrder(order.id)}
                >
                    <TableCell className="pl-6 py-4">
                      <div className="font-semibold text-slate-900">{order.customer?.fullName}</div>
                      <div className="text-xs text-slate-400">{order.customer?.phoneNumber}</div>
                    </TableCell>

                    <TableCell>
                      <CopyableCell value={order.receiptNumber} />
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

                    <TableCell className="text-right font-semibold text-slate-900">
                      {order.totalCost.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">СУМ</span>
                    </TableCell>

                    <TableCell className="text-right pr-6 min-w-[100px]">
                      <div className="flex items-center justify-end gap-2 whitespace-nowrap flex-nowrap" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>

                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 rounded-md">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-[180px] rounded-lg shadow-lg border-slate-200">
                            
                            {order.status === 3 && order.paymentStatus === 2 && <ConfirmAction
                              title="Завершить заказ?"
                              description="Это изменит статус заказа с Готово на Завершено."
                              onConfirm={() => vm.handleCompleteOrder(order.id)}
                              trigger={
                                <DropdownMenuItem 
                                  onSelect={(e) => e.preventDefault()} 
                                  className="text-green-600 focus:bg-green-50 focus:text-green-600 cursor-pointer"
                                >
                                  <Check className="mr-2 size-4" />
                                  <span>Завершить</span>
                                </DropdownMenuItem>
                              }
                            />}

                            <DropdownMenuItem onClick={() => vm.handlePrint(order.id)} className="cursor-pointer">
                              <Printer className="mr-2 size-4 text-slate-400" />
                              <span>Печать</span>
                            </DropdownMenuItem>

                            {order.status < 3 && ( <ConfirmAction
                              title="Удалить заказ?"
                              description="Это действие не может быть отменено."
                              onConfirm={() => vm.handleDeleteOrder(order.id)}
                              trigger={
                                <DropdownMenuItem 
                                  onSelect={(e) => e.preventDefault()} 
                                  className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                                >
                                  <Trash2 className="mr-2 size-4" />
                                  <span>Удалить</span>
                                </DropdownMenuItem>
                              }
                            /> 
                          )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {!vm.loading && vm.orders.length === 0 && (
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
        <CardPagination vm={vm} />
      </Card>

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
        onPaymentSuccess={() => {
          // Обновляем данные после успешной оплаты
          vm.fetchOrders({
            page: vm.page,
            q: vm.appliedSearch,
            pageSize: vm.pageSize,
            status: vm.selectedStatus
          });
        }}
      />
    </div>
  );
}