export default function DeckTip({ type = 'info', title, children }) {
  const styles = {
    info: 'border-cyan-400/40 bg-cyan-400/10 text-cyan-100',
    success: 'border-green-400/40 bg-green-400/10 text-green-100',
    warning: 'border-amber-400/50 bg-amber-400/15 text-amber-50'
  };

  const label = title || (type === 'warning' ? 'Important' : type === 'success' ? 'Tip' : 'Note');

  return (
    <aside className={`my-5 rounded-xl border px-4 py-3 ${styles[type] || styles.info}`}>
      <p className="m-0 text-xs font-semibold uppercase tracking-wide opacity-90">{label}</p>
      <div className="mt-2 text-sm leading-6">{children}</div>
    </aside>
  );
}
