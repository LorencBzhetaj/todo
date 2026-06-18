// app/(public)/layout.tsx
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import WhatsApp from '@/components/ui/WhatsApp';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-dark">
      <Navigation />
      <main className="flex-1 w-full page-enter" id="main-content">{children}</main>
      <Footer />
      <WhatsApp />
    </div>
  );
}
