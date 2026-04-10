// src/types.ts
//export type AttributeValue = { id: number; name: string; value: string };

import { AttributeValue } from "./attribute";

export type Product = {
  id: number;
  name: string;
  description?: string;
  active: boolean;
  variants: Variant[]; // siempre array
};

export type Variant = {
  id: number;
  product_id?: number;
  sku: string;
  price: number;
  active: boolean;
  attribute_values?:AttributeValue[];
};