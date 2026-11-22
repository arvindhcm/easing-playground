export default function DemoFrame({ title, caption, children }) {
  return (
    <figure className="m-0 rounded-2xl border border-border-strong bg-surface p-3">
      <div className="relative h-[176px] overflow-hidden rounded-xl bg-surface-alt">{children}</div>
      <figcaption className="flex items-baseline justify-between gap-3 px-1 pt-2.5">
        <span className="text-[13.5px] font-bold text-ink">{title}</span>
        <span className="text-[12px] text-muted">{caption}</span>
      </figcaption>
    </figure>
  );
}
