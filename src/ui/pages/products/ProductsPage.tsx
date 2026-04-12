"use client";

import { useState } from "react";
import ProductsTable from "../../../ui/components/table/ProductsTable";
import ProductWizard from "../../../ui/components/products/ProductWizard";
import { useProducts } from "../../../hooks/useProduct";
import { Product } from "../../../domain/product";
import { ThemeProvider } from  "@/theme/ThemeProvider";
import { theme } from "@/theme/theme";
import { useThemeClasses } from "@/theme/useThemeClasses";

export default function ProductsPage() {
  const {
    products,
    rowCount,
    pagination,
    setPagination,
    globalFilter,
    setGlobalFilter,
  } = useProducts();

  const tema = useThemeClasses();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  function handleEditProduct(product: Product) {
    setEditingProduct(product);
    setIsWizardOpen(true);
  }

  function handleNewProduct() {
    setEditingProduct(null);
    setIsWizardOpen(true);
  }

  return (
    <div className={`${tema.background} min-h-screen p-1 md:p-5`}>
      <div className="w-full md:max-w-7xl md:mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-1">
          <h1 className={`text-xl font-semibold ${tema.text}`}>
            Productos
          </h1>

          <button
            onClick={handleNewProduct}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            + Nuevo producto
          </button>
        </div>

        {/* TABLE */}
        <div className={`${tema.surface} ${tema.border} rounded-lg shadow-sm p-0 md:p-2`}>
          <ProductsTable
            data={products}
            rowCount={rowCount}
            pagination={pagination}
            globalFilter={globalFilter}
            onPaginationChange={setPagination}
            onGlobalFilterChange={setGlobalFilter}
            onEditProduct={handleEditProduct}
          />
        </div>

        {isWizardOpen && (
          <ProductWizard
            product={editingProduct}
            onClose={() => setIsWizardOpen(false)}
          />
        )}

      </div>
    </div>
  );
}