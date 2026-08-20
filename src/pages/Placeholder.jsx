export default function Placeholder({ title = "Page Under Construction" }) {
  return (
    <div className="p-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white">
      {title}
    </div>
  );
}
