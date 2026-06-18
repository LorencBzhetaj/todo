export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function stripTags(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

export function sanitizeInput(str: string, maxLen = 500): string {
  return stripTags(str.trim()).slice(0, maxLen);
}

export function sanitizeEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed) ? trimmed : '';
}

export function isSuspicious(str: string): boolean {
  const patterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /SELECT\s+.+\s+FROM/i,
    /DROP\s+TABLE/i,
    /INSERT\s+INTO/i,
    /DELETE\s+FROM/i,
    /UNION\s+SELECT/i,
    /--\s/,
    /\/\*[\s\S]*?\*\//,
    /data:\s*text\/html/i,
    /vbscript:/i,
    /expression\s*\(/i,
  ];
  return patterns.some(p => p.test(str));
}
