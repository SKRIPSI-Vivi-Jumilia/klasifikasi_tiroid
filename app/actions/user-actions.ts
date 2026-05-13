'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUsers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error: error?.message }
}

export async function toggleUserStatus(userId: string, currentStatus: string) {
  const supabase = await createClient()
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
  
  const { error } = await supabase
    .from('profiles')
    .update({ status: newStatus })
    .eq('id', userId)

  if (!error) revalidatePath('/dashboard/users')
  return { success: !error, error: error?.message }
}

// Note: Creating actual Auth users requires Supabase Admin API
// For this MVP, we manage the 'profiles' table.
