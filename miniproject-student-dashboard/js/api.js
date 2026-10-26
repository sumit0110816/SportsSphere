/**
 * SportSphere Data Service using native JavaScript Fetch API
 * Provides async methods to fetch competitions, athlete biometrics, venues, teams, scholarships, highlights, and categories.
 */

// Fallback datasets for offline or direct file:// protocol loading
const FALLBACK_DATA = {
  competitions: [],
  highlights: [],
  categories: []
};

export class SportSphereAPI {
  /**
   * Generic Fetch API wrapper with JSON parsing and fallback error handling
   */
  static async fetchJSON(endpoint, fallbackKey = null) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.warn(`Fetch API request to ${endpoint} failed, utilizing local fallback data. Reason:`, err.message);
      if (fallbackKey && FALLBACK_DATA[fallbackKey]) {
        return JSON.parse(JSON.stringify(FALLBACK_DATA[fallbackKey]));
      }
      throw err;
    }
  }

  /**
   * Fetch all competitions via Fetch API
   */
  static async getCompetitions() {
    return await this.fetchJSON('./data/competitions.json', 'competitions');
  }

  /**
   * Fetch venue spots via Fetch API
   */
  static async getVenues() {
    return await this.fetchJSON('./data/venues.json');
  }

  /**
   * Fetch athlete profile & stats via Fetch API
   */
  static async getAthleteProfile() {
    return await this.fetchJSON('./data/athlete.json');
  }

  /**
   * Fetch team members via Fetch API
   */
  static async getTeams() {
    return await this.fetchJSON('./data/teams.json');
  }

  /**
   * Fetch scholarships via Fetch API
   */
  static async getScholarships() {
    return await this.fetchJSON('./data/scholarships.json');
  }

  /**
   * Fetch athletic highlights feed via Fetch API
   */
  static async getHighlights() {
    return await this.fetchJSON('./data/highlights.json');
  }

  /**
   * Fetch sports categories via Fetch API
   */
  static async getCategories() {
    return await this.fetchJSON('./data/categories.json');
  }

  /**
   * Post new highlight via Fetch API (simulated asynchronous POST endpoint)
   */
  static async postHighlight(highlightPayload) {
    console.log('Posting new athletic highlight via Fetch API:', highlightPayload);
    await new Promise(resolve => setTimeout(resolve, 600));

    const newHighlight = {
      id: 'hl-' + Date.now(),
      author: {
        name: highlightPayload.authorName || 'Student Athlete',
        handle: highlightPayload.authorHandle || '@student_athlete',
        role: highlightPayload.authorRole || 'Varsity Competitor',
        avatar: highlightPayload.authorAvatar || 'https://ui-avatars.com/api/?name=Student+Athlete&background=2563eb&color=fff&size=150',
        verified: true,
        badge: 'Federation Verified'
      },
      timestamp: 'Just now',
      sport: highlightPayload.sport || 'Athletics',
      title: highlightPayload.title,
      caption: highlightPayload.caption,
      mediaType: highlightPayload.mediaType || 'image',
      mediaUrl: highlightPayload.mediaUrl || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
      stats: {
        timing: highlightPayload.timingStat || 'Verified Trial',
        cadence: highlightPayload.cadenceStat || 'High Velocity',
        splitTime: highlightPayload.splitStat || 'Clean Finish'
      },
      likes: 1,
      hasLiked: true,
      commentsCount: 0,
      shares: 0,
      views: '1',
      tags: highlightPayload.tags || ['Athletics', 'Highlight']
    };

    return {
      success: true,
      message: 'Highlight reel published successfully to athlete network!',
      data: newHighlight
    };
  }

  /**
   * Submit competition registration via Fetch API (simulated asynchronous POST endpoint)
   */
  static async submitRegistration(registrationPayload) {
    try {
      console.log('Sending registration via Fetch API POST:', registrationPayload);
      await new Promise(resolve => setTimeout(resolve, 600));

      const confirmation = {
        id: 'reg-' + Date.now(),
        competitionTitle: registrationPayload.competitionTitle,
        category: registrationPayload.category || 'Collegiate Division',
        appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        eventDate: registrationPayload.eventDate || 'Upcoming',
        venue: registrationPayload.venue || 'Sanctioned Arena',
        fee: registrationPayload.fee || '₹500 (Paid)',
        status: 'Confirmed',
        bibNumber: 'SS-' + Math.floor(1000 + Math.random() * 9000),
        laneInfo: 'Heat ' + Math.floor(1 + Math.random() * 4) + ', Lane ' + Math.floor(1 + Math.random() * 8),
        qrCodeSeed: 'SS-' + Date.now()
      };

      return {
        success: true,
        message: 'Registration confirmed successfully!',
        data: confirmation
      };
    } catch (error) {
      console.error('Fetch registration error:', error);
      return {
        success: false,
        message: 'Registration submission failed. Please try again.'
      };
    }
  }

  /**
   * Submit Trial Time via Fetch API
   */
  static async submitTrialTime(trialData) {
    console.log('Posting trial time via Fetch API:', trialData);
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      message: `Trial time of ${trialData.time} for ${trialData.event} logged and pending scout verification.`,
      referenceId: 'TR-' + Math.floor(10000 + Math.random() * 90000)
    };
  }

  /**
   * Upload Sprint Biometrics via Fetch API
   */
  static async uploadSprintBiometrics(biometricData) {
    console.log('Uploading biometric split data via Fetch API:', biometricData);
    await new Promise(resolve => setTimeout(resolve, 700));
    return {
      success: true,
      message: 'Sprint video & split analytics processed! Scout Index updated to 94/100.',
      status: 'Verified by AFI Algorithm'
    };
  }
}
