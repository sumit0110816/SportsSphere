export interface LoggedInStudent {
  name: string;
  email: string;
  handle: string;
  sport: string;
  city: string;
  avatar: string;
  bio: string;
  title: string;
}

export const getLoggedInStudent = (): LoggedInStudent => {
  if (typeof window !== 'undefined') {
    // 1. Check URL query parameters (sent from sportsphere-auth)
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get('name');
    if (nameParam) {
      const nameParts = nameParam.trim().split(' ');
      const firstN = nameParts[0] || 'athlete';
      const defaultHandle = firstN.toLowerCase().replace(/[^a-z0-9]/g, '') + '_athlete';

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

      const studentData: LoggedInStudent = {
        name: nameParam,
        email: params.get('email') || '',
        handle: params.get('handle') || defaultHandle,
        sport: params.get('sport') || 'Athletics',
        city: params.get('city') || 'Regional Hub',
        avatar: avatarUrl,
        bio: params.get('bio') || 'Student Athlete • Federation Registered',
        title: params.get('title') || 'Student Athlete',
      };
      try {
        localStorage.setItem('sportsphere_student_user', JSON.stringify(studentData));
      } catch {
        // ignore
      }
      // Clean URL params after extracting
      window.history.replaceState({}, '', window.location.pathname);
      return studentData;
    }

    // 2. Check localStorage
    try {
      const stored = localStorage.getItem('sportsphere_student_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }

  // Fallback if accessed directly without login
  return {
    name: 'Student Athlete',
    email: 'athlete@sportsphere.org',
    handle: 'student_athlete',
    sport: 'Athletics',
    city: 'Regional Sports Hub',
    avatar: '',
    bio: 'Federation Registered Student Athlete',
    title: 'Student Athlete',
  };
};
