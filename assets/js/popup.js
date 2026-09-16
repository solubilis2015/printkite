/* =========================================================
   Printkite India — promo popup
   Corner popup that appears every 20 seconds (per the current brief).
   Set repeatEverySeconds to null and repeatAfterHours to 24 to go back
   to the "once a day per visitor" behaviour.
   ========================================================= */
(function () {
  'use strict';

  const PK_POPUP_CONFIG = {
    firstDelay: 20000,        // ms before the first appearance
    repeatEverySeconds: 20,   // re-show this often after it is closed (null = don't repeat)
    autoHideAfter: 12000,     // ms the popup stays on screen if untouched (null = stay)
    scrollTrigger: 0.25,      // also trigger once the visitor scrolls 25% of the page
    repeatAfterHours: null,   // set to 24 (and repeatEverySeconds to null) for once-a-day
    storageKey: 'pk_promo_seen_at'
  };

  const popup = document.getElementById('pkPopup');
  if (!popup) return;

  const store = {
    get() { try { return localStorage.getItem(PK_POPUP_CONFIG.storageKey); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(PK_POPUP_CONFIG.storageKey, v); } catch (e) { /* private mode */ } }
  };

  // "once per day" mode only
  if (PK_POPUP_CONFIG.repeatAfterHours) {
    const seenAt = Number(store.get());
    const hoursSince = seenAt ? (Date.now() - seenAt) / 36e5 : Infinity;
    if (hoursSince < PK_POPUP_CONFIG.repeatAfterHours) return;
  }

  let showTimer = null, hideTimer = null, claimed = false;

  function show() {
    if (claimed || popup.classList.contains('show')) return;
    popup.classList.add('show');
    popup.setAttribute('aria-hidden', 'false');
    if (PK_POPUP_CONFIG.autoHideAfter) {
      hideTimer = setTimeout(() => hide(), PK_POPUP_CONFIG.autoHideAfter);
    }
  }

  function hide(permanent) {
    popup.classList.remove('show');
    popup.setAttribute('aria-hidden', 'true');
    store.set(String(Date.now()));
    clearTimeout(hideTimer);
    if (permanent) { claimed = true; clearTimeout(showTimer); return; }
    if (PK_POPUP_CONFIG.repeatEverySeconds) {
      clearTimeout(showTimer);
      showTimer = setTimeout(show, PK_POPUP_CONFIG.repeatEverySeconds * 1000);
    }
  }

  showTimer = setTimeout(show, PK_POPUP_CONFIG.firstDelay);

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max > 0 && window.scrollY / max > PK_POPUP_CONFIG.scrollTrigger) {
      window.removeEventListener('scroll', onScroll);
      show();
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  document.getElementById('popupClose').addEventListener('click', () => hide());
  document.getElementById('popupDismiss').addEventListener('click', () => hide());
  // clicking through to the enquiry form stops the popup for this visit
  popup.querySelectorAll('a').forEach(a => a.addEventListener('click', () => hide(true)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && popup.classList.contains('show')) hide();
  });
})();
