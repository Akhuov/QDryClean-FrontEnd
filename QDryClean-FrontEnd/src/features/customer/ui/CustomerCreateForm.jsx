import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

export default function CustomerCreateForm({
  fullName,
  phone,
  additionalPhone,
  errors,
  onFullNameChange,
  onPhoneChange,
  onAdditionalPhoneChange,
  onCancel,
  onSave,
  loading,
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          placeholder="Customer"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
        />
        {errors.fullName && (
          <p className="text-sm text-red-500">{errors.fullName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          placeholder="+998 99 999 99 99"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalPhoneNumber">Additional Phone Number</Label>
        <Input
          id="additionalPhoneNumber"
          placeholder="+998 99 999 99 99"
          value={additionalPhone}
          onChange={(e) => onAdditionalPhoneChange(e.target.value)}
        />
        {errors.additionalPhone && (
          <p className="text-sm text-red-500">{errors.additionalPhone}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          type="button"
          onClick={onSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Customer'}
        </Button>
      </div>
    </div>
  );
}