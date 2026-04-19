import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import CustomerCard from './CustomerCard';
import CustomerSearchSection from './CustomerSearchSection';
import NewOrderItemForm from './NewOrderItemForm';
import OrderItemsList from './OrderItemsList';
import OrderSummaryBar from './OrderSummaryBar';
import CustomerCreateDialog from '../../customer/ui/CustomerCreateDialog';

import { createCustomerApi } from '../../customer/api/customerApi';
import { createOrderApi, updateOrderApi } from '../api/orderApi';
import { printReceipt } from '../../../shared/api/printService';
import { toast } from 'sonner';

import { useOrderDialog } from '../model/useOrderDialog';
import { formatCurrency } from '../lib/currency';
import { formatPhoneDisplay, getPhoneNumberForRequest } from '../lib/phone';

export default function OrderFormDialog({
  mode = 'create',
  open,
  onOpenChange,
  loading,
  children,
  initialOrder = null,
}) {
  const vm = useOrderDialog();
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const [creatingCustomer, setCreatingCustomer] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = mode === 'edit';

  const title = isEditMode ? 'Edit Order' : 'Create Order';
  const submitText = submitting
    ? (isEditMode ? 'Saving...' : 'Creating...')
    : (isEditMode ? 'Save Changes' : 'Create Order');

  const dialogDescription = isEditMode
    ? 'Edit existing order details, items, and customer information'
    : 'Create new order with customer details and items';

  useEffect(() => {
    if (!open) return;

    if (isEditMode) {
      if (initialOrder) {
        vm.resetAllState?.();
        hydrateFormFromOrder(initialOrder);
      }
      return;
    }

    vm.resetAllState?.();
  }, [open, isEditMode, initialOrder]);

  const hydrateFormFromOrder = (order) => {
    vm.setCustomer?.(order.customer ?? null);
    vm.setPhone?.(order.customer?.phoneNumber ?? '');

    const mappedItems = (order.items || []).map((item) => ({
      id: item.id,

      // для карточки
      typeName: item.itemType?.name ?? '',
      title: item.itemType?.name ?? '',
      color: item.colour ?? '',
      brand: item.brandName ?? '',
      defects: item.description ?? '',
      price: item.itemType?.cost ?? 0,
      status: item.status ?? 0,

      // для формы / payload
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
      toast.error('Order created, but response payload is empty');
      return;
    }

    if (!createdOrder.receiptBase64) {
      toast.warning('Order created, but receipt data is missing');
      vm.resetAllState?.();
      setIsCreateCustomerOpen(false);
      onOpenChange(false);
      return;
    }

    try {
      await printReceipt(createdOrder.receiptBase64);

      toast.success('Order created successfully', {
        description: 'Receipt printed successfully.',
      });
    } catch (printError) {
      console.error('Print failed:', printError);

      toast.warning('Order created, but receipt printing failed', {
        description:
          printError?.response?.data?.message ||
          printError?.message ||
          'Print service is unavailable',
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

        toast.success('Order updated successfully', {
          description: 'The order has been updated.',
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
          }

          onOpenChange(isOpen);
        }}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent
          className="sm:max-w-[920px] bg-white"
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

          <div className="space-y-6 py-2">
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
                <CustomerCard
                  customer={vm.customer}
                  formatPhoneDisplay={formatPhoneDisplay}
                />

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
                  />
                </OrderItemsList>

                <OrderSummaryBar
                  total={vm.total}
                  loading={loading || submitting}
                  onCreateOrder={handleSubmit}
                  actionText={submitText}
                  formatCurrency={formatCurrency}
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