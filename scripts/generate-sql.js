import fs from 'fs';

const csvData = fs.readFileSync('referensi/DATASET_ASLI_2.csv', 'utf-8');
const lines = csvData.split('\n');

let sql = 'INSERT INTO pemeriksaan (umur, jenis_kelamin, t4u, tt4, t3, tsh, hasil_klasifikasi, confidence) VALUES ';
const records = [];

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const values = lines[i].split(',');
  
  const rawAge = values[0];
  const rawSex = values[1];
  const rawT4U = values[2];
  const rawTT4 = values[3];
  const rawT3 = values[4];
  const rawTSH = values[5];
  const rawTarget = values[6]?.trim();

  const umur = rawAge ? parseInt(rawAge) : 'NULL';
  const jenis_kelamin = rawSex === 'M' ? "'L'" : rawSex === 'F' ? "'P'" : 'NULL';
  const t4u = rawT4U ? parseFloat(rawT4U) : 'NULL';
  const tt4 = rawTT4 ? parseFloat(rawTT4) : 'NULL';
  const t3 = rawT3 ? parseFloat(rawT3) : 'NULL';
  const tsh = rawTSH ? parseFloat(rawTSH) : 'NULL';
  const hasil_klasifikasi = rawTarget === '-' ? "'Normal'" : `'${rawTarget}'`;
  const confidence = 1.0;

  records.push(`(${umur}, ${jenis_kelamin}, ${t4u}, ${tt4}, ${t3}, ${tsh}, ${hasil_klasifikasi}, ${confidence})`);
}

// Write in batches of 1000 to multiple files or just console log chunks
for (let i = 0; i < records.length; i += 1000) {
    const batch = records.slice(i, i + 1000);
    fs.writeFileSync(`scripts/seed_batch_${i/1000}.sql`, `INSERT INTO pemeriksaan (umur, jenis_kelamin, t4u, tt4, t3, tsh, hasil_klasifikasi, confidence) VALUES \n${batch.join(',\n')};`);
}
