import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-24">
      <div className="max-w-xl w-full text-center">
        <div className="font-mono-tech text-[11px] uppercase tracking-[0.25em] text-[#de5cff] mb-8 animate-fade-in">
          / Access Denied
        </div>

        <h1
          className="animate-fade-up font-anonymous font-bold text-7xl sm:text-8xl md:text-9xl text-white leading-none"
          style={{ animationDelay: "0.1s" }}
        >
          4<span className="text-[#de5cff]">0</span>4
        </h1>

        <p
          className="animate-fade-up font-mono-tech text-zinc-400 text-sm md:text-base mt-8 leading-relaxed"
          style={{ animationDelay: "0.25s" }}
        >
          This route never existed — or it&apos;s outside the agreed scope.
          Either way, access denied.
        </p>

        <div
          className="animate-fade-up font-mono-tech text-xs text-left bg-zinc-900/60 border border-zinc-800 rounded px-4 py-3 mt-8 overflow-x-auto"
          style={{ animationDelay: "0.4s" }}
        >
          <div>
            <span className="text-emerald-400">$</span>{" "}
            <span className="text-zinc-300">
              curl -i https://0daysecurity.tech/this-page
            </span>
          </div>
          <div className="mt-1">
            <span className="text-[#de5cff]">HTTP/1.1 404</span>{" "}
            <span className="text-zinc-500">Not Found</span>
            <span className="animate-cursor-blink inline-block w-2 h-4 bg-[#de5cff] ml-1.5 align-middle" />
          </div>
        </div>

        <div
          className="animate-fade-up flex flex-wrap items-center justify-center gap-4 mt-10"
          style={{ animationDelay: "0.55s" }}
        >
          <Link
            href="/"
            className="px-7 py-3.5 bg-[#de5cff] hover:bg-[#c000f0] text-black hover:text-white font-mono-tech font-medium text-sm uppercase tracking-wider rounded-[3px] transition shadow-[0_0_25px_rgba(222,92,255,0.35)]"
          >
            Return to Base
          </Link>
          <Link
            href="/#services"
            className="px-7 py-3.5 bg-black/60 hover:bg-zinc-900 text-white border border-white/25 hover:border-[#de5cff] font-mono-tech text-sm uppercase tracking-wider rounded-[3px] transition"
          >
            View Services
          </Link>
        </div>

        <p
          className="animate-fade-up font-mono-tech text-[11px] text-zinc-600 mt-12 leading-relaxed"
          style={{ animationDelay: "0.7s" }}
        >
          Found an actual path traversal on our site? We&apos;d genuinely like
          to know —{" "}
          <a
            href="mailto:anmol@0daysecurity.tech?subject=0DAY%20Research%20Team%20—%20site%20issue"
            className="text-[#de5cff] hover:underline break-all"
          >
            anmol@0daysecurity.tech
          </a>
        </p>
      </div>
    </div>
  );
}
