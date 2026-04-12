export default function SalesDocumentStatusBar({
  status,
}: {
  status: "draft" | "partial" | "paid"
}) {

  const color =
    status === "paid"
      ? "green"
      : status === "partial"
      ? "orange"
      : "gray"

  return (
    <div style={{ color }}>
      Estado: {status}
    </div>
  )
}

