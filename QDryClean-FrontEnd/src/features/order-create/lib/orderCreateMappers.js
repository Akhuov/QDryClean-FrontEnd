export function mapNewItemToOrderItem(newItem, selectedItemType) {
  return {
    id: Date.now(),
    type: String(selectedItemType.id),
    typeId: selectedItemType.id,
    typeName: selectedItemType.name,
    title: `${newItem.brand || 'New'} ${selectedItemType.name}`,
    color: newItem.color || 'Не указан',
    brand: newItem.brand || 'Не указан',
    defects: newItem.defects || 'Нет заметок',
    price: selectedItemType.cost ?? 0,
    photoFile: newItem.photoFile,
    photoPreview: newItem.photoPreview,
  };
}

export function buildCreateOrderPayload(customer, items) {
  return {
    customerId: customer.id,
    items: items.map((item) => ({
      itemTypeId: item.typeId,
      colour: item.color,
      brandName: item.brand,
      description: item.defects,
    })),
  };
}