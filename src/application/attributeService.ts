import { supabase } from "../infrastructure/supabaseClient";
import { Attribute, AttributeValue } from "../domain/attribute";

// =====================================
// ATRIBUTOS
// =====================================

// Obtener todos los atributos
export async function getAttributes(): Promise<Attribute[]> {
  const { data, error } = await supabase.from("attributes").select("*").order("id");
  if (error) throw error;
  return data || [];
}

// Crear un atributo nuevo
export async function createAttribute(name: string): Promise<Attribute> {
  const { data, error } = await supabase
    .from("attributes")
    .insert([{ name }])
    .select("*")
    .single();
  if (error) throw error;
  return data as Attribute;
}

// =====================================
// VALORES DE ATRIBUTOS
// =====================================

// Obtener valores de un atributo específico
export async function getAttributeValues(attributeId: number): Promise<AttributeValue[]> {
  const { data, error } = await supabase
    .from("attribute_values")
    .select("*")
    .eq("attribute_id", attributeId)
    .order("id");
  if (error) throw error;
  return data || [];
}

// Crear un valor nuevo para un atributo
export async function createAttributeValue(attributeId: number, value: string): Promise<AttributeValue> {
  const { data, error } = await supabase
    .from("attribute_values")
    .insert([{ attribute_id: attributeId, value }])
    .select("*")
    .single();
  if (error) throw error;
  return data as AttributeValue;
}