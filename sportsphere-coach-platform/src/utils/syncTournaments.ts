import { Tournament, SportCategory } from '../types/sports';

export const mapOrganizerEventToCoachTournament = (ev: any): Tournament => {
  const sportImages: Record<string, string> = {
    Football: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    Badminton: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
    Basketball: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
    Athletics: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80',
    Swimming: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=1200&q=80',
    Volleyball: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80',
  };

  const sportCategory = (ev.sport || '').toLowerCase() as SportCategory;

  return {
    id: ev.id,
    title: ev.title,
    sport: sportCategory || 'athletics',
    level: 'State Level',
    tag: 'Organizer Sanctioned',
    urgency: `Open • ${ev.daysLeft || 10}d left`,
    image: sportImages[ev.sport] || sportImages.Athletics,
    dates: ev.date || 'Dec 10 – 14, 2026',
    venue: ev.venue || 'Varsity Sports Arena',
    location: ev.venue || 'Campus Stadium Complex',
    eligibility: 'U19 & Collegiate Verified Athletes',
    division: ev.subtitle || "Men's & Women's Open",
    fee: ev.fee || '₹500 Entry',
    registeredSlots: ev.registeredCount || 0,
    maxSlots: ev.totalCapacity || 16,
    isBookmarked: false,
    scoutPresence: 'Accredited Coach Evaluation Tables Confirmed',
    criteria: 'Registered collegiate rosters & verified club athletes',
    distanceMiles: 4.2,
    distanceKm: 6.8,
    driveTime: '12 mins drive',
    city: ev.city || 'Regional Sports Hub',
    isNearby: true,
  };
};

export const fetchPublishedOrganizerTournaments = async (): Promise<Tournament[]> => {
  try {
    let res = await fetch('/api/sync/events');
    if (!res.ok) {
      res = await fetch('http://localhost:3004/api/sync/events');
    }
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.events)) {
        return data.events
          .filter((ev: any) => ev.status === 'Open')
          .map((ev: any) => mapOrganizerEventToCoachTournament(ev));
      }
    }
  } catch {}
  return [];
};
