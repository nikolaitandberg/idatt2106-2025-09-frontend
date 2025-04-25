export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-5 h-5 border-2 border-neutral-100 border-t-2 border-t-transparent  rounded-full animate-spin" />
    </div>
  );
}
