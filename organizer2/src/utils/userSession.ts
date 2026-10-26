export interface LoggedInOrganizer {
  name: string;
  email: string;
  title: string;
  org: string;
  city: string;
  avatar: string;
  bio: string;
  sport: string;
}

export const getLoggedInOrganizer = (): LoggedInOrganizer => {
  if (typeof window !== 'undefined') {
    // 1. Check URL query parameters (sent from sportsphere-auth)
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get('name');
    if (nameParam) {
      // Read avatar from localStorage auth session (not URL params, as avatar URLs contain '&' that break parsing)
      let avatarUrl = '';
      try {
        const authSession = localStorage.getItem('sportsphere_auth_user');
        if (authSession) {
          const parsed = JSON.parse(authSession);
          if (parsed.profile && parsed.profile.avatar) {
            avatarUrl = parsed.profile.avatar;
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
        return JSON.parse(stored);
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
    bio: 'Official Sports Event Organizer',
    sport: 'Multi-Sport',
  };
};
