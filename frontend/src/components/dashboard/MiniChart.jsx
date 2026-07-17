

export function MiniChart({ data }) {
  const max = Math.max(...data.map((d) => d.v));
  
  return (
    <div className="flex h-40 items-end gap-2">
      {data.map((d) => (
        <div key={d.m} className="group flex flex-1 flex-col items-center gap-2">
          <div className="relative flex h-full w-full items-end">
            <div
              className="w-full rounded-md bg-primary/80 transition-all group-hover:bg-primary"
              style={{ height: `${(d.v / max) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground">{d.m}</span>
        </div>
      ))}
    </div>
  );
}