export default function SectionLabel({ number = "01", label, title, subtitle, meta = "System Active" }) {
  return (
    <div className="mb-14 relative group">
      {/* Specia1ne section signal bar */}
      <div className="flex items-center justify-between border-b border-[#1e2d4a]/80 pb-4 mb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-[#38bdf8] uppercase tracking-widest">
          <span className="font-bold text-[#38bdf8] text-sm">{number}</span>
          <span className="text-[#8fa3c0]/50">/</span>
          <span className="text-[#f0f6ff] font-semibold">{label}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#8fa3c0]">
          <span className="text-[#38bdf8]">[</span>
          <span>{meta}</span>
          <span className="text-[#38bdf8]">]</span>
        </div>
      </div>

      {/* Main Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-sora font-extrabold text-[#f0f6ff] tracking-tight leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[#8fa3c0] font-mono text-xs md:text-sm mt-2 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
