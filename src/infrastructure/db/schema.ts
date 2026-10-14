export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'client',
  department TEXT,
  branch_id TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS destinations (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  is_domestic INTEGER NOT NULL DEFAULT 1,
  is_featured INTEGER NOT NULL DEFAULT 0,
  top_attractions_json TEXT DEFAULT '[]',
  best_time_to_visit TEXT,
  weather_info TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tours (
  id TEXT PRIMARY KEY,
  destination_id TEXT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  duration_days INTEGER NOT NULL,
  duration_nights INTEGER NOT NULL,
  price REAL NOT NULL,
  original_price REAL,
  featured INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'Holidays',
  tour_type TEXT NOT NULL DEFAULT 'Group & Customized',
  overview TEXT NOT NULL,
  highlights_json TEXT DEFAULT '[]',
  inclusions_json TEXT DEFAULT '[]',
  exclusions_json TEXT DEFAULT '[]',
  itinerary_json TEXT DEFAULT '[]',
  images_json TEXT DEFAULT '[]',
  departure_dates_json TEXT DEFAULT '[]',
  rating REAL DEFAULT 4.9,
  review_count INTEGER DEFAULT 18,
  max_group_size INTEGER DEFAULT 15,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (destination_id) REFERENCES destinations (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  r2_key TEXT,
  category TEXT NOT NULL DEFAULT 'Destinations',
  caption TEXT,
  tags_json TEXT DEFAULT '[]',
  is_featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  review_date TEXT NOT NULL DEFAULT (datetime('now')),
  comment TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'Google',
  verified INTEGER NOT NULL DEFAULT 1,
  is_published INTEGER NOT NULL DEFAULT 1,
  trip_type TEXT DEFAULT 'Family Vacation',
  helpful_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS blogs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Yellow Ribbon Team',
  read_time TEXT DEFAULT '5 min read',
  tags_json TEXT DEFAULT '[]',
  published_at TEXT NOT NULL DEFAULT (datetime('now')),
  is_featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS branches (
  id TEXT PRIMARY KEY,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  is_international INTEGER NOT NULL DEFAULT 0,
  branch_type TEXT NOT NULL DEFAULT 'Branch Office',
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  google_maps_url TEXT,
  map_embed_url TEXT,
  manager_name TEXT,
  manager_phone TEXT,
  timing TEXT DEFAULT 'Monday - Saturday: 9:30 AM - 7:00 PM',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS payment_links (
  id TEXT PRIMARY KEY,
  link_code TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  purpose TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  paid_at TEXT,
  expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS itineraries (
  id TEXT PRIMARY KEY,
  reference_no TEXT UNIQUE NOT NULL,
  user_id TEXT,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT NOT NULL,
  destination TEXT NOT NULL,
  title TEXT NOT NULL,
  start_date TEXT,
  duration_days INTEGER NOT NULL DEFAULT 1,
  duration_nights INTEGER NOT NULL DEFAULT 1,
  travelers_count INTEGER NOT NULL DEFAULT 2,
  hotel_details TEXT,
  flights_json TEXT DEFAULT '[]',
  days_json TEXT NOT NULL DEFAULT '[]',
  inclusions_json TEXT DEFAULT '[]',
  exclusions_json TEXT DEFAULT '[]',
  total_price REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'Active',
  notes TEXT,
  vehicle TEXT DEFAULT 'Toyota Etios',
  pax_label TEXT DEFAULT '2 Adults',
  price_per_person REAL DEFAULT 0,
  accommodations_json TEXT DEFAULT '[]',
  package_highlights_json TEXT DEFAULT '[]',
  important_notes_json TEXT DEFAULT '[]',
  cost_breakdown_json TEXT DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL DEFAULT 'Invoice',
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT NOT NULL,
  client_address TEXT,
  items_json TEXT NOT NULL DEFAULT '[]',
  subtotal REAL NOT NULL DEFAULT 0,
  tax_percent REAL NOT NULL DEFAULT 5,
  tax_amount REAL NOT NULL DEFAULT 0,
  discount_amount REAL NOT NULL DEFAULT 0,
  total_amount REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'Draft',
  due_date TEXT,
  notes TEXT,
  terms TEXT,
  payment_link_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (payment_link_id) REFERENCES payment_links (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  department TEXT NOT NULL,
  bio TEXT NOT NULL,
  image_url TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  linkedin TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  tour_id TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  travel_date TEXT NOT NULL,
  travelers_count INTEGER NOT NULL DEFAULT 2,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  total_amount REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS flight_inquiries (
  id TEXT PRIMARY KEY,
  trip_type TEXT NOT NULL DEFAULT 'roundtrip',
  from_city TEXT NOT NULL,
  to_city TEXT NOT NULL,
  depart_date TEXT NOT NULL,
  return_date TEXT,
  passengers_adults INTEGER NOT NULL DEFAULT 1,
  passengers_children INTEGER NOT NULL DEFAULT 0,
  passengers_infants INTEGER NOT NULL DEFAULT 0,
  cabin_class TEXT NOT NULL DEFAULT 'Economy',
  preferred_airline TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  branch_id TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (branch_id) REFERENCES branches (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  group_name TEXT NOT NULL DEFAULT 'general',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS gallery_likes (
  id TEXT PRIMARY KEY,
  gallery_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (gallery_id) REFERENCES gallery_items (id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  user_id TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General Support',
  priority TEXT NOT NULL DEFAULT 'medium',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  admin_notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  phone_clean TEXT NOT NULL,
  email TEXT,
  city TEXT,
  state TEXT,
  address TEXT,
  tier TEXT NOT NULL DEFAULT 'Standard',
  vip_status INTEGER NOT NULL DEFAULT 0,
  tags_json TEXT NOT NULL DEFAULT '[]',
  preferences_json TEXT NOT NULL DEFAULT '{}',
  internal_notes TEXT,
  source TEXT DEFAULT 'Direct',
  total_spent REAL NOT NULL DEFAULT 0,
  deals_count INTEGER NOT NULL DEFAULT 0,
  last_interaction_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tours_destination ON tours (destination_id);
CREATE INDEX IF NOT EXISTS idx_tours_featured ON tours (featured);
CREATE INDEX IF NOT EXISTS idx_destinations_featured ON destinations (is_featured);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_items (category);
CREATE INDEX IF NOT EXISTS idx_gallery_likes_gallery ON gallery_likes (gallery_id);
CREATE INDEX IF NOT EXISTS idx_gallery_likes_user ON gallery_likes (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_gallery_user_like ON gallery_likes (gallery_id, user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets (user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_email ON support_tickets (customer_email);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets (status);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews (rating);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs (slug);
CREATE INDEX IF NOT EXISTS idx_branches_intl ON branches (is_international);
CREATE INDEX IF NOT EXISTS idx_payment_links_code ON payment_links (link_code);
CREATE INDEX IF NOT EXISTS idx_itineraries_ref ON itineraries (reference_no);
CREATE INDEX IF NOT EXISTS idx_itineraries_user ON itineraries (user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_num ON invoices (invoice_number);
CREATE INDEX IF NOT EXISTS idx_contacts_phone_clean ON contacts (phone_clean);
CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts (name);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts (email);
CREATE INDEX IF NOT EXISTS idx_contacts_tier ON contacts (tier);
CREATE INDEX IF NOT EXISTS idx_contacts_vip ON contacts (vip_status);
`;
