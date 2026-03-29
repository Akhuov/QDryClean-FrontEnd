import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import CustomerCreateForm from './CustomerCreateForm';
import { useCustomerCreateDialog } from '../model/useCustomerCreateDialog';
import { toast } from 'sonner';

export default function CustomerCreateDialog({
  open,
  onOpenChange,
  loading,
  children,
  onSubmit,
  initialPhone = '+998 ',
}) {
  const vm = useCustomerCreateDialog();

  useEffect(() => {
    if (open) {
      vm.setPhone(initialPhone || '+998 ');
    }
  }, [open, initialPhone]);

  const handleCreateCustomer = async () => {
    const payload = vm.buildPayload();
    if (!payload) return;

    const createdCustomer = await onSubmit(payload);

    if (createdCustomer) {
      toast.success('Customer created successfully', {
        description: 'The customer has been saved.',
      });
      vm.resetForm();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          vm.resetForm();
        }

        onOpenChange(isOpen);
      }}
    >
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent
        className="sm:max-w-[640px] bg-white"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-foreground text-[20px] font-semibold">
            Create Customer
          </DialogTitle>
        </DialogHeader>

        <div className="py-2">
          <CustomerCreateForm
            fullName={vm.fullName}
            phone={vm.phone}
            additionalPhone={vm.additionalPhone}
            errors={vm.errors}
            onFullNameChange={vm.handleFullNameChange}
            onPhoneChange={vm.handlePhoneChange}
            onAdditionalPhoneChange={vm.handleAdditionalPhoneChange}
            onCancel={() => {
              vm.resetForm();
              onOpenChange(false);
            }}
            onSave={handleCreateCustomer}
            loading={loading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}