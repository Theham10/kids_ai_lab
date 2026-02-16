'use server'

import { supabase } from '@/lib/supabase'

export async function performMagic(formData: { action: string; name?: string; userData?: any; userId?: string; credits?: number }) {
    const { action, name, userData, userId, credits } = formData

    try {
        if (action === 'register') {
            const { data, error } = await supabase
                .from('magic_users')
                .insert([userData])
                .select()
                .single()

            if (error) return { success: false, error: error.message, code: error.code }
            return { success: true, data }
        }

        if (action === 'login') {
            const { data, error } = await supabase
                .from('magic_users')
                .select('*')
                .eq('name', (name || '').trim())
                .single()

            if (error) return { success: false, error: error.message }
            return { success: true, data }
        }

        if (action === 'recover') {
            const { data, error } = await supabase
                .from('magic_users')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) return { success: false, error: error.message }
            return { success: true, data }
        }

        if (action === 'update-credits') {
            const { error } = await supabase
                .from('magic_users')
                .update({ credits })
                .eq('id', userId)

            if (error) return { success: false, error: error.message }
            return { success: true }
        }

        return { success: false, error: 'Invalid action' }
    } catch (err: any) {
        console.error('Server Action Error:', err)
        return { success: false, error: err.message || 'Internal Server Error' }
    }
}
