export type CarCategory =
  | "SUV Premium"
  | "SUV"
  | "Sedan"
  | "Economy"
  | "Crossover"
  | "Luxury"
  | "Supercars"
  | "Sports"
  | "Convertible"
  | "Electric"
  | "Muscle";

export type Fuel = "Petrol" | "Diesel" | "Hybrid" | "Electric";

export interface Car {
  slug: string;
  brand: string;
  model: string;
  year: number;
  category: CarCategory;
  pricePerDay: number;
  engine: string;
  fuel: Fuel;
  power: number;
  transmission: "Automatic" | "Manual";
  drive: string;
  seats: number;
  image: string;
  gallery: string[];
  features: string[];
  featured: boolean;
  available: boolean;
}

export interface Brand {
  name: string;
  tagline: string;
  description: string;
  domain: string;
  currency: string;
  currencySymbol: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  address: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  geo: { lat: number; lng: number };
  hours: string;
  social: {
    instagram: string;
    telegram: string;
    whatsapp: string;
    viber: string;
  };
  usps: Array<{ label: string; value: string }>;
  policies: {
    minAge: number;
    minLicenseYears: number;
    dailyKmLimit: number;
    depositMinEur: number;
    depositMaxEur: number;
  };
  carBrands: string[];
  paymentMethods: string[];
  microTrust: string[];
  whatsappNumber: string;
}

export interface Testimonial {
  id: string;
  name: string;
  initials: string;
  country: string;
  rating: number;
  source: "Google" | "Trustpilot" | "Booking.com";
  date: string;
  text: string;
}

export interface TestimonialsAggregate {
  rating: number;
  count: number;
  sources: string[];
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface Location {
  id: string;
  label: string;
  free: boolean;
}

export interface CarReel {
  id: string;
  slug: string;
  brand: string;
  model: string;
  pricePerDay: number;
  oldPricePerDay: number;
  poster: string;
  videoUrl: string;
}

export interface BookingPayload {
  fullName: string;
  phone: string;
  email?: string;
  carSlug: string;
  pickupDate: string;
  returnDate: string;
  locationId: string;
  notes?: string;
}
