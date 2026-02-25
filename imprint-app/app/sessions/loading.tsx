export default function SessionsLoading() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-brand-surface">
      {/* Navbar placeholder — matches real navbar exactly */}
      <div className="absolute inset-x-0 top-0 z-50 flex h-[56px] items-center justify-between border-b border-neutral-800 bg-brand-dark px-6">
        <span className="font-awesome-serif text-[18px] text-white">Brand.md</span>
        <div className="flex items-center gap-5">
          <div className="h-3 w-10 rounded bg-neutral-700 animate-pulse" />
          <div className="h-3 w-10 rounded bg-neutral-700 animate-pulse" />
          <div className="size-8 rounded-full bg-neutral-700 animate-pulse" />
        </div>
      </div>

      <main className="absolute inset-x-0 bottom-0 overflow-y-auto" style={{ top: '56px' }}>
        <div className="mx-auto max-w-[800px] px-8 py-[60px]">
          {/* Header skeleton */}
          <div className="mb-10">
            <div className="h-7 w-40 rounded bg-neutral-700 animate-pulse" />
            <div className="mt-3 h-4 w-80 rounded bg-neutral-800 animate-pulse" />
          </div>

          {/* Cards skeleton */}
          <div className="overflow-hidden rounded-[12px] border border-neutral-800 bg-[#1c1c1c]">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                {i > 0 && <div className="h-px bg-neutral-800" />}
                <div className="p-5">
                  <div className="flex gap-5">
                    <div className="size-11 shrink-0 rounded-full bg-neutral-700 animate-pulse" />
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="h-4 w-3/5 rounded bg-neutral-700 animate-pulse" />
                      <div className="h-3 w-2/5 rounded bg-neutral-800 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
