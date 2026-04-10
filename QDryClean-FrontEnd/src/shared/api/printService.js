const PRINT_SERVICE_URL =
  import.meta.env.VITE_PRINT_SERVICE_URL;

export async function printReceipt(receiptBase64, printerName = null) {
  if (!receiptBase64) {
    throw new Error('Receipt data is empty');
  }

  const payload = {
    receiptBase64,
    printerName,
  };

  const response = await fetch(`${PRINT_SERVICE_URL}/print`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Printing failed');
  }

  return data;
}