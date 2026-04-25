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
  errors = {},
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
            value={newItem.type ?? ''}
            onValueChange={(value) =>
              setNewItem((prev) => ({ ...prev, type: value }))
            }
            disabled={itemTypesLoading || itemTypes.length === 0}
          >
            <SelectTrigger className="bg-input-background border-input w-full">
              <SelectValue
                placeholder={itemTypesLoading ? 'Загрузка типов...' : 'Выберите тип'}
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

          {errors.type && (
            <p className="text-sm text-destructive">{errors.type}</p>
          )}

          {itemTypesError && (
            <p className="text-sm text-destructive">{itemTypesError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Цена</Label>
          <Input
            value={formatCurrency(newItemPrice)}
            readOnly
            className="bg-muted border-input w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="colour">Цвет</Label>
          <Input
            id="colour"
            value={newItem.colour ?? ''}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, colour: e.target.value }))
            }
            placeholder="Бежевый"
            className="bg-input-background border-input w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brandName">Бренд</Label>
          <Input
            id="brandName"
            value={newItem.brandName ?? ''}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, brandName: e.target.value }))
            }
            placeholder="Бренд"
            className="bg-input-background border-input w-full"
          />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Label htmlFor="description">Описание / Примечания</Label>
        <Textarea
          id="description"
          value={newItem.description ?? ''}
          onChange={(e) =>
            setNewItem((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Пятно на кармане, потертость..."
          className="bg-input-background border-input w-full"
          rows={4}
        />

        {errors.details && (
          <p className="text-sm text-red-500">{errors.details}</p>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <Label>Фото</Label>

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
              alt="Предпросмотр"
              className="h-28 w-28 rounded-lg border object-cover"
            />
            <Button type="button" variant="outline" onClick={onRemovePhoto}>
              Удалить фото
            </Button>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="button" onClick={onSave}>
          Сохранить
        </Button>
      </div>
    </div>
  );
}