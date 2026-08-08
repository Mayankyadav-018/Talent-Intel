export function parseCandidate(text: string) {
  const email =
    text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/)?.[0] ?? null;

  const phone =
    text.match(/\+?\d[\d\s-]{8,15}/)?.[0] ?? null;

  const github =
    text.match(/github\.com\/([A-Za-z0-9-]+)/i)?.[1] ?? null;

  const linkedin =
    text.match(/linkedin\.com\/in\/([A-Za-z0-9-]+)/i)?.[1] ?? null;

  return {
    email,
    phone,
    github,
    linkedin,
    rawText: text,
  };
}