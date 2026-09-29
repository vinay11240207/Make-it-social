import { createClient } from '@supabase/supabase-js'
import type { Workshop } from './data'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export type RegistrationInput = {
  workshop: Workshop
  fullName: string
  phone: string
  email: string
  seats: number
  ageGroup: string
  instagram: string
  note: string
  source: string
}

export async function createRegistration(input: RegistrationInput) {
  if (!supabase) {
    await new Promise((resolve) => window.setTimeout(resolve, 650))
    return { registrationId: `MIS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, demo: true }
  }

  const { data, error } = await supabase
    .from('registrations')
    .insert({
      registration_id: `MIS-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      workshop_id: input.workshop.id,
      full_name: input.fullName,
      phone: input.phone,
      email: input.email,
      age_group: input.ageGroup,
      number_of_seats: input.seats,
      instagram_username: input.instagram,
      special_note: input.note,
      source: input.source,
      status: 'pending',
      payment_status: 'not_required',
    })
    .select('registration_id')
    .single()
  if (error) throw error
  return { registrationId: data.registration_id, demo: false }
}

export async function submitContact(input: { name: string; email: string; phone: string; message: string }) {
  if (!supabase) {
    await new Promise((resolve) => window.setTimeout(resolve, 450))
    return
  }
  const { error } = await supabase.from('contacts').insert(input)
  if (error) throw error
}
