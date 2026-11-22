export default function DemoFrame({ title, caption, children }) {
  return (
    <figure className="panel m-0 flex flex-col rounded-2xl p-3 lg:rounded-xl lg:p-2.5">
      <div className="relative min-h-[176px] flex-1 lg:min-h-[150px] overflow-hidden rounded-xl bg-surface-alt">{children}</div>
      <figcaption className="flex items-baseline justify-between gap-3 px-1 pt-2.5 lg:pt-2">
        <span className="font-pixel text-[10px] text-ink">{title}</span>
        <span className="text-[12px] text-muted lg:text-[11.5px]">{caption}</span>
      </figcaption>
    </figure>
  );
}
