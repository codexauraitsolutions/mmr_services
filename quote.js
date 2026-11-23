/* MMR SERVICES "Get Quote" popup
   Opens automatically once per visit, and from any button with [data-quote].
   The form sends the enquiry to MMR SERVICES on WhatsApp (no server needed). */
(function () {
  'use strict';

  var WA_NUMBER = '919940422749';
  var CALL_TEL = '+919940422749';
  var CALL_LABEL = '99404 22749';
  var AUTO_OPEN_DELAY = 1200;          // ms after the page loads
  var SEEN_KEY = 'mmr-quote-shown';    // once per browser session

  var SERVICES = [
    'AEPS', 'Money Transfer', 'Bills & Recharges (BBPS)', 'Spot Cash / Card Swipe',
    'Payment Gateway', 'CMS - Cash Management', 'E-Seva Services', 'A4 Sheets',
    'Become a Retailer / Partner', 'Other'
  ];

  // Pre-select the service that matches the page being viewed
  var PAGE_SERVICE = {
    'aeps.html': 'AEPS', 'bbps.html': 'Bills & Recharges (BBPS)',
    'payment-gateway.html': 'Spot Cash / Card Swipe', 'cms.html': 'CMS - Cash Management',
    'e-seva.html': 'E-Seva Services', 'a4-sheets.html': 'A4 Sheets'
  };

  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';
  var ICON_WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/><path fill="#1fae55" d="M8.6 7.2c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3l-1.6-.8c-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.3-.8-.7-1.3-1.5-1.4-1.8-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.2-.5.1-.2 0-.3 0-.5l-.8-1.8c-.2-.4-.4-.4-.5-.4z"/></svg>';
  var ICON_PHONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>';

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  function build() {
    var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var preset = PAGE_SERVICE[page] || '';
    var options = '<option value="">Select a service</option>' + SERVICES.map(function (s) {
      return '<option' + (s === preset ? ' selected' : '') + '>' + esc(s) + '</option>';
    }).join('');

    var wrap = document.createElement('div');
    wrap.className = 'quote-overlay';
    wrap.hidden = true;
    wrap.innerHTML =
      '<div class="quote-modal" role="dialog" aria-modal="true" aria-labelledby="quote-title">' +
        '<button type="button" class="quote-close" aria-label="Close">' + ICON_CLOSE + '</button>' +
        '<div class="quote-head">' +
          '<img src="images/logo.png" alt="MMR SERVICES" width="1065" height="475">' +
          '<h2 id="quote-title">Get a Free Quote</h2>' +
          '<p>Tell us what you need and our team will get back to you quickly.</p>' +
        '</div>' +
        '<form class="quote-form" novalidate>' +
          '<label>Your Name<input type="text" name="name" autocomplete="name" maxlength="60" required></label>' +
          '<label>Mobile Number<input type="tel" name="mobile" autocomplete="tel" inputmode="numeric" maxlength="10" placeholder="10-digit mobile number" required></label>' +
          '<label>Service<select name="service" required>' + options + '</select></label>' +
          '<label>City / Town<input type="text" name="city" autocomplete="address-level2" maxlength="60" placeholder="Optional"></label>' +
          '<label class="quote-full">Message<textarea name="message" rows="3" maxlength="400" placeholder="Optional: quantity, requirement, best time to call…"></textarea></label>' +
          '<p class="quote-error" role="alert" hidden></p>' +
          '<button type="submit" class="btn btn-wa quote-submit">' + ICON_WA + ' Send on WhatsApp</button>' +
          '<a class="quote-call" href="tel:' + CALL_TEL + '">' + ICON_PHONE + ' ' + CALL_LABEL + '</a>' +
        '</form>' +
      '</div>';
    document.body.appendChild(wrap);
    return wrap;
  }

  function init() {
    var overlay = build();
    var form = overlay.querySelector('.quote-form');
    var err = overlay.querySelector('.quote-error');
    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      overlay.hidden = false;
      document.body.classList.add('quote-open');
      try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) {}
      setTimeout(function () { form.elements.name.focus(); }, 50);
    }
    function close() {
      overlay.hidden = true;
      document.body.classList.remove('quote-open');
      err.hidden = true;
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    overlay.querySelector('.quote-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !overlay.hidden) close(); });
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-quote]');
      if (t) { e.preventDefault(); open(); }
    });

    // digits only in the mobile field
    form.elements.mobile.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '').slice(0, 10);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var name = f.name.value.trim(), mobile = f.mobile.value.trim(), service = f.service.value;
      var problem = !name ? 'Please enter your name.'
        : !/^[6-9]\d{9}$/.test(mobile) ? 'Please enter a valid 10-digit mobile number.'
        : !service ? 'Please select a service.' : '';
      if (problem) { err.textContent = problem; err.hidden = false; return; }
      err.hidden = true;

      var lines = ['Hi MMR SERVICES, I would like a quote.', '',
        'Name: ' + name, 'Mobile: ' + mobile, 'Service: ' + service];
      if (f.city.value.trim()) lines.push('City: ' + f.city.value.trim());
      if (f.message.value.trim()) lines.push('Message: ' + f.message.value.trim());
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
      form.reset();
      close();
    });

    // Auto-open once per visit
    var seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === '1'; } catch (e) {}
    if (!seen) setTimeout(function () { if (overlay.hidden && !document.body.classList.contains('chat-open')) open(); }, AUTO_OPEN_DELAY);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
