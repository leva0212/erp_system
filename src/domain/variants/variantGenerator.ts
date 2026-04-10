export function generateVariants(attributes: any[]) {
  const combinations = attributes.reduce((acc, attr) => {
    const result: any[] = [];

    acc.forEach((prev: any[]) => {
      attr.values.forEach((val: any) => {
        result.push([
          ...prev,
          {
            attributeId: attr.attributeId,
            attributeValueId: val.id,
            value: val.value,
          },
        ]);
      });
    });

    return result;
  }, [[]]);

  return combinations.map((combo: any[]) => ({
    name: combo.map((c) => c.value).join(" - "),

    raw: combo,

    attributes: combo.map((c) => ({
      attributeId: c.attributeId,
      attributeValueId: c.attributeValueId,
      value: c.value,
    })),
  }));
}