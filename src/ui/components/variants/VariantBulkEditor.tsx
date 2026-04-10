"use client";

export default function VariantBulkEditor({
  variants,
  setVariants,
}: any) {
  const update = (index: number, field: string, value: any) => {
    const copy = [...variants];
    copy[index][field] = value;
    setVariants(copy);
  };

  return (
    <table className="w-full border text-sm">
      <thead>
        <tr>
          <th>SKU</th>
          <th>Precio</th>
          <th>Activo</th>
        </tr>
      </thead>

      <tbody>
        {variants.map((v: any, i: number) => (
          <tr key={i} className="border-t">
            <td>
              <input
                className="border px-2"
                value={v.sku}
                onChange={(e) =>
                  update(i, "sku", e.target.value)
                }
              />
            </td>

            <td>
              <input
                type="number"
                className="border px-2 w-20"
                value={v.price}
                onChange={(e) =>
                  update(i, "price", Number(e.target.value))
                }
              />
            </td>

            <td>
              <input
                type="checkbox"
                checked={v.active}
                onChange={(e) =>
                  update(i, "active", e.target.checked)
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}