import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Search, Trash2, Upload, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

const ITEM_TYPE_PRICES = {
  coat: 150000,
  suit: 180000,
  jacket: 120000,
  blanket: 90000,
};

const ITEM_TYPE_LABELS = {
  coat: 'Пальто',
  suit: 'Костюм',
  jacket: 'Куртка',
  blanket: 'Плед',
};

const EXISTING_ITEMS = [
  {
    id: 1,
    type: 'coat',
    title: 'Burberry beige coat',
    color: 'Бежевый',
    brand: 'Burberry',
    defects: 'Пятно на кармане',
    price: 150000,
    photoFile: null,
    photoPreview: '',
  },
  {
    id: 2,
    type: 'suit',
    title: 'Zara green suit',
    color: 'Зелёный',
    brand: 'Zara',
    defects: 'Потертости на рукавах',
    price: 180000,
    photoFile: null,
    photoPreview: '',
  },
];

const EMPTY_NEW_ITEM = {
  type: 'coat',
  color: '',
  brand: '',
  defects: '',
  photoFile: null,
  photoPreview: '',
};

function formatCurrency(value) {
  return new Intl.NumberFormat('ru-RU').format(value) + ' UZS';
}

function OrderItemCard({ item, onDelete }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">
            Тип: {ITEM_TYPE_LABELS[item.type]}
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">{item.title}</p>
          <p className="mt-2 text-sm text-muted-foreground">Цвет: {item.color}</p>
          <p className="text-sm text-muted-foreground">Бренд: {item.brand}</p>
          <p className="text-sm text-muted-foreground">Дефекты: {item.defects}</p>

          {item.photoPreview && (
            <img
              src={item.photoPreview}
              alt={item.title}
              className="mt-3 h-20 w-20 rounded-md border object-cover"
            />
          )}
        </div>

        <div className="flex items-start gap-3 shrink-0">
          <div className="text-right">
            <p className="text-xl font-semibold text-foreground">
              {formatCurrency(item.price)}
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-white opacity-100">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete item?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure? Entered data for this item will be removed.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

export default function OrderFormDialog({
  open,
  onOpenChange,
  loading,
  children,
}) {
  const [phone, setPhone] = useState('');
  const [items, setItems] = useState(EXISTING_ITEMS);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState(EMPTY_NEW_ITEM);

  const itemsEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const newItemPrice = ITEM_TYPE_PRICES[newItem.type] ?? 0;

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price, 0) + (isAddingItem ? newItemPrice : 0);
  }, [items, isAddingItem, newItemPrice]);

  const handleStartAddItem = () => {
    setNewItem({
      ...EMPTY_NEW_ITEM,
      type: 'coat',
    });
    setIsAddingItem(true);
  };

  const handleCancelAddItem = () => {
    if (newItem.photoPreview) {
      URL.revokeObjectURL(newItem.photoPreview);
    }

    setNewItem(EMPTY_NEW_ITEM);
    setIsAddingItem(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveItem = () => {
    const createdItem = {
      id: Date.now(),
      type: newItem.type,
      title: `${newItem.brand || 'New'} ${ITEM_TYPE_LABELS[newItem.type].toLowerCase()}`,
      color: newItem.color || 'Не указан',
      brand: newItem.brand || 'Не указан',
      defects: newItem.defects || 'Нет заметок',
      price: newItemPrice,
      photoFile: newItem.photoFile,
      photoPreview: newItem.photoPreview,
    };

    setItems((prev) => [...prev, createdItem]);
    setNewItem(EMPTY_NEW_ITEM);
    setIsAddingItem(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreateOrder = () => {
    const payload = {
      phone,
      items,
    };

    console.log('Create order payload:', payload);
  };

  const handleDeleteItem = (itemId) => {
    setItems((prev) => {
      const itemToDelete = prev.find((item) => item.id === itemId);

      if (itemToDelete?.photoPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(itemToDelete.photoPreview);
      }

      return prev.filter((item) => item.id !== itemId);
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (newItem.photoPreview) {
      URL.revokeObjectURL(newItem.photoPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setNewItem((prev) => ({
      ...prev,
      photoFile: file,
      photoPreview: previewUrl,
    }));
  };

  const handleRemovePhoto = () => {
    if (newItem.photoPreview) {
      URL.revokeObjectURL(newItem.photoPreview);
    }

    setNewItem((prev) => ({
      ...prev,
      photoFile: null,
      photoPreview: '',
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    itemsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [items, isAddingItem]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[920px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-foreground text-[20px] font-semibold">
            Add New Order
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-input-background border-input w-full pl-10"
                  placeholder="Enter phone number"
                />
              </div>

              <Button type="button">Search</Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background border">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>

                <div>
                  <p className="text-lg font-semibold text-foreground">Sardorbek Asadov</p>
                  <p className="text-sm text-muted-foreground">+998 91 123-11-11</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">Customer</p>
            </div>
          </div>

          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
            {items.map((item) => (
              <OrderItemCard
                key={item.id}
                item={item}
                onDelete={handleDeleteItem}
              />
            ))}

            {!isAddingItem ? (
              <button
                type="button"
                onClick={handleStartAddItem}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-background px-4 py-4 text-base font-medium text-primary transition hover:bg-accent"
              >
                <Plus className="h-5 w-5" />
                Add New Item
              </button>
            ) : (
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
                    >
                      <SelectTrigger className="bg-input-background border-input w-full">
                        <SelectValue placeholder="Select item type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coat">Пальто</SelectItem>
                        <SelectItem value="suit">Костюм</SelectItem>
                        <SelectItem value="jacket">Куртка</SelectItem>
                        <SelectItem value="blanket">Плед</SelectItem>
                      </SelectContent>
                    </Select>
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
                    onChange={handlePhotoChange}
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
                      <Button type="button" variant="outline" onClick={handleRemovePhoto}>
                        Remove photo
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={handleCancelAddItem}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleSaveItem}>
                    Save Item
                  </Button>
                </div>
              </div>
            )}

            <div ref={itemsEndRef} />
          </div>

          <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-2xl font-semibold text-foreground">
              Total: {formatCurrency(total)}
            </p>

            <Button onClick={handleCreateOrder} disabled={loading} className="min-w-[180px]">
              {loading ? 'Creating...' : 'Create Order'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}