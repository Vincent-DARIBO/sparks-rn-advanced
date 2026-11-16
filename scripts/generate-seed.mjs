import { writeFileSync } from 'node:fs';

const TARGET = 500;
const EXCLUDED_ISBNS = new Set(['9780441013593']);
const EXCLUDED_TITLE = /^dune/i;
const SUBJECTS = [
  'fantasy', 'science_fiction', 'mystery', 'romance', 'history', 'biography',
  'cooking', 'philosophy', 'poetry', 'thriller', 'horror', 'adventure',
  'psychology', 'art', 'travel', 'classics',
];
const HEADERS = { 'User-Agent': 'shelfscan-formation-seed/1.0' };
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isValidIsbn13(isbn) {
  if (!/^\d{13}$/.test(isbn)) return false;
  const sum = [...isbn].reduce((acc, digit, i) => acc + Number(digit) * (i % 2 === 0 ? 1 : 3), 0);
  return sum % 10 === 0;
}

async function searchSubject(subject, page) {
  const url = `https://openlibrary.org/search.json?q=subject:${subject}&fields=title,author_name,isbn&limit=100&page=${page}`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  const json = await res.json();
  return json.docs ?? [];
}

const books = [];
const seenIsbns = new Set();
const seenTitles = new Set();

for (const subject of SUBJECTS) {
  if (books.length >= TARGET) break;
  const docs = await searchSubject(subject, 1);
  console.log(subject, docs.length);
  for (const doc of docs) {
    if (books.length >= TARGET) break;
    if (!doc.title || !doc.author_name?.length || !doc.isbn) continue;
    const isbn = doc.isbn.find((candidate) => candidate.startsWith('978') && isValidIsbn13(candidate));
    if (!isbn || seenIsbns.has(isbn) || EXCLUDED_ISBNS.has(isbn)) continue;
    const titleKey = doc.title.trim().toLowerCase();
    if (seenTitles.has(titleKey) || EXCLUDED_TITLE.test(doc.title)) continue;
    seenIsbns.add(isbn);
    seenTitles.add(titleKey);
    books.push({ isbn, title: doc.title.trim(), author: doc.author_name[0] });
  }
  await wait(1000);
}

if (books.length < TARGET) throw new Error(`Seulement ${books.length} livres`);

writeFileSync(new URL('../src/data/books.seed.json', import.meta.url), JSON.stringify(books, null, 2) + '\n');
console.log('écrit', books.length);
