import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import CustomerCard from './CustomerCard';
import CustomerSearchSection from './CustomerSearchSection';
import NewOrderItemForm from './NewOrderItemForm';
import OrderItemsList from './OrderItemsList';
import OrderSummaryBar from './OrderSummaryBar';
import CustomerCreateDialog from '../../customer-create/ui/CustomerCreateDialog';
import { createCustomerApi } from '../../customer-create/api/customerApi';
import { createOrderApi } from '../api/orderApi';
import { toast } from 'sonner';

import { useOrderCreateDialog } from '../model/useOrderCreateDialog';
import { formatCurrency } from '../lib/currency';
import {
  formatPhoneDisplay,
  getPhoneNumberForRequest,
} from '../lib/phone';

export default function OrderFormDialog({
  open,
  onOpenChange,
  loading,
  children,
}) {
  const vm = useOrderCreateDialog();
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const [creatingCustomer, setCreatingCustomer] = useState(false);

  const handleCreateOrder = async () => {
    const payload = vm.buildPayload();
    if (!payload) return;

    try {
      console.log('Create order payload:', payload);

      const data = await createOrderApi(payload);

      if (data.code === 0) {
        console.log('Order created successfully');
        toast.success('Order created successfully', {
          description: 'The order has been saved.',
        });
        // 👉 сброс формы после успеха
        vm.resetAllState?.();
        onOpenChange(false);

        return;
      }

      console.error('Create order error:', data.message);
    } catch (error) {
      console.error(
        'Create order failed:',
        error.response?.data?.message || error.message
      );
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

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            vm.resetAllState();
            setIsCreateCustomerOpen(false);
          }

          onOpenChange(isOpen);
        }}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent
          className="sm:max-w-[920px] bg-white"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-foreground text-[20px] font-semibold">
              Create Order
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-2">
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
              isSearchDisabled={getPhoneNumberForRequest(vm.phone).length !== 9}
              canCreateCustomer={vm.canCreateCustomer}
              onOpenCreateCustomer={() => setIsCreateCustomerOpen(true)}
            />

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
                  loading={loading}
                  onCreateOrder={handleCreateOrder}
                  formatCurrency={formatCurrency}
                />
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <CustomerCreateDialog
        open={isCreateCustomerOpen}
        onOpenChange={setIsCreateCustomerOpen}
        loading={creatingCustomer}
        initialPhone={vm.phone}
        onSubmit={handleCreateCustomer}
      />
    </>
  );
}