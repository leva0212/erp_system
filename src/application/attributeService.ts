import { supabase } from "../infrastructure/supabaseClient";
import { Attribute, AttributeValue } from "../domain/attribute";

// =====================================
// ATRIBUTOS
// =====================================

// Obtener todos los atributos
export async function getAttributes(): Promise<Attribute[]> {
  const { data, error } = await supabase
    .from("attributes")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);

  return (data as Attribute[]) ?? [];
}

// Crear atributo
export async function createAttribute(name: string): Promise<Attribute> {
  const { data, error } = await supabase
    .from("attributes")
    .insert([{ name }])
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return data as Attribute;
}

// =====================================
// VALORES DE ATRIBUTOS
// =====================================

// Obtener valores de un atributo
export async function getAttributeValues(
  attributeId: number
): Promise<AttributeValue[]> {
  const { data, error } = await supabase
    .from("attribute_values")
    .select("*")
    .eq("attribute_id", attributeId)
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);

  return (data as AttributeValue[]) ?? [];
}

// Crear valor de atributo
export async function createAttributeValue(
  attributeId: number,
  value: string
): Promise<AttributeValue> {
  const { data, error } = await supabase
    .from("attribute_values")
    .insert([
      {
        attribute_id: attributeId,
        value,
      },
    ])
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return data as AttributeValue;
}

export type AttributeWithValues = Attribute & {
  values: AttributeValue[];
};

// =====================================
// ATRIBUTOS + VALORES (UI READY)
// =====================================

export async function getAttributesWithValues(): Promise<AttributeWithValues[]> {
  const attributes = await getAttributes();

  const result: AttributeWithValues[] = await Promise.all(
    attributes.map(async (attr) => {
      const values = await getAttributeValues(attr.id);

      return {
        ...attr,
        values,
      };
    })
  );

  return result;
}