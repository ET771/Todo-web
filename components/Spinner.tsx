export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#005BBF]" />
      {label ? <p className="text-sm text-gray-400">{label}</p> : null}
    </div>
  );
}
