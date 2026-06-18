export default function Loading() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin"/>
        <p className="text-muted text-sm">Loading dashboard...</p>
      </div>
    </div>
  );
}
