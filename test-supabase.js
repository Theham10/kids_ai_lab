const fs = require('fs');
const path = require('path');

// Manually read .env
const envPath = path.resolve(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseAnonKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkInfrastructure() {
    console.log('🔍 Checking Supabase Infrastructure...');

    try {
        // Check magic_users table
        const { data: users, error: usersError } = await supabase
            .from('magic_users')
            .select('count', { count: 'exact', head: true });

        if (usersError) {
            if (usersError.code === 'PGRST116' || usersError.message.includes('not found')) {
                console.log('❌ magic_users table: NOT FOUND');
            } else {
                console.log('⚠️ magic_users table error:', usersError.message);
            }
        } else {
            console.log('✅ magic_users table: ACTIVE');

            // Fetch some users to verify data
            const { data: userData, error: fetchError } = await supabase
                .from('magic_users')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (fetchError) {
                console.log('⚠️ Failed to fetch users:', fetchError.message);
            } else if (userData && userData.length > 0) {
                console.log('📊 Recent Users:');
                console.table(userData.map(u => ({
                    id: u.id.substring(0, 8) + '...',
                    name: u.name,
                    tier: u.tier,
                    credits: u.credits,
                    created: u.created_at
                })));
            } else {
                console.log('ℹ️ No users found in magic_users table. Attempting to create a test user...');
                const { data: newUser, error: createError } = await supabase
                    .from('magic_users')
                    .insert([
                        { name: 'TestHero', email: 'test@example.com', credits: 5, tier: 'Free' }
                    ])
                    .select();

                if (createError) {
                    console.log('❌ Failed to create test user:', createError.message);
                } else {
                    console.log('✅ Test user created successfully:', newUser[0].name);
                }
            }
        }

        // Check magic_stories table
        const { data: stories, error: storiesError } = await supabase
            .from('magic_stories')
            .select('count', { count: 'exact', head: true });

        if (storiesError) {
            if (storiesError.code === 'PGRST116' || storiesError.message.includes('not found')) {
                console.log('❌ magic_stories table: NOT FOUND');
            } else {
                console.log('⚠️ magic_stories table error:', storiesError.message);
            }
        } else {
            console.log('✅ magic_stories table: ACTIVE');
        }

    } catch (err) {
        console.error('💥 Unexpected error:', err.message);
    }
}

checkInfrastructure();
