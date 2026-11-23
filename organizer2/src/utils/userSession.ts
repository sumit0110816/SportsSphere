export interface LoggedInOrganizer {
  name: string;
  email: string;
  title: string;
  org: string;
  city: string;
  avatar: string;
  banner?: string;
  bio: string;
  sport: string;
}

export const DEFAULT_ORGANIZER_BANNER = 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80';

export const getLoggedInOrganizer = (): LoggedInOrganizer => {
  if (typeof window !== 'undefined') {
    // 1. Check URL query parameters (sent from sportsphere-auth)
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get('name');
    if (nameParam) {
      let avatarUrl = '';
      let bannerUrl = '';
      try {
        const authSession = localStorage.getItem('sportsphere_auth_user');
        if (authSession) {
          const parsed = JSON.parse(authSession);
          if (parsed.profile) {
            if (parsed.profile.avatar) avatarUrl = parsed.profile.avatar;
            if (parsed.profile.banner) bannerUrl = parsed.profile.banner;
          }
        }
      } catch {
        // ignore
      }
      if (!avatarUrl) {
        avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(nameParam)}&background=d97706&color=fff&size=256&bold=true`;
      }

      const organizerData: LoggedInOrganizer = {
        name: nameParam,
        email: params.get('email') || '',
        title: params.get('title') || 'Tournament Director',
        org: params.get('org') || 'Regional Sports Federation',
        city: params.get('city') || 'Regional Hub',
        avatar: avatarUrl,
        banner: bannerUrl || DEFAULT_ORGANIZER_BANNER,
        bio: params.get('bio') || 'Sports Event Organizer & Tournament Director',
        sport: params.get('sport') || 'Multi-Sport',
      };
      try {
        localStorage.setItem('sportsphere_organizer_user', JSON.stringify(organizerData));
      } catch {
        // ignore
      }
      // Clean URL params after extracting
      window.history.replaceState({}, '', window.location.pathname);
      return organizerData;
    }

    // 2. Check localStorage
    try {
      const stored = localStorage.getItem('sportsphere_organizer_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.banner) parsed.banner = DEFAULT_ORGANIZER_BANNER;
        return parsed;
      }
    } catch {
      // ignore
    }
  }

  // Fallback if accessed directly without login
  return {
    name: 'Tournament Director',
    email: 'organizer@sportsphere.org',
    title: 'Regional Tournament Director',
    org: 'Sportsphere Regional Federation',
    city: 'Regional Sports Hub',
    avatar: '',
    banner: DEFAULT_ORGANIZER_BANNER,
    bio: 'Official Sports Event Organizer',
    sport: 'Multi-Sport',
  };
};
