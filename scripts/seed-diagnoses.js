import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const csvData = fs.readFileSync('referensi/DATASET_ASLI_2.csv', 'utf-8');
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split(',');
    
    // age,sex,T4U,TT4,T3,TSH,target
    const rawAge = values[0];
    const rawSex = values[1];
    const rawT4U = values[2];
    const rawTT4 = values[3];
    const rawT3 = values[4];
    const rawTSH = values[5];
    const rawTarget = values[6]?.trim();

    const record = {
      umur: rawAge ? parseInt(rawAge) : null,
      jenis_kelamin: rawSex === 'M' ? 'L' : rawSex === 'F' ? 'P' : null,
      t4u: rawT4U ? parseFloat(rawT4U) : null,
      tt4: rawTT4 ? parseFloat(rawTT4) : null,
      t3: rawT3 ? parseFloat(rawT3) : null,
      tsh: rawTSH ? parseFloat(rawTSH) : null,
      hasil_klasifikasi: rawTarget === '-' ? 'Normal' : rawTarget,
      confidence: 1.0, // Default for dataset data
    };

    records.push(record);
  }

  console.log(`Parsed ${records.length} records. Starting upload...`);

  const batchSize = 500;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const { error } = await supabase.from('pemeriksaan').insert(batch);
    if (error) {
      console.error(`Error inserting batch ${i / batchSize}:`, error);
    } else {
      console.log(`Inserted batch ${i / batchSize + 1}/${Math.ceil(records.length / batchSize)}`);
    }
  }

  console.log('Seeding complete!');
}

seed();
