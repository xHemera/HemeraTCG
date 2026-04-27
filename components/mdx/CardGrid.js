export default function CardGrid({ cards = [] }) {
  return (
    <div className="my-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {cards.map((card, index) => (
        <div key={`${card.name || 'card'}-${index}`} className="rounded-xl border border-white/10 bg-white/5 p-3">
          {card.image ? (
            <img src={card.image} alt={card.name || 'Card'} className="mb-3 h-44 w-full rounded-lg object-cover object-top" />
          ) : null}
          <p className="m-0 text-sm font-semibold text-white">{card.name || 'Unknown Card'}</p>
          {card.note ? <p className="mt-1 text-xs text-white/60">{card.note}</p> : null}
        </div>
      ))}
    </div>
  );
}
