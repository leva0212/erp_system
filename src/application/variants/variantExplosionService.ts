export function calculateVariantExplosion(attributes: {
  values: any[];
}[]) {
  return attributes.reduce((acc, attr) => {
    return acc * (attr.values?.length || 1);
  }, 1);
}

export function validateVariantExplosion(
  attributes: { values: any[] }[],
  limit = 500
) {
  const total = calculateVariantExplosion(attributes);

  return {
    total,
    safe: total <= limit,
    warning: total > limit,
  };
}