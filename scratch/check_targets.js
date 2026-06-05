import fs from 'fs';

const csvData = fs.readFileSync('referensi/DATASET_ASLI_2.csv', 'utf-8');
const lines = csvData.split('\n');

const targets = new Set();
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const values = lines[i].split(',');
  const rawTarget = values[6]?.trim();
  targets.add(rawTarget);
}

console.log('Unique targets in CSV:', Array.from(targets));
