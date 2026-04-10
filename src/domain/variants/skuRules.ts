type SKUContext = {
  productName: string;
  attributes: {
    attributeName: string;
    value: string;
  }[];
  sequence: number;
};

export type SKURule = {
  useProductPrefix?: boolean;
  prefixLength?: number;
  separator?: string;
  includeSequence?: boolean;
  uppercase?: boolean;
};

const defaultRule: SKURule = {
  useProductPrefix: true,
  prefixLength: 3,
  separator: "-",
  includeSequence: true,
  uppercase: true,
};

export function generateSKU(
  ctx: SKUContext,
  rule: SKURule = defaultRule
) {
  let parts: string[] = [];

  // 1. PRODUCT PREFIX
  if (rule.useProductPrefix) {
    const prefix = ctx.productName
      .replace(/\s/g, "")
      .slice(0, rule.prefixLength || 3);

    parts.push(prefix);
  }

  // 2. ATTRIBUTES
  const attrPart = ctx.attributes
    .map(a => a.value.slice(0, 3))
    .join(rule.separator || "-");

  parts.push(attrPart);

  // 3. SEQUENCE
  if (rule.includeSequence) {
    parts.push(String(ctx.sequence).padStart(3, "0"));
  }

  let sku = parts.join(rule.separator || "-");

  return rule.uppercase ? sku.toUpperCase() : sku;
}