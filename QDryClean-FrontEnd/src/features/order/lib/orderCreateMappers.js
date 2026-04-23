export function mapNewItemToOrderItem(newItem, selectedItemType) {
  return {
    id: Date.now(),
    status: 0,

    type: String(selectedItemType.id),
    itemTypeId: String(selectedItemType.id),
    itemTypeName: selectedItemType.name,
    typeName: selectedItemType.name,
    title: selectedItemType.name,

    colour: newItem.colour?.trim() ?? '',
    brandName: newItem.brandName?.trim() ?? '',
    description: newItem.description?.trim() ?? '',

    price: selectedItemType.cost ?? 0,

    photoFile: newItem.photoFile ?? null,
    photoPreview: newItem.photoPreview ?? '',
    photos: [],
  };
}

export function buildCreateOrderPayload(customer, items, extra = {}) {
  return {
    customerId: customer.id,
    note: extra.note ?? '',
    items: items.map((item) => ({
      itemTypeId: Number(item.itemTypeId),
      colour: item.colour ?? '',
      brandName: item.brandName ?? '',
      description: item.description ?? '',
      status: item.status ?? 0,
    })),
    payment: {
      amount: extra.amount ?? 0,
      paymentMethod: extra.paymentMethod ?? 1,
    },
    paymentStatus: extra.paymentStatus ?? 0,
  };
}