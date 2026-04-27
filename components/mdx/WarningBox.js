export default function WarningBox({ title = 'Warning', children }) {
  return (
    <aside className="my-5 rounded-xl border border-red-400/50 bg-red-500/10 px-4 py-3 text-red-50">
      <p className="m-0 text-xs font-semibold uppercase tracking-wide">{title}</p>
      <div className="mt-2 text-sm leading-6">{children}</div>
    </aside>
  );
}
