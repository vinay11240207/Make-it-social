import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, Route, Routes, useParams } from 'react-router-dom'
import {
  ArrowDownRight, ArrowRight, CalendarDays, Camera, Check, ChevronDown, Clock3,
  Heart, Mail, MapPin, Menu, Palette, Pencil, Send, Scissors, Sparkles, Users, X,
} from 'lucide-react'
import { gallery, workshops, type Workshop } from './data'
import { createAnnouncement, createGalleryItem, createRegistration, createWorkshop, getAdminData, getAnnouncements, getGallery, getWorkshops, saveSiteSetting, submitContact, supabase, updateGalleryOrder, type AdminGalleryItem, type AdminMessage, type AdminRegistration, type AdminWorkshop, type Announcement, type SiteSetting } from './supabase'

const money = (value: number) => `₹${value.toLocaleString('en-IN')}`

const featureItems = [
  { icon: Palette, title: 'CREATE', text: 'Try different art & craft activities.' },
  { icon: Users, title: 'CONNECT', text: 'Meet people who love trying new things.' },
  { icon: Heart, title: 'EXPERIENCE', text: 'Turn an ordinary Sunday into something memorable.' },
  { icon: Sparkles, title: 'EXPRESS', text: 'There are no perfect creations here.' },
  { icon: Scissors, title: 'MAKE', text: 'Cut, fold, paint, shape and take it home.' },
  { icon: Camera, title: 'COMMUNITY', text: 'A space where everyone is welcome.' },
]

function Logo() {
  return <Link className="logo" to="/" aria-label="Make It Sociall home"><img src="/brand/make-it-sociall-logo.png" alt="Make It Sociall" /></Link>
}

function Button({ children, href, variant = 'primary', onClick, type = 'button' }: { children: ReactNode; href?: string; variant?: 'primary' | 'outline' | 'text'; onClick?: () => void; type?: 'button' | 'submit' }) {
  if (href) return <Link to={href} className={`button ${variant}`}>{children}</Link>
  return <button className={`button ${variant}`} onClick={onClick} type={type}>{children}</button>
}

function Header() {
  const [open, setOpen] = useState(false)
  return <header className="site-header">
    <div className="container nav-wrap"><Logo />
      <nav className={open ? 'nav open' : 'nav'} aria-label="Main navigation">
        {['Workshops', 'About', 'Gallery', 'Community', 'Contact'].map((item) => <Link key={item} to={`/${item.toLowerCase()}`} onClick={() => setOpen(false)}>{item}</Link>)}
        <Button href="/workshops">Join a workshop <ArrowRight size={16} /></Button>
      </nav>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
    </div>
  </header>
}

function Footer() {
  return <footer><div className="container footer-grid">
    <div><Logo /><p className="footer-copy">Art • Workshops • Community<br /><span>Made with creativity & a little chaos. 💙</span></p></div>
    <div><p className="eyebrow">Find your way</p><div className="footer-links"><Link to="/workshops">Workshops</Link><Link to="/about">Who are we?</Link><Link to="/gallery">Gallery</Link><Link to="/contact">Contact</Link></div></div>
    <div><p className="eyebrow">Come say hi</p><p className="footer-copy">Jaipur, Rajasthan<br /><a href="https://instagram.com/makeitsociall">@makeitsociall ↗</a><br /><a href="mailto:hello@makeitsociall.com">hello@makeitsociall.com</a></p></div>
  </div></footer>
}

function Doodle({ children, className = '' }: { children: ReactNode; className?: string }) { return <span className={`doodle ${className}`}>{children}</span> }

function SectionTitle({ kicker, title, children }: { kicker?: string; title: ReactNode; children?: ReactNode }) {
  return <div className="section-title">{kicker && <p className="eyebrow">{kicker}</p>}<h2>{title}</h2>{children}</div>
}

function WorkshopCard({ workshop }: { workshop: Workshop }) {
  const soldOut = workshop.availableSeats === 0
  return <article className="workshop-card">
    <div className="card-image"><img src={workshop.image} alt={workshop.title} /><span className={soldOut ? 'sticker sold' : 'sticker'}>{soldOut ? 'SOLD OUT' : workshop.tag}</span></div>
    <div className="card-body"><div className="meta"><span><CalendarDays size={14} /> {workshop.date}</span><span><Clock3 size={14} /> {workshop.time.split(' – ')[0]}</span></div>
      <h3>{workshop.title}</h3><p>{workshop.shortDescription}</p><div className="card-foot"><strong>{money(workshop.price)}</strong>{soldOut ? <span className="muted">Join the waitlist ↗</span> : <Link to={`/workshops/${workshop.slug}`}>View details <ArrowRight size={15} /></Link>}</div>
    </div>
  </article>
}

function useLiveWorkshops() {
  const [items, setItems] = useState(workshops)
  useEffect(() => { getWorkshops().then(setItems).catch(() => undefined) }, [])
  return items
}

function useLiveGallery() {
  const [items, setItems] = useState(gallery)
  useEffect(() => { getGallery().then(setItems).catch(() => undefined) }, [])
  return items
}

function useAnnouncements() {
  const [items, setItems] = useState<Announcement[]>([])
  useEffect(() => { getAnnouncements().then(setItems).catch(() => undefined) }, [])
  return items
}

function Home() {
  const [workshopOpen, setWorkshopOpen] = useState(false)
  const liveWorkshops = useLiveWorkshops()
  const announcements = useAnnouncements()
  return <><Header /><main>
    {announcements[0] && <div className="announcement-banner container"><strong>{announcements[0].title}</strong><span>{announcements[0].message}</span></div>}
    <section className="hero container">
      <div className="hero-copy"><p className="eyebrow">ART • WORKSHOPS • COMMUNITY</p><h1>Not just<br /><em>an art</em> workshop.</h1><p className="lede">A creative space where art meets people. Come to try something new, express yourself, meet people and make memories along the way.</p><div className="hero-actions"><Button href="/workshops">Join this Sunday <ArrowRight size={18} /></Button><Button href="/about" variant="outline">Our little story</Button></div><Doodle className="hero-note">make something<br />meet someone new :)</Doodle></div>
      <div className="hero-art"><div className="blue-sun"></div><div className="hero-photo logo-photo"><img src="/brand/make-it-sociall-logo.png" alt="Make It Sociall illustrated logo" /></div><button className="hero-arrow" onClick={() => setWorkshopOpen(true)} aria-label="Open this Sunday's workshop">Sunday plans <ArrowDownRight /></button><span className="hero-star">✦</span></div>
    </section>
    <section className="statement"><div className="container statement-inner"><span className="big-icon">✹</span><div><p className="eyebrow">The whole point</p><h2>Art is better<br /><em>when it's social.</em></h2><p>We're building a space where creativity isn't about being perfect. It's about trying. Making. Laughing. Connecting. And taking something home that you made yourself.</p></div><Doodle>no pressure,<br />just good vibes →</Doodle></div></section>
    <section className="container section-pad"><SectionTitle kicker="So... what do we actually do?" title="A little bit of this. A lot of together."><p>Come for the craft, stay for the people.</p></SectionTitle><div className="feature-grid">{featureItems.map(({ icon: Icon, title, text }, i) => <div className={`feature-card tone-${i + 1}`} key={title}><span className="craft-icon"><Icon size={28} strokeWidth={1.7} /></span><h3>{title}</h3><p>{text}</p></div>)}</div></section>
    <section className="blue-section"><div className="container"><SectionTitle kicker="Every Sunday" title="Sunday is for making."><p>New workshop. New idea. New people. Every Sunday.</p></SectionTitle><div className="workshop-grid">{liveWorkshops.slice(0, 2).map((workshop) => <WorkshopCard key={workshop.id} workshop={workshop} />)}</div><div className="center"><Button href="/workshops" variant="outline">See all workshops <ArrowRight size={16} /></Button></div></div></section>
    <section className="container community-tease"><div className="community-card"><div><p className="eyebrow">A note for the solo creatives</p><h2>Come alone.<br /><em>Leave with people to talk to.</em></h2><Button href="/community" variant="outline">Find your people <ArrowRight size={16} /></Button></div><div className="people-stamp"><Users size={38} /><span>there's room<br />for all ✦</span></div></div></section>
    <InstagramStrip />
  </main><MobileCta /><Footer />{workshopOpen && <div className="workshop-popover-backdrop" role="presentation" onClick={() => setWorkshopOpen(false)}><section className="workshop-popover" role="dialog" aria-modal="true" aria-labelledby="workshop-popover-title" onClick={(event) => event.stopPropagation()}><button className="popover-close" onClick={() => setWorkshopOpen(false)} aria-label="Close workshop preview">×</button><img src={liveWorkshops[0].image} alt="" /><div className="popover-content"><p className="eyebrow">{liveWorkshops[0].date} · {liveWorkshops[0].time.split(' – ')[0]}</p><h2 id="workshop-popover-title">{liveWorkshops[0].title}</h2><p>{liveWorkshops[0].shortDescription}</p><div className="popover-details"><span>{money(liveWorkshops[0].price)} per person</span><span>{liveWorkshops[0].availableSeats} seats left</span></div><Button href={`/workshops/${liveWorkshops[0].slug}`}>See workshop <ArrowRight size={16} /></Button></div></section></div>}</>
}

function InstagramStrip() {
  return   <section className="container insta"><div className="insta-head"><div><p className="eyebrow">Follow the creative chaos</p><h2>@makeitsociall</h2></div><a href="https://instagram.com/makeitsociall" target="_blank" rel="noreferrer"><Camera size={18} /> Follow along ↗</a></div><div className="insta-grid">{gallery.slice(0, 4).map((item) => <img key={item.image} src={item.image} alt={item.caption} loading="lazy" />)}</div></section>
}

function MobileCta() { return <div className="mobile-cta"><Link to="/workshops">Join Sunday's workshop <ArrowRight size={16} /></Link></div> }

function PageIntro({ kicker, title, copy }: { kicker: string; title: ReactNode; copy: string }) { return <section className="page-intro container"><p className="eyebrow">{kicker}</p><h1>{title}</h1><p className="lede">{copy}</p></section> }

function Workshops() { const liveWorkshops = useLiveWorkshops(); return <><Header /><main><PageIntro kicker="The good stuff" title={<>What's happening<br /><em>this Sunday?</em></>} copy="New ideas, new people, new reasons to leave the house. Pick your kind of creative." /><section className="container section-pad"><div className="filter-row"><span>All workshops <strong>{liveWorkshops.length}</strong></span><button>Upcoming <ChevronDown size={15} /></button></div><div className="workshop-list">{liveWorkshops.map((w) => <WorkshopCard key={w.id} workshop={w} />)}</div></section></main><MobileCta /><Footer /></> }

function WorkshopDetail() {
  const { slug } = useParams(); const workshop = useLiveWorkshops().find((item) => item.slug === slug)
  if (!workshop) return <><Header /><EmptyState title="That workshop wandered off." copy="Let's find you something else creative." /><Footer /></>
  return <><Header /><main><section className="detail-hero container"><div className="detail-image"><img src={workshop.image} alt={workshop.title} /><span className="sticker">{workshop.tag}</span></div><div className="detail-copy"><p className="eyebrow">{workshop.date}</p><h1>{workshop.title}</h1><p className="lede">{workshop.description}</p><div className="detail-facts"><span><Clock3 /> {workshop.time}</span><span><MapPin /> {workshop.location}</span><span><Users /> {workshop.availableSeats || 'No'} seats left</span></div><div className="price-row"><strong>{money(workshop.price)}</strong><small>per person • materials included</small></div>{workshop.availableSeats ? <Button href={`/register?workshop=${workshop.slug}`}>Register for this workshop <ArrowRight size={17} /></Button> : <Button variant="outline">Join the waitlist <ArrowRight size={17} /></Button>}</div></section><section className="container detail-lower"><div><h2>What you'll do</h2><p>We'll slow down, switch off and make something with our hands. A friendly guide will take you through each step, but there is plenty of room to make it your own.</p><h2>What's included</h2><ul className="check-list">{workshop.materials.map((m) => <li key={m}><Check size={16} /> {m}</li>)}</ul></div><aside className="note-card"><Sparkles /><h3>Who can join?</h3><p>Beginners, students, friends, couples, solo visitors — anyone who wants to try something creative.</p><hr /><h3>What to bring?</h3><p>Just yourself, comfy clothes and a little curiosity. We have got the rest.</p></aside></section></main><MobileCta /><Footer /></>
}

function About() { return <><Header /><main><PageIntro kicker="A little about us" title={<>We're here to make<br /><em>creativity social.</em></>} copy="A space to create, connect, meet new people and try something different. Welcome to Make It Sociall." /><section className="container story-grid"><div className="story-image"><img src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1000&q=85" alt="Colourful art supplies on a table" /></div><div className="story-text"><p className="eyebrow">Our little idea</p><h2>What if an art workshop was also about <em>meeting people?</em></h2><p>Laughing with strangers? Trying something you've never done? Making something imperfect and being proud of it?</p><p>Make It Sociall started with a simple idea: creativity feels better when it has company. So we made a place for that — Sunday workshops, tiny rituals and room for everyone.</p><Doodle>make room<br />for all ✦</Doodle></div></section><section className="container values"><div><span>01</span><h3>Our idea</h3><p>Creativity is a practice, not a performance.</p></div><div><span>02</span><h3>Our community</h3><p>Come solo, bring friends, leave with both.</p></div><div><span>03</span><h3>Our Sundays</h3><p>One little plan to look forward to every week.</p></div></section></main><Footer /></> }

function Gallery() { const liveGallery = useLiveGallery(); return <><Header /><main><PageIntro kicker="Little moments" title={<>Fresh creations<br /><em>from the community.</em></>} copy="A scrapbook of paint-stained hands, proud smiles and the things we made together." /><section className="container gallery-grid">{liveGallery.map((item, index) => <figure key={item.image} className={`gallery-item item-${index + 1}`}>{'mediaType' in item && item.mediaType === 'video' ? <video src={item.image} controls playsInline /> : 'mediaType' in item && item.mediaType === 'instagram' ? <a href={item.image} target="_blank" rel="noreferrer"><img src="/brand/not-just-art-poster.png" alt={`${item.caption} Open Instagram Reel`} /></a> : <img src={item.image} alt={item.caption} loading="lazy" />}<figcaption>{item.caption}</figcaption></figure>)}</section></main><Footer /></> }

function Community() { return <><Header /><main><PageIntro kicker="You belong here" title={<>Come alone.<br /><em>Leave with people.</em></>} copy="You don't need a group chat, an art degree or a plan. Just show up." /><section className="container community-list">{[['Coming solo?', 'Totally okay.', 'We will save you a spot at a table and introduce you to someone lovely.'], ['Bringing your friends?', 'Even better.', 'Make something together, then make plans for next Sunday.'], ['Never tried art before?', 'Perfect.', 'Our workshops are made for curious beginners and happy accidents.'], ['Already creative?', 'Come make something new.', 'Bring your big ideas. We bring the materials and the snacks.']].map(([q, answer, text]) => <div className="community-row" key={q}><span className="community-number">✦</span><div><p className="eyebrow">{q}</p><h2>{answer}</h2><p>{text}</p></div><ArrowRight /></div>)}</section></main><MobileCta /><Footer /></> }

function Contact() {
  const [sent, setSent] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState('')
  async function onSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); setError(''); const form = new FormData(event.currentTarget); try { await submitContact({ name: String(form.get('name')), email: String(form.get('email')), phone: String(form.get('phone')), message: String(form.get('message')) }); setSent(true) } catch { setError('Oops! Something got a little messy. Let’s try that again.') } finally { setBusy(false) } }
  return <><Header /><main><PageIntro kicker="Say hello" title={<>Let's make<br /><em>something happen.</em></>} copy="Questions, collabs, workshop ideas or just a friendly hello — our inbox is open." /><section className="container contact-grid"><div className="contact-details"><div><MapPin /><h3>Find us</h3><p>Jaipur, Rajasthan<br />The good kind of somewhere.</p></div><div><Camera /><h3>Follow along</h3><p>@makeitsociall<br />Creative chaos, daily.</p></div><div><Mail /><h3>Write to us</h3><p>hello@makeitsociall.com<br />We usually reply with emojis.</p></div></div>{sent ? <div className="success-box"><Sparkles /><h2>Message received!</h2><p>We'll be in your inbox soon. Until then, go make something lovely.</p><Button href="/workshops">Find a workshop <ArrowRight size={16} /></Button></div> : <form className="form-card" onSubmit={onSubmit}><label>Name *<input name="name" required placeholder="Your lovely name" /></label><label>Email *<input name="email" type="email" required placeholder="you@example.com" /></label><label>Phone<input name="phone" placeholder="+91 ..." /></label><label>Message *<textarea name="message" required rows={4} placeholder="Tell us what's on your mind..." /></label>{error && <p className="form-error">{error}</p>}<Button type="submit">{busy ? 'Sending...' : <>Send message <Send size={16} /></>}</Button></form>}</section></main><Footer /></>
}

function Register() {
  const liveWorkshops = useLiveWorkshops()
  const workshopSlug = new URLSearchParams(window.location.search).get('workshop'); const initial = liveWorkshops.find((w) => w.slug === workshopSlug) ?? liveWorkshops[0]
  const [selected, setSelected] = useState(initial); const [step, setStep] = useState<'form' | 'summary'>('form'); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [result, setResult] = useState<{ id: string; data: FormData } | null>(null)
  useEffect(() => { const next = liveWorkshops.find((w) => w.slug === workshopSlug); if (next) setSelected(next) }, [liveWorkshops, workshopSlug])
  function review(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); if (Number(data.get('seats')) > selected.availableSeats) { setError(`Only ${selected.availableSeats} seats are left for this one.`); return } setError(''); setResult({ id: '', data }); setStep('summary') }
  async function confirm() { if (!result) return; setBusy(true); try { const data = result.data; const response = await createRegistration({ workshop: selected, fullName: String(data.get('fullName')), phone: String(data.get('phone')), email: String(data.get('email')), seats: Number(data.get('seats')), ageGroup: String(data.get('ageGroup')), instagram: String(data.get('instagram')), note: String(data.get('note')), source: String(data.get('source')) }); setResult({ id: response.registrationId, data }) } catch { setError('Oops! Something got a little messy. Let’s try that again.') } finally { setBusy(false) } }
  if (result?.id)   return <><Header /><main><section className="container registration-success"><div className="success-sparkles">🎨 ✨ 🫶</div><p className="eyebrow">Registration confirmed</p><h1>You're in!</h1><p className="lede">Your Sunday just got more creative.</p><div className="confirmation"><span>Registration ID <strong>{result.id}</strong></span><span>Workshop <strong>{selected.title}</strong></span><span>Date & time <strong>{selected.date}<br />{selected.time}</strong></span><span>Seats <strong>{String(result.data.get('seats'))}</strong></span><span>Amount <strong>{money(selected.price * Number(result.data.get('seats')))}</strong></span></div><Button href="/">Back to home <ArrowRight size={16} /></Button></section></main><Footer /></>
  return <><Header /><main><section className="container register-layout"><div><p className="eyebrow">Save your spot</p><h1>Let's make<br /><em>something.</em></h1><p className="lede">Fill this in, then we'll keep a seat (and some good vibes) for you.</p><div className="register-note"><Pencil size={18} /> No payment today — pay at the workshop.</div></div>{step === 'summary' && result ? <div className="summary-card"><p className="eyebrow">Check your details</p><h2>Nearly there ✦</h2><div className="summary-line"><span>Workshop</span><strong>{selected.title}</strong></div><div className="summary-line"><span>Date</span><strong>{selected.date}</strong></div><div className="summary-line"><span>Time</span><strong>{selected.time}</strong></div><div className="summary-line"><span>Seats</span><strong>{String(result.data.get('seats'))}</strong></div><div className="summary-total"><span>Total</span><strong>{money(selected.price * Number(result.data.get('seats')))}</strong></div>{error && <p className="form-error">{error}</p>}<Button onClick={confirm}>{busy ? 'Saving your spot...' : <>Confirm my spot <ArrowRight size={16} /></>}</Button><button className="back-link" onClick={() => setStep('form')}>← Edit details</button></div> : <form className="form-card registration-form" onSubmit={review}><label>Workshop *<select value={selected.slug} onChange={(e) => setSelected(liveWorkshops.find((w) => w.slug === e.target.value) ?? selected)}>{liveWorkshops.filter((w) => w.availableSeats > 0).map((w) => <option key={w.slug} value={w.slug}>{w.title} — {w.date}</option>)}</select></label><div className="two-col"><label>Full name *<input name="fullName" required placeholder="Your name" /></label><label>Phone *<input name="phone" required pattern="^(\\+91[\\s-]?)?[6-9]\\d{9}$" placeholder="+91 98765 43210" /></label></div><div className="two-col"><label>Email *<input name="email" type="email" required placeholder="you@example.com" /></label><label>Seats *<input name="seats" type="number" min="1" max={selected.availableSeats} defaultValue="1" required /></label></div><div className="two-col"><label>Age group<select name="ageGroup"><option>18–24</option><option>25–34</option><option>35+</option><option>Prefer not to say</option></select></label><label>Instagram username<input name="instagram" placeholder="@yourhandle" /></label></div><label>How did you hear about us?<select name="source"><option>Instagram</option><option>Friend</option><option>Google</option><option>WhatsApp</option><option>Other</option></select></label><label>Anything you'd like to tell us?<textarea name="note" rows={3} placeholder="Dietary notes, questions, fun facts..." /></label><label className="checkbox"><input type="checkbox" required /> I agree to receive workshop-related updates.</label>{error && <p className="form-error">{error}</p>}<Button type="submit">Review my spot <ArrowRight size={16} /></Button></form>}</section></main><Footer /></>
}

function EmptyState({ title, copy }: { title: string; copy: string }) { return <section className="empty-state container"><Sparkles /><h1>{title}</h1><p>{copy}</p><Button href="/workshops">See workshops <ArrowRight size={16} /></Button></section> }

function TeamAccess() {
  const [entered, setEntered] = useState(false); const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const route = window.location.pathname
  if (entered) return <AdminDashboard />
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); setError('')
    if (!supabase) { setError('Team access is not connected yet. Add the Supabase environment variables to continue securely.'); return }
    setBusy(true)
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email: String(form.get('email')), password: String(form.get('password')) })
    if (authError || !data.user) { setError('We could not verify those team details. Please try again.'); setBusy(false); return }
    const { data: admin, error: roleError } = await supabase.from('admins').select('user_id').eq('user_id', data.user.id).maybeSingle()
    if (roleError || !admin) { await supabase.auth.signOut(); setError('This space is for the Make It Sociall team.'); setBusy(false); return }
    setEntered(true); setBusy(false)
  }
  return <main className="team-access"><div className="team-card"><Logo /><p className="eyebrow">Team access</p><h1>Enter the studio.</h1><p>Shhh... this side is for the team 🤫</p><form onSubmit={submit}><label>Email<input name="email" type="email" required placeholder="you@makeitsociall.com" /></label><label>Password<input name="password" type="password" required placeholder="••••••••" /></label>{error && <p className="form-error">{error}</p>}<Button type="submit">{busy ? 'Checking...' : <>Enter the studio <ArrowRight size={16} /></>}</Button></form><Link to="/" className="back-link">← Back to the public site</Link><small>Signed in securely with Supabase Auth when configured.</small></div><span className="team-doodle">for the<br />creative crew ✦</span><span className="team-route">{route}</span></main>
}

function AdminDashboard() {
  const [tab, setTab] = useState('Overview')
  const [data, setData] = useState<{ workshops: AdminWorkshop[]; registrations: AdminRegistration[]; gallery: AdminGalleryItem[]; messages: AdminMessage[]; announcements: Announcement[]; settings: SiteSetting[]; migrationRequired: boolean } | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [selectedWorkshop, setSelectedWorkshop] = useState('')
  const nav = ['Overview', 'Workshops', 'Registrations', 'Gallery', 'Messages', 'Announcements', 'Settings']

  const reload = () => getAdminData().then(setData).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Could not load studio data.'))
  useEffect(() => { reload() }, [])

  const registrations = data?.registrations ?? []
  const confirmedSeats = registrations.filter((item) => item.status === 'confirmed').reduce((total, item) => total + item.number_of_seats, 0)
  const seatsRemaining = (data?.workshops ?? []).reduce((total, item) => total + item.available_seats, 0)
  const renderTable = () => {
    if (tab === 'Workshops') return <div className="admin-list">{(data?.workshops ?? []).map((item) => <div className="admin-row" key={item.id}><strong>{item.title}</strong><span>{item.date} · {item.available_seats}/{item.total_seats} seats</span><small>{item.status}</small></div>)}</div>
    if (tab === 'Registrations') return <div className="admin-list">{registrations.filter((item) => !selectedWorkshop || item.workshop_id === selectedWorkshop).map((item) => <div className="admin-row" key={item.id}><strong>{item.full_name}</strong><span>{item.email} · {item.number_of_seats} seat(s)</span><small>{item.status}</small></div>)}</div>
    if (tab === 'Gallery') return <div className="admin-list">{(data?.gallery ?? []).map((item, index) => <div className="admin-row" draggable key={item.id} onDragStart={(event) => event.dataTransfer.setData('text/plain', String(index))} onDragOver={(event) => event.preventDefault()} onDrop={async (event) => { const from = Number(event.dataTransfer.getData('text/plain')); const next = [...(data?.gallery ?? [])]; const [moved] = next.splice(from, 1); next.splice(index, 0, moved); setData({ ...data!, gallery: next }); await updateGalleryOrder(next).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Could not save gallery order.')) }}><strong>{item.caption || 'Untitled media'}</strong><span>{item.media_type} · {item.image_url}</span><small>Drag to reorder</small></div>)}</div>
    if (tab === 'Messages') return <div className="admin-list">{(data?.messages ?? []).map((item) => <div className="admin-row" key={item.id}><strong>{item.name}</strong><span>{item.email} · {item.message}</span><small>{new Date(item.created_at).toLocaleDateString('en-IN')}</small></div>)}</div>
    if (tab === 'Announcements') return <div className="admin-list">{(data?.announcements ?? []).map((item) => <div className="admin-row" key={item.id}><strong>{item.title}</strong><span>{item.message}</span><small>{new Date(item.created_at).toLocaleDateString('en-IN')}</small></div>)}</div>
    return <div className="settings-list">{(data?.settings ?? []).map((item) => <div className="admin-row" key={item.key}><strong>{item.key}</strong><span>{item.value}</span></div>)}</div>
  }

  async function run(action: () => Promise<unknown>) { setBusy(true); setError(''); try { await action(); await reload() } catch (reason: unknown) { setError(reason instanceof Error ? reason.message : 'The change could not be saved.') } finally { setBusy(false) } }
  const form = (event: FormEvent<HTMLFormElement>) => new FormData(event.currentTarget)
  const workshopForm = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const values = form(event); const title = String(values.get('title')); run(() => createWorkshop({ title, slug: String(values.get('slug')), description: String(values.get('description')), short_description: String(values.get('short_description')), image_url: String(values.get('image_url') || ''), date: String(values.get('date')), start_time: String(values.get('start_time')), end_time: String(values.get('end_time')), location: String(values.get('location')), price: Number(values.get('price')), total_seats: Number(values.get('total_seats')), available_seats: Number(values.get('total_seats')), materials: String(values.get('materials')).split(',').map((item) => item.trim()).filter(Boolean), status: String(values.get('status')) })) }
  const galleryForm = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const values = form(event); run(() => createGalleryItem({ image_url: String(values.get('image_url')), caption: String(values.get('caption')), media_type: String(values.get('media_type')) as 'image' | 'video' | 'instagram', sort_order: data?.gallery.length ?? 0 })) }
  const announcementForm = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const values = form(event); run(() => createAnnouncement({ title: String(values.get('title')), message: String(values.get('message')) })) }
  const settingsForm = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const values = form(event); const entries = Object.entries(Object.fromEntries(values.entries())); run(() => Promise.all(entries.map(([key, value]) => saveSiteSetting(key, String(value))))); }
  const workshopEditor = <form className="admin-form" onSubmit={workshopForm}><h2>Add a workshop</h2><div className="two-col"><input name="title" required placeholder="Workshop title" /><input name="slug" required placeholder="url-slug" /></div><div className="two-col"><input name="date" type="date" required /><input name="image_url" placeholder="Cover image URL" /></div><div className="two-col"><input name="start_time" type="time" required /><input name="end_time" type="time" required /></div><div className="two-col"><input name="location" required placeholder="Location" /><input name="price" type="number" min="0" required placeholder="Price" /></div><div className="two-col"><input name="total_seats" type="number" min="1" required placeholder="Total seats" /><select name="status"><option value="published">Published</option><option value="draft">Draft</option></select></div><input name="short_description" required placeholder="Short description" /><textarea name="description" required placeholder="Full description" /><input name="materials" placeholder="Materials, comma separated" /><Button type="submit">{busy ? 'Saving...' : 'Create workshop'}</Button></form>
  const galleryEditor = <form className="admin-form" onSubmit={galleryForm}><h2>Add photo, video, or Instagram Reel</h2><input name="image_url" type="url" required placeholder="Direct image/video URL or Instagram Reel URL" /><div className="two-col"><input name="caption" placeholder="Caption" /><select name="media_type"><option value="image">Photo</option><option value="video">Video</option><option value="instagram">Instagram Reel</option></select></div><Button type="submit">{busy ? 'Saving...' : 'Add to gallery'}</Button><small>Gallery items below can be dragged and dropped to reorder.</small></form>
  const announcementEditor = <form className="admin-form" onSubmit={announcementForm}><h2>Notify everyone</h2><input name="title" required placeholder="Announcement title" /><textarea name="message" required placeholder="Message shown to visitors" /><Button type="submit">{busy ? 'Sending...' : 'Publish notification'}</Button></form>
  const settingsEditor = <form className="admin-form" onSubmit={settingsForm}><h2>Studio settings</h2><input name="brand_name" defaultValue={data?.settings.find((item) => item.key === 'brand_name')?.value} placeholder="Brand name" /><input name="contact_email" defaultValue={data?.settings.find((item) => item.key === 'contact_email')?.value} placeholder="Contact email" /><input name="contact_phone" defaultValue={data?.settings.find((item) => item.key === 'contact_phone')?.value} placeholder="Contact phone" /><input name="about_text" defaultValue={data?.settings.find((item) => item.key === 'about_text')?.value} placeholder="About us" /><div className="two-col"><input name="people_connected" type="number" defaultValue={data?.settings.find((item) => item.key === 'people_connected')?.value} placeholder="People connected" /><input name="workshops_done" type="number" defaultValue={data?.settings.find((item) => item.key === 'workshops_done')?.value} placeholder="Workshops done" /></div><Button type="submit">{busy ? 'Saving...' : 'Save settings'}</Button></form>
  return <main className="dashboard"><aside className="dash-sidebar"><Logo /><p className="eyebrow">Team studio</p><nav>{nav.map((item) => <button className={tab === item ? 'active' : ''} key={item} onClick={() => setTab(item)}>{item}</button>)}</nav><Link to="/" className="back-link">← View public site</Link></aside><section className="dash-main"><div className="dash-top"><div><p className="eyebrow">Good morning, team ✦</p><h1>{tab}</h1></div><div className="team-avatar">MS</div></div>{error && <div className="form-error dashboard-error">Could not save/load Supabase data: {error}</div>}{data?.migrationRequired && <div className="dashboard-notice">Run <strong>supabase/admin_features.sql</strong> in the Supabase SQL Editor to enable Announcements and Settings.</div>}{!data && !error && <div className="dash-panel"><p>Loading your studio data...</p></div>}{data && tab === 'Overview' && <><div className="stats-grid"><div><span>Workshops done</span><strong>{data.settings.find((item) => item.key === 'workshops_done')?.value || data.workshops.length}</strong><small>Studio setting</small></div><div><span>Connected people</span><strong>{data.settings.find((item) => item.key === 'people_connected')?.value || confirmedSeats}</strong><small>Studio setting</small></div><div><span>Seats remaining</span><strong>{seatsRemaining}</strong><small>Across upcoming workshops</small></div><div><span>New messages</span><strong>{data.messages.length}</strong><small>Messages received</small></div></div><div className="dash-panel"><div className="panel-head"><h2>Upcoming workshops</h2><button onClick={() => setTab('Workshops')}>Manage all <ArrowRight size={14} /></button></div>{data.workshops.map((item) => <div className="dash-workshop" key={item.id}><img src={item.image_url || '/brand/not-just-art-poster.png'} alt="" /><div><strong>{item.title}</strong><small>{item.date} · {item.start_time}</small></div><span>{item.available_seats}/{item.total_seats} seats left</span><button onClick={() => { setSelectedWorkshop(item.id); setTab('Registrations') }}>Registrations <ArrowRight size={14} /></button></div>)}</div></>}{data && tab === 'Workshops' && <div className="dash-panel admin-data-panel">{workshopEditor}{renderTable()}</div>}{data && tab === 'Registrations' && <div className="dash-panel admin-data-panel"><select value={selectedWorkshop} onChange={(event) => setSelectedWorkshop(event.target.value)}><option value="">All workshops</option>{data.workshops.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select>{renderTable()}</div>}{data && tab === 'Gallery' && <div className="dash-panel admin-data-panel">{galleryEditor}{renderTable()}</div>}{data && tab === 'Messages' && <div className="dash-panel admin-data-panel">{renderTable()}</div>}{data && tab === 'Announcements' && <div className="dash-panel admin-data-panel">{announcementEditor}{renderTable()}</div>}{data && tab === 'Settings' && <div className="dash-panel admin-data-panel">{settingsEditor}{renderTable()}</div>}</section></main>
}

function App() {
  return <Routes><Route path="/" element={<Home />} /><Route path="/workshops" element={<Workshops />} /><Route path="/workshops/:slug" element={<WorkshopDetail />} /><Route path="/about" element={<About />} /><Route path="/gallery" element={<Gallery />} /><Route path="/community" element={<Community />} /><Route path="/contact" element={<Contact />} /><Route path="/register" element={<Register />} /><Route path="/disha" element={<TeamAccess />} /><Route path="/ritik" element={<TeamAccess />} /><Route path="*" element={<><Header /><EmptyState title="Oops, wrong page." copy="This one got a little lost in the scrapbook." /><Footer /></>} /></Routes>
}

export default App
