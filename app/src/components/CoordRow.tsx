interface CoordRowProps {
  items: Array<{ k: string; v: string | number }>
}

export function CoordRow({ items }: CoordRowProps) {
  return (
    <div className="coord-row">
      {items.map((it, i) => (
        <span key={i}>
          {it.k}<span className="v">{it.v}</span>
        </span>
      ))}
    </div>
  )
}
