import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/Select";
import { toast } from "sonner";
import { createPaymentApi } from "../api/orderApi";

const PAYMENT_METHODS = [
  { value: 1, label: "Наличные" },
  { value: 2, label: "Карта" },
  { value: 99, label: "Перевод" },
];

export default function PaymentDialog({
  open,
  onOpenChange,
  orderId,
  maxAmount = 0,
  onSuccess,
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(1);
  const [loading, setLoading] = useState(false);

  const numAmount = Number(amount || 0);

  const isInvalid = numAmount <= 0 || numAmount > maxAmount;

  useEffect(() => {
    if (!open) {
      setAmount("");
      setMethod(1);
      setLoading(false);
    }
  }, [open]);

  const quickActions = useMemo(() => {
    return [
      {
        label: "50%",
        value: Math.round(maxAmount / 2),
      },
      {
        label: "Всё",
        value: maxAmount,
      },
    ];
  }, [maxAmount]);

  const handleSubmit = async () => {
    if (isInvalid || loading) return;

    setLoading(true);

    try {
      const data = await createPaymentApi(orderId, {
        amount: numAmount,
        paymentMethod: method,
      });

      if (data.code !== 0) {
        toast.error(data.message || 'Ошибка оплаты');
        return;
      }

      toast.success('Оплата прошла успешно');
      onSuccess?.();
      onOpenChange(false);
    } catch (e) {
      toast.error("Ошибка оплаты: " + (e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Оплата задолженности</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">

          {/* INFO CARD */}
          <div className="rounded-lg border bg-slate-50 p-3 text-sm text-slate-600">
            Максимальная сумма оплаты:{" "}
            <span className="font-semibold text-slate-900">
              {maxAmount}
            </span>
          </div>

          {/* AMOUNT */}
          <div className="space-y-2">
            <Label>Сумма оплаты</Label>

            <Input
              autoFocus
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Введите сумму"
              className={isInvalid && amount ? "border-red-400" : ""}
            />

            {isInvalid && amount && (
              <p className="text-xs text-red-500">
                Сумма должна быть от 1 до {maxAmount}
              </p>
            )}
          </div>

          {/* QUICK ACTIONS */}
          <div className="flex gap-2">
            {quickActions.map((q) => (
              <Button
                key={q.label}
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setAmount(q.value)}
                disabled={maxAmount === 0}
              >
                {q.label}
              </Button>
            ))}
          </div>

          {/* PAYMENT METHOD */}
          <div className="space-y-2">
            <Label>Метод оплаты</Label>

            <Select
              value={method.toString()}
              onValueChange={(v) => setMethod(Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите метод" />
              </SelectTrigger>

              <SelectContent>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m.value} value={m.value.toString()}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Отмена
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={loading || isInvalid}
            >
              {loading ? "Обработка..." : "Оплатить"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}