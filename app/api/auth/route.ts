import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, name, userData, userId } = body;

        if (action === 'register') {
            const { data, error } = await supabase
                .from('magic_users')
                .insert([userData])
                .select()
                .single();

            if (error) {
                return NextResponse.json({ error: error.message, code: error.code }, { status: 400 });
            }
            return NextResponse.json({ data });
        }

        if (action === 'login') {
            const { data, error } = await supabase
                .from('magic_users')
                .select('*')
                .eq('name', name.trim())
                .single();

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
            return NextResponse.json({ data });
        }

        if (action === 'recover') {
            const { data, error } = await supabase
                .from('magic_users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
            return NextResponse.json({ data });
        }

        if (action === 'update-credits') {
            const { error } = await supabase
                .from('magic_users')
                .update({ credits: body.credits })
                .eq('id', userId);

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (err: any) {
        console.error('Auth API Error:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
