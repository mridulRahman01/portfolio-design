/**
 * Route-transition loader for the whole admin panel.
 * Next.js streams this instantly on every navigation between admin pages
 * while the server component for the target page is being rendered.
 */
export default function AdminLoading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6">
      {/* Dual-ring spinner */}
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-2 border-white/8" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#00F5B8]" />
        <div
          className="absolute inset-[7px] animate-spin rounded-full border-2 border-transparent border-b-[#FF7A18]/70"
          style={{ animationDirection: 'reverse', animationDuration: '1.1s' }}
        />
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <span className="text-sm font-bold tracking-wide text-white/70">Loading</span>
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00F5B8] [animation-delay:0ms]" />
          <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00F5B8] [animation-delay:150ms]" />
          <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00F5B8] [animation-delay:300ms]" />
        </span>
      </div>

      {/* Skeleton hint of incoming content */}
      <div className="mt-2 w-full max-w-3xl space-y-3 opacity-40" aria-hidden="true">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-white/[0.05]" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-20 animate-pulse rounded-2xl bg-white/[0.04]" />
          <div className="h-20 animate-pulse rounded-2xl bg-white/[0.04] [animation-delay:120ms]" />
          <div className="h-20 animate-pulse rounded-2xl bg-white/[0.04] [animation-delay:240ms]" />
        </div>
        <div className="h-40 animate-pulse rounded-2xl bg-white/[0.03] [animation-delay:360ms]" />
      </div>
    </div>
  );
}
