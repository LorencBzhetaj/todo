const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '355697536334';

export default function WhatsApp() {
  return (
    <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9999] w-14 h-14 bg-green-500 hover:bg-green-400 text-white rounded-full shadow-2xl shadow-green-500/30 transition-all duration-300 hover:scale-110 flex items-center justify-center"
      aria-label="Chat on WhatsApp">
      <svg fill="currentColor" viewBox="0 0 16 16" className="w-7 h-7" aria-hidden="true">
        <path d="M13.601 2.326A7.854 7.854 0 008.007 0C3.589 0 .012 3.577.01 7.995c0 1.41.366 2.79 1.057 4.012L0 16l4.092-1.07a7.96 7.96 0 003.915 1.003h.003c4.418 0 7.995-3.577 7.997-7.995a7.91 7.91 0 00-2.406-5.612z"/>
      </svg>
    </a>
  );
}
