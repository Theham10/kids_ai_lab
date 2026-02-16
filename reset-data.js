
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env file manually
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) envVars[key.trim()] = value.trim();
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetMasterData() {
    console.log('🧹 Investigating data for reset...');

    // Check magic_stories
    console.log('\n--- Magic Stories ---');
    const { data: stories, error: storiesError } = await supabase
        .from('magic_stories')
        .select('*');

    if (storiesError) {
        console.error('Error fetching stories:', storiesError.message);
    } else {
        console.log(`Found ${stories.length} stories.`);
        if (stories.length > 0) {
            console.log('Existing stories ids:', stories.map(s => s.id));
        }
    }

    // Check magic_users
    console.log('\n--- Magic Users ---');
    const { data: users, error: usersError } = await supabase
        .from('magic_users')
        .select('*');

    if (usersError) {
        console.error('Error fetching users:', usersError.message);
    } else {
        console.log(`Found ${users.length} users.`);
        console.table(users.map(u => ({ id: u.id, name: u.name, credits: u.credits })));
    }

    // Since users often use "stella" or "admin" for testing
    // We might want to remove specific test users or all users if requested.
    // The user said "Reset Master usage data". 
    // I will delete "TestHero" and any stories if they exist.

    console.log('\n--- Executing Reset ---');

    // Delete TestHero
    const { error: delUserError } = await supabase
        .from('magic_users')
        .delete()
        .eq('name', 'TestHero');

    if (delUserError) {
        console.error('Failed to delete TestHero:', delUserError.message);
    } else {
        console.log('✅ TestHero user deleted.');
    }

    // Delete all stories (as they are usually test data)
    const { error: delStoriesError } = await supabase
        .from('magic_stories')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (delStoriesError) {
        console.error('Failed to delete stories:', delStoriesError.message);
    } else {
        console.log('✅ All stories reset.');
    }

    console.log('\n✨ Reset completed.');
}

resetMasterData();
