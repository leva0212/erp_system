// domain/attribute.ts
export type Attribute = {
  id: number;
  name: string;
};

export type AttributeValue = {
  id: number;
  attribute_id: number;
  value: string;
};