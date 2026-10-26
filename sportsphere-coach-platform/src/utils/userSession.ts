export interface LoggedInCoach {
  name: string;
  email: string;
  title: string;
  academy: string;
  sport: string;
  city: string;
  avatar: string;
  bio: string;
}

export const getLoggedInCoach = (): LoggedInCoach => {
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
        avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(nameParam)}&background=2563eb&color=fff&size=256&bold=true`;
      }

      const coachData: LoggedInCoach = {
        name: nameParam,
        email: params.get('email') || '',
        title: params.get('title') || 'Head Athletic Coach',
        academy: params.get('org') || 'High Performance Academy',
        sport: params.get('sport') || 'Athletics & Tactical Coaching',
        city: params.get('city') || 'Regional Hub',
        avatar: avatarUrl,
        bio: params.get('bio') || 'Certified Coach • Talent Scout & Player Development',
      };
      try {
        localStorage.setItem('sportsphere_coach_user', JSON.stringify(coachData));
      } catch {
        // ignore
      }
      // Clean URL params after extracting
      window.history.replaceState({}, '', window.location.pathname);
      return coachData;
    }

    // 2. Check localStorage
    try {
      const stored = localStorage.getItem('sportsphere_coach_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }

  // Fallback if accessed directly without login
  return {
    name: 'Head Coach',
    email: 'coach@sportsphere.org',
    title: 'High-Performance Director & Lead Scout',
    academy: 'Sportsphere Academy',
    sport: 'Athletics & Player Development',
    city: 'Regional Sports Center',
    avatar: '⏱️',
    bio: 'Certified Performance Director • Talent Identification & Scouting',
  };
};
