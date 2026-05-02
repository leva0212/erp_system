import { Variant } from "./variant"

export interface VariantRepository {
  getAll(): Promise<Variant[]>
  getById(id: number): Promise<Variant | null>
  search(query: string): Promise<Variant[]>

  create(data: Partial<Variant>): Promise<Variant>
  update(id: number, data: Partial<Variant>): Promise<Variant>
}