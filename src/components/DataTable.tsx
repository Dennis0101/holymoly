export default function DataTable({ headers, rows }: { headers: string[]; rows: (string|number|JSX.Element)[][] }) {
  return (
    <div className="panel overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-white/70">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-white/5">
              {r.map((c, j) => (
                <td key={j} className="px-3 py-2">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
