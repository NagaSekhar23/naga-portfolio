export function TagList({ items, label, limit }: { items: string[]; label?: string; limit?: number }) {
  const shown = limit ? items.slice(0, limit) : items;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label={label}>
      {shown.map((t) => (
        <li key={t} className="rounded border border-line bg-surface px-2 py-0.5 font-mono text-[11px] text-muted">
          {t}
        </li>
      ))}
      {limit && items.length > limit && (
        <li className="px-1 py-0.5 font-mono text-[11px] text-subtle">+{items.length - limit}</li>
      )}
    </ul>
  );
}
