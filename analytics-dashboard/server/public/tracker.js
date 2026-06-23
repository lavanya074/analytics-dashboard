// This file is served by Express at GET /tracker.js
// Websites paste 2 lines in their <head> to load and activate it.

const Analytics = (() => {
  let apiKey = null;

  // CHANGE THIS to your deployed Render URL when you go live, e.g.
  // 'https://analytics-api-abc.onrender.com/api/events'
  const API_URL = 'https://analytics-dashboard-efi6.onrender.com/events';

  // Called once: Analytics.init("your_api_key")
  const init = (key) => {
    apiKey = key;

    // Auto-track the initial page view
    trackPageView();

    // Auto-track navigation for single page apps (React, Vue, etc.)
    window.addEventListener('popstate', trackPageView);

    // Track how long the visitor stayed before leaving
    const start = Date.now();
    window.addEventListener('beforeunload', () => {
      const seconds = Math.round((Date.now() - start) / 1000);
      track('page_exit', {
        page:               window.location.pathname,
        time_spent_seconds: seconds
      });
    });
  };

  const trackPageView = () => {
    track('page_view', {
      page:     window.location.pathname,
      referrer: document.referrer,
      title:    document.title
    });
  };

  // Manual tracking — websites call this themselves, e.g.
  // Analytics.track("button_click", { button: "buy_now" })
  const track = (eventType, properties = {}) => {
    if (!apiKey) {
      console.warn('Analytics not initialized. Call Analytics.init(apiKey) first.');
      return;
    }

    // fetch is non-blocking — never slows down the host website
    fetch(API_URL, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key':    apiKey
      },
      body: JSON.stringify({
        event_type: eventType,
        properties: properties
      })
    }).catch(() => {
      // Silently fail — never crash the client's website
    });
  };

  return { init, track };
})();
