'use client';
import { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { translations, type TranslationKey, type Lang } from './translations';

export function useLang() {
  const pathname = usePathname();
  const router = useRouter();

  // Language is PURELY determined by URL path — no localStorage needed
  const lang: Lang = pathname.startsWith('/sq') ? 'sq' : 'en';

  const toggleLang = useCallback(() => {
    if (lang === 'sq') {
      // SQ → EN: map back to EN path
      const map: Record<string, string> = {
        '/sq/makina':     '/cars',
        '/sq/rreth-nesh': '/about',
        '/sq/kontakt':    '/contact',
      };
      const enPath = map[pathname] ?? (pathname.startsWith('/sq') ? '/' : pathname);
      router.push(enPath);
    } else {
      // EN → SQ: map to SQ path
      const map: Record<string, string> = {
        '/cars':    '/sq/makina',
        '/about':   '/sq/rreth-nesh',
        '/contact': '/sq/kontakt',
      };
      const sqPath = map[pathname] ?? (pathname === '/' ? '/sq/' : '/sq/');
      router.push(sqPath);
    }
  }, [lang, pathname, router]);

  const t = useCallback(
    (key: TranslationKey): string => translations[lang]?.[key] ?? translations.en[key] ?? key,
    [lang],
  );

  return { lang, t, toggleLang };
}
