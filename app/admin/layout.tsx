import AdminNav from './AdminNav';
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-dark text-off-white">
      <AdminNav />
      {/* pt-14 on mobile for fixed top bar, no padding on desktop */}
      <main className="flex-1 overflow-auto pt-14 lg:pt-0">{children}</main>
    </div>
  );
}
