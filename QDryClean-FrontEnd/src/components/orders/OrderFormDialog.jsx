import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

export default function OrderFormDialog({ open, onOpenChange, order, onChange, onSubmit, loading, children }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[680px] bg-white opacity-100">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer ID *</Label>
              <Input
                id="customerId"
                placeholder="1"
                value={order.customerId}
                onChange={(e) => onChange({ ...order, customerId: e.target.value })}
                className="bg-input-background border-input w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receiptNumber">Receipt Number *</Label>
              <Input
                id="receiptNumber"
                placeholder="1"
                value={order.receiptNumber}
                onChange={(e) => onChange({ ...order, receiptNumber: e.target.value })}
                className="bg-input-background border-input w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Process Status</Label>
              <Select
                value={String(order.processStatus)}
                onValueChange={(v) => onChange({ ...order, processStatus: Number(v) })}
              >
                <SelectTrigger className="bg-input-background border-input w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">New</SelectItem>
                  <SelectItem value="1">In Progress</SelectItem>
                  <SelectItem value="2">Ready</SelectItem>
                  <SelectItem value="3">Completed</SelectItem>
                  <SelectItem value="4">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedCompletionDate">Expected Completion Date</Label>
              <Input
                id="expectedCompletionDate"
                type="date"
                value={order.expectedCompletionDate}
                onChange={(e) => onChange({ ...order, expectedCompletionDate: e.target.value })}
                className="bg-input-background border-input w-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (one per line)</Label>
            <Textarea
              id="notes"
              placeholder={'Test 1\nTest 2'}
              value={order.notesText}
              onChange={(e) => onChange({ ...order, notesText: e.target.value })}
              className="bg-input-background border-input w-full"
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={loading}>
              {loading ? 'Creating...' : 'Create Order'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
