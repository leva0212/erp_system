export function generateSKU(
  product: any,
  attributes: any[],
  sequence?: number
) {
  const productCode = product.name
    .replace(/\s/g, "")
    .substring(0, 3)
    .toUpperCase();

  const attrCode = attributes
    .map(a => a.value.substring(0, 3).toUpperCase())
    .join("-");

  const seq = sequence ? sequence.toString().padStart(3, "0") : "";

  return `${productCode}-${attrCode}-${seq}`;
}