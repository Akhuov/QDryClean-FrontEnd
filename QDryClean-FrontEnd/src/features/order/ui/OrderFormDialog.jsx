import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import CustomerCard from './CustomerCard';
import CustomerSearchSection from './CustomerSearchSection';
import NewOrderItemForm from './NewOrderItemForm';
import OrderItemsList from './OrderItemsList';
import OrderSummaryBar from './OrderSummaryBar';
import CustomerCreateDialog from '../../customer/ui/CustomerCreateDialog';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import { Input } from '../../../components/ui/input';
import { createCustomerApi } from '../../customer/api/customerApi';
import { createOrderApi, updateOrderApi } from '../api/orderApi';
import { toast } from 'sonner';
import { useOrderDialog } from '../model/useOrderDialog';
import { formatCurrency } from '../lib/currency';
import { formatPhoneDisplay, getPhoneNumberForRequest } from '../lib/phone';
import { Button } from '../../../components/ui/button';

export default function OrderFormDialog({
  mode = 'create',
  open,
  onOpenChange,
  loading,
  children,
  initialOrder = null,
}) {
  const PAYMENT_STATUS_OPTIONS = [
    { value: '0', label: 'Не оплачено' },
    { value: '1', label: 'Частично' },
    { value: '2', label: 'Оплачено' },
  ];

  const PAYMENT_METHOD_OPTIONS = [
    { value: '1', label: 'Наличные' },
    { value: '2', label: 'Карта' },
    { value: '3', label: 'Click' },
    { value: '4', label: 'Payme' },
    { value: '5', label: 'Uzum' },
    { value: '99', label: 'Другое' },
  ];

  const vm = useOrderDialog();
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const [creatingCustomer, setCreatingCustomer] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  const isEditMode = mode === 'edit';

  const title = isEditMode ? 'Редактировать заказ' : 'Создать заказ';
  const submitText = submitting
    ? (isEditMode ? 'Сохранение...' : 'Создание...')
    : (isEditMode ? 'Сохранить изменения' : 'Создать заказ');

  const dialogDescription = isEditMode
    ? 'Редактировать существующий заказ с деталями, товарами и информацией о клиенте'
    : 'Создать новый заказ с информацией о клиенте и товарами';

  useEffect(() => {
    if (!open) return;

    if (isEditMode) {
      if (initialOrder) {
        vm.resetAllState?.();
        hydrateFormFromOrder(initialOrder);
        setIsNoteOpen(Boolean(initialOrder?.note));
      }
      return;
    }

    vm.resetAllState?.();
    setIsNoteOpen(false);
  }, [open, isEditMode, initialOrder]);

  const hydrateFormFromOrder = (order) => {
    vm.setCustomer?.(order.customer ?? null);
    vm.setPhone?.(order.customer?.phoneNumber ?? '');

    const mappedItems = (order.items || []).map((item) => ({
      id: item.id,
      typeName: item.itemType?.name ?? '',
      title: item.itemType?.name ?? '',
      color: item.colour ?? '',
      brand: item.brandName ?? '',
      defects: item.description ?? '',
      price: item.itemType?.cost ?? 0,
      status: item.status ?? 0,

      itemTypeId: String(item.itemType?.id ?? ''),
      itemTypeName: item.itemType?.name ?? '',
      colour: item.colour ?? '',
      brandName: item.brandName ?? '',
      description: item.description ?? '',

      photos: item.photos ?? [],
      photoPreview: item.photoPreview ?? '',
      isExisting: true,
    }));

    vm.setItems?.(mappedItems);
    vm.setCustomerError?.('');
    vm.setCanCreateCustomer?.(false);
    vm.setNote?.(order.note ?? '');

    if (order.paymentStatus !== undefined && order.paymentStatus !== null) {
      vm.setPaymentStatus?.(order.paymentStatus);
    }

    if (order.paidAmount !== undefined && order.paidAmount !== null) {
      vm.setPaidAmount?.(String(order.paidAmount));
    }
  };

  const buildSubmitPayload = () => {
    const payload = vm.buildPayload?.();
    if (!payload) return null;

    if (isEditMode) {
      return {
        ...payload,
        id: initialOrder?.id,
      };
    }

    return payload;
  };

  const handleCreateSuccess = async (createdOrder) => {
    if (!createdOrder) {
      toast.error('Заказ создан, но ответ сервера пуст');
      return;
    }

    if (!createdOrder.id) {
      toast.warning('Заказ создан, но ID заказа отсутствует');
      vm.resetAllState?.();
      setIsCreateCustomerOpen(false);
      onOpenChange(false);
      return;
    }

    try {
      await vm.handlePrint(createdOrder.id);

      toast.success('Заказ создан успешно');
    } catch (printError) {
      console.error('Print failed:', printError);

      toast.warning('Заказ создан, но печать чека не удалась', {
        description:
          printError?.response?.data?.message ||
          printError?.message ||
          'Служба печати недоступна',
      });
    }

    vm.resetAllState?.();
    setIsCreateCustomerOpen(false);
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    const payload = buildSubmitPayload();
    if (!payload || submitting) return;

    try {
      setSubmitting(true);

      if (isEditMode) {
        const data = await updateOrderApi(payload.id, payload);

        if (data.code !== 0) {
          toast.error(data.message || 'Operation failed');
          return;
        }

        toast.success('Заказ успешно обновлен', {
          description: 'Заказ был успешно обновлен.',
        });

        vm.resetAllState?.();
        setIsCreateCustomerOpen(false);
        onOpenChange(false);
        return;
      }

      const data = await createOrderApi(payload);

      if (data.code !== 0) {
        toast.error(data.message || 'Operation failed');
        return;
      }

      await handleCreateSuccess(data.response);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Unexpected error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCustomer = async (payload) => {
    try {
      setCreatingCustomer(true);

      const data = await createCustomerApi(payload);

      if (data.code === 0) {
        vm.setCustomer(data.response);
        vm.setCustomerError('');
        vm.setCanCreateCustomer(false);
        setIsCreateCustomerOpen(false);
        return data.response;
      }

      throw new Error(data.message || 'Ошибка создания клиента');
    } finally {
      setCreatingCustomer(false);
    }
  };

  const isSearchDisabled = useMemo(() => {
    if (isEditMode) return true;
    return getPhoneNumberForRequest(vm.phone).length !== 9;
  }, [isEditMode, vm.phone]);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            vm.resetAllState?.();
            setIsCreateCustomerOpen(false);
            setIsNoteOpen(false);
          }

          onOpenChange(isOpen);
        }}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent
          className="sm:max-w-[920px] bg-white max-h-[85vh] overflow-hidden"
          onInteractOutside={(e) => e.preventDefault()}
          aria-describedby={dialogDescription ? 'dialog-description' : undefined}
        >
          <DialogHeader>
            <DialogTitle className="text-foreground text-[20px] font-semibold">
              {title}
            </DialogTitle>
            {dialogDescription && (
              <p id="dialog-description" className="sr-only">
                {dialogDescription}
              </p>
            )}
          </DialogHeader>

          <div className="max-h-[calc(85vh-96px)] overflow-y-auto pr-2 space-y-6 py-2">
            {!isEditMode && (
              <CustomerSearchSection
                phone={vm.phone}
                searchingCustomer={vm.searchingCustomer}
                customerError={vm.customerError}
                onPhoneChange={vm.handlePhoneChange}
                onSearch={vm.handleSearchCustomer}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    vm.handleSearchCustomer();
                  }
                }}
                isSearchDisabled={isSearchDisabled}
                canCreateCustomer={vm.canCreateCustomer}
                onOpenCreateCustomer={() => setIsCreateCustomerOpen(true)}
              />
            )}

            {vm.customer && (
              <>
                <div className="space-y-2">
                  <CustomerCard
                    customer={vm.customer}
                    formatPhoneDisplay={formatPhoneDisplay}
                  />

                  {vm.orderErrors?.customer && (
                    <p className="text-sm text-red-500">
                      {vm.orderErrors.customer}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <OrderItemsList
                    items={vm.items}
                    onDeleteItem={vm.handleDeleteItem}
                    onStartAddItem={vm.handleStartAddItem}
                    isAddingItem={vm.isAddingItem}
                    itemsEndRef={vm.itemsEndRef}
                    formatCurrency={formatCurrency}
                  >
                    <NewOrderItemForm
                      newItem={vm.newItem}
                      setNewItem={vm.setNewItem}
                      itemTypes={vm.itemTypes}
                      itemTypesLoading={vm.itemTypesLoading}
                      itemTypesError={vm.itemTypesError}
                      newItemPrice={vm.newItemPrice}
                      fileInputRef={vm.fileInputRef}
                      onPhotoChange={vm.handlePhotoChange}
                      onRemovePhoto={vm.handleRemovePhoto}
                      onCancel={vm.handleCancelAddItem}
                      onSave={vm.handleSaveItem}
                      formatCurrency={formatCurrency}
                      errors={vm.itemErrors}
                    />
                  </OrderItemsList>

                  {vm.orderErrors?.items && (
                    <p className="text-sm text-red-500">
                      {vm.orderErrors.items}
                    </p>
                  )}

                  {vm.orderErrors?.newItem && (
                    <p className="text-sm text-red-500">
                      {vm.orderErrors.newItem}
                    </p>
                  )}
                </div>

                <div className="space-y-4 rounded-2xl border border-border bg-muted/30 p-4">
                  {vm.shouldShowPaymentStatus && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">
                          Payment Status *
                        </Label>

                        <Select
                          value={vm.paymentStatus !== null ? String(vm.paymentStatus) : undefined}
                          onValueChange={(value) => vm.setPaymentStatus(Number(value))}
                          disabled={submitting}
                        >
                          <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-white data-[placeholder]:text-slate-400">
                            <SelectValue placeholder="Select payment status" />
                          </SelectTrigger>

                          <SelectContent className="rounded-2xl border border-slate-200 bg-white shadow-xl">
                            {PAYMENT_STATUS_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="
                                  rounded-xl px-3 py-2
                                  transition-all duration-150
                                  hover:bg-blue-50
                                  hover:text-blue-700
                                  cursor-pointer
                                  focus:bg-blue-50
                                  focus:text-blue-700
                                  data-[state=checked]:bg-blue-50
                                  data-[state=checked]:text-blue-700
                                "
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {vm.orderErrors?.paymentStatus && (
                          <p className="text-sm text-red-500">
                            {vm.orderErrors.paymentStatus}
                          </p>
                        )}
                      </div>

                      {vm.shouldShowPaidAmount && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">
                            Сумма оплаты *
                          </Label>

                          <div className="relative">
                            <Input
                              type="text"
                              inputMode="numeric"
                              value={vm.paidAmount}
                              onChange={(e) => {
                                const onlyDigits = e.target.value.replace(/\D/g, '');
                                vm.setPaidAmount(onlyDigits);
                              }}
                              disabled={submitting}
                              placeholder="Enter amount"
                              className="
                                h-9 rounded-xl border-slate-200 bg-white
                                px-4 pr-12 text-sm text-slate-700
                                transition-all duration-200
                                placeholder:text-slate-400
                                hover:border-slate-300
                                focus-visible:ring-0 focus-visible:ring-offset-0
                              "
                            />

                            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                              UZS
                            </span>
                          </div>

                          {vm.orderErrors?.paidAmount && (
                            <p className="text-sm text-red-500">
                              {vm.orderErrors.paidAmount}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-3">
                    {!isNoteOpen ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        type="button"
                        onClick={() => setIsNoteOpen(true)}
                        disabled={submitting}
                        className="
                          h-8 px-3 text-sm
                          bg-transparent border border-dashed border-slate-300
                          text-slate-600
                          hover:bg-blue-50
                          hover:border-blue-300
                          hover:text-blue-700
                          transition-all duration-200
                        "
                      >
                        + Добавить заметку
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Заметки</Label>

                          {!vm.note?.trim() && (
                            <Button
                              variant="secondary"
                              size="sm"
                              type="button"
                              className="
                                h-7 px-2 text-xs
                                bg-transparent border-none shadow-none
                                text-muted-foreground
                                hover:bg-slate-100
                                hover:text-foreground
                                active:scale-[0.98]
                              "
                              onClick={() => setIsNoteOpen(false)}
                              disabled={submitting}
                            >
                              Скрыть
                            </Button>
                          )}
                        </div>

                        <Textarea
                          value={vm.note}
                          onChange={(e) => vm.setNote(e.target.value)}
                          disabled={submitting}
                          placeholder="Дополнительные заметки для этого заказа"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <OrderSummaryBar
                  total={vm.total}
                  loading={loading || submitting}
                  onCreateOrder={handleSubmit}
                  actionText={submitText}
                  formatCurrency={formatCurrency}
                  disabled={vm.isSaveDisabled || submitting}
                />
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {!isEditMode && (
        <CustomerCreateDialog
          open={isCreateCustomerOpen}
          onOpenChange={setIsCreateCustomerOpen}
          loading={creatingCustomer}
          initialPhone={vm.phone}
          onSubmit={handleCreateCustomer}
        />
      )}
    </>
  );
}