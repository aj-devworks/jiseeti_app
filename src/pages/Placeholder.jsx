export default function Placeholder({ title = "Page Under Construction" }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
      {title}
    </div>
  );
}
