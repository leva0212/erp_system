import { useState, useEffect } from "react";
import { ProductUseCase } from "../application/ProductUseCase";
import { Product} from "../domain/product";
import { type MRT_PaginationState } from "material-react-table";

export function useProducts() {
  const useCase = new ProductUseCase();
  const [products, setProducts] = useState<Product[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [pagination, setPagination] = useState<MRT_PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(globalFilter);
      setPagination(old => ({ ...old, pageIndex: 0 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [globalFilter]);

  useEffect(() => {
    async function load() {
      const res = await useCase.loadProducts({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, globalFilter: debouncedFilter });
      setProducts(res.data);
      setRowCount(res.rowCount);
    }
    load();
  }, [pagination, debouncedFilter]);

  return { products, rowCount, pagination, setPagination, globalFilter, setGlobalFilter, useCase };
}