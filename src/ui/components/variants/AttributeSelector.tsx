/*"use client";

import { Attribute, AttributeValue } from "@/src/domain/attribute";
import { useThemeClasses } from "@/theme/useThemeClasses";

type AttributeWithValues = Attribute & {
  values: AttributeValue[];
};

type Props = {
  attributes: AttributeWithValues[];
  selected: Record<number, AttributeValue[]>;
  setSelected: (v: Record<number, AttributeValue[]>) => void;
};

export default function AttributeSelector({
  attributes,
  selected,
  setSelected,
}: Props) {
  const t = useThemeClasses();

  // =========================
  // TOGGLE VALUE
  // =========================
  const toggleValue = (attrId: number, val: AttributeValue) => {
    const current = selected[attrId] || [];

    const exists = current.some((v) => v.id === val.id);

    let updated: AttributeValue[];

    if (exists) {
      updated = current.filter((v) => v.id !== val.id);
    } else {
      updated = [...current, val];
    }

    setSelected({
      ...selected,
      [attrId]: updated,
    });
  };

  return (
    <div className="space-y-4">
      {attributes.map((attr) => (
        <div
          key={attr.id}
          className={`${t.surface} ${t.border} border rounded-lg p-4`}
        >
          {/* ATTRIBUTE NAME */
        
        /*}
          <div className={`font-semibold mb-3 ${t.text}`}>
            {attr.name}
          </div>

          {/* VALUES *//*}
          <div className="flex flex-wrap gap-2">
            {attr.values.map((val) => {
              const isSelected =
                selected[attr.id]?.some((v) => v.id === val.id) || false;

              return (
                <button
                  key={val.id}
                  type="button"
                  onClick={() => toggleValue(attr.id, val)}
                  className={`px-3 py-1.5 rounded-md border text-sm transition
                    ${
                      isSelected
                        ? t.buttonPrimary
                        : `${t.surface} ${t.text} ${t.border}`
                    }
                  `}
                >
                  {val.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}*/ 