import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-8">
      <div className="w-16 h-16 border border-gold/30 rounded-2xl flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <p className="text-8xl font-black gold-text mb-3">404</p>
      <p className="text-xl font-bold text-off-white mb-2">Page Not Found</p>
      <p className="text-muted text-sm mb-10 text-center max-w-sm">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link href="/" className="btn-gold px-8 py-3 rounded-xl font-bold shine">Back to Home</Link>
    </div>
  );
}
