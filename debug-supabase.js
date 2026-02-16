const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manually read .env
const envPath = path.resolve(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    const k = key ? key.trim() : '';
    const v = value ? value.trim() : '';
    if (k && v) env[k] = v;
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseAnonKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

console.log('URL:', supabaseUrl);
// console.log('Key:', supabaseAnonKey); // Security: don't log full key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debug() {
    console.log('--- DEBUG START ---');

    console.log('Querying non-existent table...');
    const { error: err1 } = await supabase
        .from('non_existent_table_123')
        .select('*');
    console.log('Error 1:', err1 ? err1.message : 'NULL');

    console.log('Querying magic_users...');
    const { error: err2 } = await supabase
        .from('magic_users')
        .select('*');
    console.log('Error 2:', err2 ? err2.message : 'NULL');

    console.log('--- DEBUG END ---');
}

debug();
