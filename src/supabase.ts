import { createClient } from '@supabase/supabase-js'
import { gallery as fallbackGallery, workshops as fallbackWorkshops, type Workshop } from './data'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

type WorkshopRow = {
  id: string
  title: string
  slug: string
  description: string
  short_description: string
  image_url: string | null
  date: string
  start_time: string
  end_time: string
  location: string
  price: number
  total_seats: number
  available_seats: number
  materials: string[]
  status: string
}

function formatWorkshopDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${value}T00:00:00`))
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' }).format(new Date(`1970-01-01T${value}`))
}

function toWorkshop(row: WorkshopRow): Workshop {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    description: row.description,
    image: row.image_url ?? fallbackWorkshops[0].image,
    date: formatWorkshopDate(row.date),
    time: `${formatTime(row.start_time)} – ${formatTime(row.end_time)}`,
    location: row.location,
    price: row.price,
    availableSeats: row.available_seats,
    totalSeats: row.total_seats,
    tag: row.available_seats === 0 ? 'SOLD OUT' : 'UPCOMING',
    materials: row.materials ?? [],
  }
}

export async function getWorkshops() {
  if (!supabase) return fallbackWorkshops
  const { data, error } = await supabase
    .from('workshops')
    .select('id,title,slug,description,short_description,image_url,date,start_time,end_time,location,price,total_seats,available_seats,materials,status')
    .eq('status', 'published')
    .order('date', { ascending: true })
  if (error) throw error
  return (data as WorkshopRow[]).map(toWorkshop)
}

type GalleryRow = { id: string; image_url: string; caption: string | null; sort_order: number }

export type AdminWorkshop = WorkshopRow & { created_at: string }
export type AdminRegistration = {
  id: string
  registration_id: string
  workshop_id: string
  full_name: string
  phone: string
  email: string
  number_of_seats: number
  status: string
  payment_status: string
  created_at: string
}
export type AdminGalleryItem = GalleryRow & { created_at: string }
export type AdminMessage = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  created_at: string
}

export async function getGallery() {
  if (!supabase) return fallbackGallery
  const { data, error } = await supabase
    .from('gallery')
    .select('id,image_url,caption,sort_order')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data as GalleryRow[]).map((row) => ({ image: row.image_url, caption: row.caption ?? 'Made together.' }))
}

export async function getAdminData() {
  if (!supabase) throw new Error('Supabase is not configured.')

  const [workshopsResult, registrationsResult, galleryResult, messagesResult] = await Promise.all([
    supabase.from('workshops').select('*').order('date', { ascending: true }),
    supabase.from('registrations').select('id,registration_id,workshop_id,full_name,phone,email,number_of_seats,status,payment_status,created_at').order('created_at', { ascending: false }),
    supabase.from('gallery').select('id,image_url,caption,sort_order,created_at').order('sort_order', { ascending: true }),
    supabase.from('contacts').select('id,name,email,phone,message,created_at').order('created_at', { ascending: false }),
  ])

  const failed = [workshopsResult, registrationsResult, galleryResult, messagesResult].find((result) => result.error)
  if (failed?.error) throw failed.error

  return {
    workshops: workshopsResult.data as AdminWorkshop[],
    registrations: registrationsResult.data as AdminRegistration[],
    gallery: galleryResult.data as AdminGalleryItem[],
    messages: messagesResult.data as AdminMessage[],
  }
}

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
