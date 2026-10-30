/** Small exact-arithmetic and formatting helpers shared by the curriculum skill generators. */

export function gcd(a: number, b: number): number { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
export function lcm(a: number, b: number): number { return Math.abs(a * b) / gcd(a, b); }

export type Frac = { n: number; d: number };
export function frac(n: number, d = 1): Frac {
  if (d === 0) throw new Error("zero denominator");
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}
export const fAdd = (a: Frac, b: Frac) => frac(a.n * b.d + b.n * a.d, a.d * b.d);
export const fSub = (a: Frac, b: Frac) => frac(a.n * b.d - b.n * a.d, a.d * b.d);
export const fMul = (a: Frac, b: Frac) => frac(a.n * b.n, a.d * b.d);
export const fDiv = (a: Frac, b: Frac) => frac(a.n * b.d, a.d * b.n);
export const fVal = (a: Frac) => a.n / a.d;

/** "3/4", "-5/2", "7" */
export function fStr(a: Frac): string { return a.d === 1 ? `${a.n}` : `${a.n}/${a.d}`; }
/** "1 1/4", "-2 1/2", "3/4", "5" */
export function fMixed(a: Frac): string {
  if (a.d === 1 || Math.abs(a.n) < a.d) return fStr(a);
  const sign = a.n < 0 ? "-" : "";
  const n = Math.abs(a.n);
  const whole = Math.floor(n / a.d), rem = n % a.d;
  return rem === 0 ? `${sign}${whole}` : `${sign}${whole} ${rem}/${a.d}`;
}

/** Trims floating-point noise: 0.30000000000000004 → "0.3" */
export function num(x: number, maxDp = 6): string {
  const s = parseFloat(x.toFixed(maxDp)).toString();
  return s === "-0" ? "0" : s;
}
export const round = (x: number, dp: number) => Math.round(x * Math.pow(10, dp)) / Math.pow(10, dp);
export const comma = (n: number) => n.toLocaleString("en-US");
export const money = (x: number) => `${x < 0 ? "-" : ""}$${Math.abs(x).toFixed(2)}`;
/** "1 unit", "3 units" */
export const units = (n: number, word = "unit") => `${n} ${word}${Math.abs(n) === 1 ? "" : "s"}`;
export const cents = (c: number) => (c >= 100 ? `$${(c / 100).toFixed(2)}` : `${c}¢`);

/** Signed term in the middle of an expression: " + 3", " - 3", and "" for 0 so "x + 0" never appears */
export const sgn = (n: number) => (n === 0 ? "" : n < 0 ? ` - ${Math.abs(n)}` : ` + ${n}`);
/** Coefficient in front of a variable: 1 → "", -1 → "-", 3 → "3" */
export const coef = (n: number) => (n === 1 ? "" : n === -1 ? "-" : `${n}`);

/** a·v + b, e.g. (3, -4, "x") → "3x - 4"; (0, 5) → "5"; (-1, 0) → "-x" */
export function linExpr(a: number, b: number, v = "x"): string {
  if (a === 0) return `${b}`;
  return `${coef(a)}${v}${b === 0 ? "" : sgn(b)}`;
}
/** Line in slope-intercept form, slope may be a fraction */
export function lineStr(m: Frac, b: Frac): string {
  const mPart = m.n === 0 ? "" : m.d === 1 ? `${coef(m.n)}x` : `${m.n < 0 ? "-" : ""}(${Math.abs(m.n)}/${m.d})x`;
  if (!mPart) return `y = ${fStr(b)}`;
  if (b.n === 0) return `y = ${mPart}`;
  return `y = ${mPart} ${b.n < 0 ? "-" : "+"} ${fStr(frac(Math.abs(b.n), b.d))}`;
}

/** Polynomial from coefficients, highest power first: [2, -3, 0, 5] → "2x^3 - 3x^2 + 5" */
export function poly(coeffs: number[], v = "x"): string {
  const deg = coeffs.length - 1;
  const parts: string[] = [];
  coeffs.forEach((c, i) => {
    const p = deg - i;
    if (c === 0) return;
    const abs = Math.abs(c);
    const body = p === 0 ? `${abs}` : `${abs === 1 ? "" : abs}${v}${p === 1 ? "" : `^${p}`}`;
    if (parts.length === 0) parts.push(c < 0 ? `-${body}` : body);
    else parts.push(c < 0 ? `- ${body}` : `+ ${body}`);
  });
  return parts.length ? parts.join(" ") : "0";
}
/** Evaluates coefficients (highest power first) at x */
export const polyAt = (coeffs: number[], x: number) => coeffs.reduce((acc, c) => acc * x + c, 0);
/** Multiplies two polynomials (highest power first) */
export function polyMul(a: number[], b: number[]): number[] {
  const out = new Array(a.length + b.length - 1).fill(0);
  a.forEach((x, i) => b.forEach((y, j) => { out[i + j] += x * y; }));
  return out;
}
/** Linear factor "(2x + 3)", "(x - 4)", or "x" when the constant is 0 */
export function factor(a: number, b: number, v = "x"): string {
  if (b === 0 && a === 1) return v;
  return `(${linExpr(a, b, v)})`;
}

export function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  r = Math.min(r, n - r);
  let out = 1;
  for (let i = 1; i <= r; i++) out = (out * (n - r + i)) / i;
  return Math.round(out);
}
export function nPr(n: number, r: number): number { let out = 1; for (let i = 0; i < r; i++) out *= n - i; return out; }
export function factorial(n: number): number { let out = 1; for (let i = 2; i <= n; i++) out *= i; return out; }
export function isPrime(n: number): boolean { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
export function factorsOf(n: number): number[] { const out: number[] = []; for (let i = 1; i <= n; i++) if (n % i === 0) out.push(i); return out; }

/** √n in simplest radical form: 50 → "5√2", 49 → "7", 7 → "√7" */
export function radical(n: number): string {
  let outside = 1, inside = n;
  for (let k = Math.floor(Math.sqrt(n)); k >= 2; k--) if (inside % (k * k) === 0) { outside *= k; inside /= k * k; break; }
  if (inside === 1) return `${outside}`;
  return `${outside === 1 ? "" : outside}√${inside}`;
}
/** a multiple of π: (3, 2) → "3π/2", (4, 1) → "4π", (1, 3) → "π/3" */
export function piStr(f: Frac): string {
  if (f.n === 0) return "0";
  const top = Math.abs(f.n) === 1 ? "π" : `${Math.abs(f.n)}π`;
  return `${f.n < 0 ? "-" : ""}${top}${f.d === 1 ? "" : `/${f.d}`}`;
}
/** a + bi */
export function complexStr(a: number, b: number): string {
  if (b === 0) return `${a}`;
  const bi = `${Math.abs(b) === 1 ? "" : Math.abs(b)}i`;
  if (a === 0) return `${b < 0 ? "-" : ""}${bi}`;
  return `${a} ${b < 0 ? "-" : "+"} ${bi}`;
}

const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
function under1000(n: number): string {
  const h = Math.floor(n / 100), rest = n % 100;
  const parts: string[] = [];
  if (h) parts.push(`${ONES[h]} hundred`);
  if (rest) parts.push(rest < 20 ? ONES[rest] : `${TENS[Math.floor(rest / 10)]}${rest % 10 ? `-${ONES[rest % 10]}` : ""}`);
  return parts.join(" ");
}
/** 45206 → "forty-five thousand, two hundred six" (US style, no "and") */
export function numberToWords(n: number): string {
  if (n === 0) return "zero";
  const parts: string[] = [];
  const millions = Math.floor(n / 1_000_000), thousands = Math.floor((n % 1_000_000) / 1000), rest = n % 1000;
  if (millions) parts.push(`${under1000(millions)} million`);
  if (thousands) parts.push(`${under1000(thousands)} thousand`);
  if (rest) parts.push(under1000(rest));
  return parts.join(", ");
}
/** 30508 → "30,000 + 500 + 8" */
export function expandedForm(n: number): string {
  const s = `${n}`;
  const terms: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const d = parseInt(s[i], 10);
    if (d) terms.push(comma(d * Math.pow(10, s.length - 1 - i)));
  }
  return terms.join(" + ");
}

export function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export const NAMES = ["Maria", "Jayden", "Aisha", "Liam", "Priya", "Noah", "Zoe", "Kenji", "Amara", "Diego", "Ines", "Sam", "Omar", "Lena", "Yusuf", "Mei"];
