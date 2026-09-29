export type Workshop = {
  id: string
  slug: string
  title: string
  shortDescription: string
  description: string
  image: string
  date: string
  time: string
  location: string
  price: number
  availableSeats: number
  totalSeats: number
  tag: string
  materials: string[]
}

export const workshops: Workshop[] = [
  {
    id: 'clay-coffee',
    slug: 'clay-and-coffee',
    title: 'Clay & Coffee',
    shortDescription: 'Shape something with your hands and spend your Sunday creating.',
    description: 'A slow, sunny Sunday of clay, coffee and good conversations. No experience needed — just bring your curious self.',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=85',
    date: 'Sunday, 5 October',
    time: '11:00 AM – 1:30 PM',
    location: 'The Courtyard, Jaipur',
    price: 699,
    availableSeats: 10,
    totalSeats: 25,
    tag: 'THIS SUNDAY',
    materials: ['Air-dry clay', 'Tools & textures', 'Coffee and chai', 'Take-home creation'],
  },
  {
    id: 'sun-print',
    slug: 'sun-print-studio',
    title: 'Sun Print Studio',
    shortDescription: 'Collect a little Jaipur sunshine and turn it into art.',
    description: 'Make one-of-a-kind botanical prints using light, leaves and a little bit of magic.',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=85',
    date: 'Sunday, 12 October',
    time: '4:00 PM – 6:00 PM',
    location: 'The Courtyard, Jaipur',
    price: 599,
    availableSeats: 18,
    totalSeats: 24,
    tag: 'NEW',
    materials: ['Cyanotype paper', 'Pressed botanicals', 'All inks & brushes', 'A little surprise'],
  },
  {
    id: 'zine-club',
    slug: 'make-a-zine',
    title: 'Make A Zine',
    shortDescription: 'Cut, paste and publish a tiny magazine of your own.',
    description: 'A playful collage afternoon for big feelings, tiny stories and zero rules.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=85',
    date: 'Sunday, 19 October',
    time: '11:00 AM – 1:00 PM',
    location: 'The Courtyard, Jaipur',
    price: 499,
    availableSeats: 0,
    totalSeats: 20,
    tag: 'SOLD OUT',
    materials: ['Paper buffet', 'Stamps & stickers', 'Scissors and glue', 'Your own mini zine'],
  },
]

export const gallery = [
  { image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=800&q=85', caption: 'Made by us, not bought.' },
  { image: 'https://images.unsplash.com/photo-1594784055623-7e3226d6d22e?auto=format&fit=crop&w=800&q=85', caption: 'Sunday well spent 💙' },
  { image: 'https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=800&q=85', caption: 'Creativity looks good on everyone.' },
  { image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=800&q=85', caption: 'A little messy, very happy.' },
  { image: 'https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?auto=format&fit=crop&w=800&q=85', caption: 'Come as you are.' },
  { image: 'https://images.unsplash.com/photo-1456081445129-830eb8d4bfc6?auto=format&fit=crop&w=800&q=85', caption: 'Tiny details, big joy.' },
]
