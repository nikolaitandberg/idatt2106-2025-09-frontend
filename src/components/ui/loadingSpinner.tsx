export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-5 h-5 border-2 border-neutral-800 border-t-2 border-t-neutral-200 rounded-full animate-spin" />
    </div>
  );
}
