(() => {
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
    'campaign_id', 'adset_id', 'ad_id', 'campaign_name', 'adset_name', 'ad_name', 'fbclid', 'gclid'];
  const storageKey = 'cta-lead-attribution';
  const current = new URLSearchParams(location.search);
  const incoming = Object.fromEntries(keys.filter(key => current.has(key))
    .map(key => [key, current.get(key).slice(0, 300)]));
  let saved = {};
  try { saved = JSON.parse(sessionStorage.getItem(storageKey) || '{}'); } catch {}
  const taggedVisit = Object.keys(incoming).length > 0;
  const attribution = taggedVisit ? incoming : saved;
  if (taggedVisit || !attribution.landing_page) {
    attribution.landing_page = location.origin + location.pathname;
    try { attribution.referrer = document.referrer ? new URL(document.referrer).origin : ''; } catch {}
  }
  try { sessionStorage.setItem(storageKey, JSON.stringify(attribution)); } catch {}
  window.ctaLeadAttribution = attribution;
})();
