export default function MatchupTable({ rows = [] }) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-white/10 bg-white/5">
      <table className="m-0 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5 text-left">
            <th className="px-4 py-3 font-semibold text-white">Matchup</th>
            <th className="px-4 py-3 font-semibold text-white">Difficulty</th>
            <th className="px-4 py-3 font-semibold text-white">Plan</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.matchup || 'matchup'}-${index}`} className="border-b border-white/5 last:border-b-0">
              <td className="px-4 py-3 font-medium text-white/90">{row.matchup || '-'}</td>
              <td className="px-4 py-3 text-white/70">{row.difficulty || '-'}</td>
              <td className="px-4 py-3 text-white/70">{row.plan || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
