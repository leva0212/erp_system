"use client";
import { useState } from "react";
import ProductsTable from "../../../ui/components/table/ProductsTable";
import ProductForm from "../../../ui/components/forms/ProductForm";
import { useProducts } from "../../../hooks/useProduct";
import { Dialog } from "@mui/material";
import { Product, Variant } from "../../../domain/product";

export default function ProductsPage() {
  const { products, rowCount, pagination, setPagination, globalFilter, setGlobalFilter, useCase } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleEditProduct(product: Product) {
    setEditingProduct(product);
    const v: Variant[] = await useCase.loadVariants(product.id);
    setVariants(v);
    setIsModalOpen(true);
  }

  async function handleSave(product: Product, variants: Variant[]) {
    await useCase.saveProduct(product, variants);
    setIsModalOpen(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Productos</h1>
      <ProductsTable
        data={products}
        rowCount={rowCount}
        pagination={pagination}
        globalFilter={globalFilter}
        onPaginationChange={setPagination}
        onGlobalFilterChange={setGlobalFilter}
        onEditProduct={handleEditProduct}
      />

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="md">
        <ProductForm
          product={editingProduct}
          variants={variants}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      </Dialog>
    </div>
  );
}