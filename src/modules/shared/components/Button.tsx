type Props = {
  label: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
};

export default function Button({ label, variant = "primary", onClick }: Props) {
  const base = "px-3 py-1 text-sm transition";

  const styles = {
    primary: "bg-purple-600 text-white hover:bg-purple-700",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
  };

  return (
    <button onClick={onClick} className={`${base} ${styles[variant]}`}>
      {label}
    </button>
  );
}

/*<Button label="Guardar" onClick={() => console.log("click")} />

✅ 4. BOTÓN TIPO POS (cuadrado como tu grid)
<button
  className="
    !rounded-none
    px-2 py-1
    border border-gray-300
    bg-gray-100
    hover:bg-gray-200
    active:bg-gray-300
    text-sm
  "
>
  Agregar
</button>
💎 5. BOTÓN ICONO (muy usado en POS)
<button className="p-1 border hover:bg-gray-200">
  ➕
</button>
🧠 CONSEJO PRO (tu proyecto)

Ya que usas theme (t.*), haz esto:

buttonPOS: `
  !rounded-none
  px-2 py-1
  text-sm
  border border-gray-300
  bg-gray-100
  hover:bg-gray-200
  active:bg-gray-300
` */