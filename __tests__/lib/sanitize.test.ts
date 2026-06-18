import {
  escapeHtml,
  stripTags,
  sanitizeInput,
  sanitizeEmail,
  isSuspicious,
} from '@/lib/sanitize';

describe('escapeHtml', () => {
  it('escapes <', () => expect(escapeHtml('<div>')).toBe('&lt;div&gt;'));
  it('escapes >', () => expect(escapeHtml('a>b')).toBe('a&gt;b'));
  it('escapes &', () => expect(escapeHtml('a&b')).toBe('a&amp;b'));
  it('escapes "', () => expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;'));
  it("escapes '", () => expect(escapeHtml("it's")).toBe('it&#x27;s'));
  it('leaves safe strings unchanged', () => expect(escapeHtml('hello world')).toBe('hello world'));
});

describe('stripTags', () => {
  it('removes <script> tags', () => expect(stripTags('<script>alert(1)</script>')).toBe('alert(1)'));
  it('removes HTML tags', () => expect(stripTags('<b>bold</b>')).toBe('bold'));
  it('leaves plain text unchanged', () => expect(stripTags('hello')).toBe('hello'));
});

describe('sanitizeInput', () => {
  it('strips tags and trims whitespace', () => expect(sanitizeInput('  <b>hi</b>  ')).toBe('hi'));
  it('truncates at maxLen', () => expect(sanitizeInput('abcdef', 3)).toBe('abc'));
  it('defaults maxLen to 500', () => {
    const long = 'a'.repeat(600);
    expect(sanitizeInput(long)).toHaveLength(500);
  });
});

describe('sanitizeEmail', () => {
  it('accepts valid email', () => expect(sanitizeEmail('Test@Example.COM')).toBe('test@example.com'));
  it('rejects email without @', () => expect(sanitizeEmail('notanemail')).toBe(''));
  it('rejects email without domain', () => expect(sanitizeEmail('a@')).toBe(''));
  it('trims whitespace', () => expect(sanitizeEmail('  a@b.com  ')).toBe('a@b.com'));
});

describe('isSuspicious', () => {
  it('detects <script>', () => expect(isSuspicious('<script>alert(1)</script>')).toBe(true));
  it('detects javascript:', () => expect(isSuspicious('javascript:void(0)')).toBe(true));
  it('detects onclick=', () => expect(isSuspicious('onclick=evil()')).toBe(true));
  it('detects SELECT FROM', () => expect(isSuspicious("SELECT * FROM users")).toBe(true));
  it('detects DROP TABLE', () => expect(isSuspicious('DROP TABLE users')).toBe(true));
  it('detects INSERT INTO', () => expect(isSuspicious('INSERT INTO x VALUES')).toBe(true));
  it('detects UNION SELECT', () => expect(isSuspicious('UNION SELECT password')).toBe(true));
  it('detects vbscript:', () => expect(isSuspicious('vbscript:run()')).toBe(true));
  it('allows safe input', () => expect(isSuspicious('Book a car for 3 days')).toBe(false));
  it('allows normal name', () => expect(isSuspicious('John Smith')).toBe(false));
});
