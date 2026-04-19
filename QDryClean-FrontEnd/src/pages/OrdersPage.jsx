import { Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight, Check, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import StatusBadge from '../components/StatusBadge';
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
} from '../components/ui/alert-dialog';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: '0', label: 'Draft' },
  { value: '1', label: 'Created' },
  { value: '2', label: 'In Progress' },
  { value: '3', label: 'Ready' },
  { value: '4', label: 'Completed' },
  { value: '5', label: 'Canceled' },
  { value: '6', label: 'Donated' },
];

export default function OrdersPage() {
  const vm = useOrderPage();

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Orders</h1>
          <p className="mt-1 text-muted-foreground">Create and manage orders.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <OrdersSearchToolbar
          searchQuery={vm.searchQuery}
          onSearchChange={vm.handleSearchChange}
          onSearch={vm.handleSearch}
          onClear={vm.handleSearchClear}
          loading={vm.loading}
          error={vm.apiError}
        />

        <div className="w-full lg:w-auto">
          <OrderFormDialog
            mode={vm.dialogMode}
            open={vm.isModalOpen}
            onOpenChange={vm.handleOrderDialogOpenChange}
            loading={vm.editLoading}
            initialOrder={vm.selectedOrder}
          >
            <Button
              variant="default"
              className="flex h-10 w-full items-center gap-2 border border-border lg:w-auto"
              onClick={vm.handleCreateOrder}
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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="whitespace-nowrap text-sm text-muted-foreground">
                Status
              </span>

              <Select value={vm.selectedStatus} onValueChange={vm.handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <span className="whitespace-nowrap text-sm text-muted-foreground">
                Table Size
              </span>

              <Select value={String(vm.pageSize)} onValueChange={vm.handlePageSizeChange}>
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
          </div>
        </CardHeader>

        <CardContent>
          {vm.loading ? (
            <div className="py-10 text-center text-muted-foreground">Loading...</div>
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
                {vm.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="text-muted-foreground">
                      {order.customer?.fullName}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {order.customer?.phoneNumber}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {order.receiptNumber}
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
                      {order.itemsCount}
                    </TableCell>

                    <TableCell className="text-center">
                      <StatusBadge status={order.status} />
                    </TableCell>

                    <TableCell className="text-right">{order.totalCost}</TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => vm.handleViewOrder(order.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {order.status === 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            title="Reprint"
                            onClick={() => vm.handleReprint(order.id)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        )}

                        {order.status === 1 && (
                          <Button
                            type="button"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-muted"
                            title="Edit"
                            onClick={() => vm.handleEditOrder(order.id)}
                          >
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )}

                        {order.status === 3 && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                type="button"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-muted"
                                title="Complete"
                                variant="default"
                              >
                                <Check className="h-4 w-4" />
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
                                  onClick={() => vm.handleCompleteOrder(order.id)}
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
                              <Trash2 className="h-4 w-4" />
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
                                onClick={() => vm.handleDeleteOrder(order.id)}
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

                {vm.orders.length === 0 && (
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
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Page {vm.page} of {vm.paged.totalPages} • Total {vm.paged.totalCount}
        </p>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="border-input"
            disabled={!vm.canPrev || vm.loading}
            onClick={() => vm.setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            className="border-primary bg-primary text-primary-foreground"
            disabled
          >
            {vm.page}
          </Button>

          <Button
            size="sm"
            className="border-input"
            disabled={!vm.canNext || vm.loading}
            onClick={() => vm.setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}