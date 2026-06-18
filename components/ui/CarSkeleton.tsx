// components/ui/CarSkeleton.tsx
export default function CarSkeleton() {
  return (
    <div className="bg-dark-3 border border-white/5 rounded-2xl overflow-hidden" aria-hidden="true">
      <div className="h-52 skeleton" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-3 w-16 skeleton rounded-full" />
          <div className="h-5 w-20 skeleton rounded-full" />
        </div>
        <div className="h-4 w-3/4 skeleton rounded-full" />
        <div className="flex gap-2 pt-1">
          <div className="h-6 w-16 skeleton rounded-full" />
          <div className="h-6 w-16 skeleton rounded-full" />
        </div>
        <div className="h-10 w-full skeleton rounded-xl mt-2" />
      </div>
    </div>
  );
}
