import { Upload } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';

export default function NewOrderItemForm({
  newItem,
  setNewItem,
  itemTypes,
  itemTypesLoading,
  itemTypesError,
  newItemPrice,
  fileInputRef,
  onPhotoChange,
  onRemovePhoto,
  onCancel,
  onSave,
  formatCurrency,
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">New Item</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Item Type</Label>
          <Select
            value={newItem.type}
            onValueChange={(value) =>
              setNewItem((prev) => ({ ...prev, type: value }))
            }
            disabled={itemTypesLoading || itemTypes.length === 0}
          >
            <SelectTrigger className="bg-input-background border-input w-full">
              <SelectValue
                placeholder={itemTypesLoading ? 'Loading item types...' : 'Select item type'}
              />
            </SelectTrigger>

            <SelectContent>
              {itemTypes.map((itemType) => (
                <SelectItem key={itemType.id} value={String(itemType.id)}>
                  {itemType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {itemTypesError && (
            <p className="text-sm text-destructive">{itemTypesError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Price</Label>
          <Input
            value={formatCurrency(newItemPrice)}
            readOnly
            className="bg-muted border-input w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            value={newItem.color}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, color: e.target.value }))
            }
            placeholder="Бежевый"
            className="bg-input-background border-input w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={newItem.brand}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, brand: e.target.value }))
            }
            placeholder="Burberry"
            className="bg-input-background border-input w-full"
          />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Label htmlFor="defects">Defects / Notes</Label>
        <Textarea
          id="defects"
          value={newItem.defects}
          onChange={(e) =>
            setNewItem((prev) => ({ ...prev, defects: e.target.value }))
          }
          placeholder="Пятно на кармане, потертость..."
          className="bg-input-background border-input w-full"
          rows={4}
        />
      </div>

      <div className="mt-4 space-y-2">
        <Label>Photo</Label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPhotoChange}
        />

        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          Upload photo
        </Button>

        {newItem.photoPreview && (
          <div className="mt-3 flex items-center gap-3">
            <img
              src={newItem.photoPreview}
              alt="Preview"
              className="h-28 w-28 rounded-lg border object-cover"
            />
            <Button type="button" variant="outline" onClick={onRemovePhoto}>
              Remove photo
            </Button>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onSave}>
          Save Item
        </Button>
      </div>
    </div>
  );
}