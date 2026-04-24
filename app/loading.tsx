export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-[#050505]">
      {/* Spinner Container */}
      <div className="relative w-12 h-12">
        {/* Main Spinner */}
        <div className="absolute inset-0 border-4 border-zinc-800 rounded-full" />
        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
      </div>
    </div>
  );
}
