/* MMR SERVICES chat assistant
   A self-contained FAQ chatbot: answers from the knowledge base below and
   hands anything it can't answer over to WhatsApp / phone. No server needed. */
(function () {
  'use strict';

  // ------------------------------------------------------------ contact details
  var CALL = { label: '99404 22749', tel: '+919940422749' };   // same number for calls and WhatsApp
  var WA = { label: '99404 22749', number: '919940422749' };
  var LANDLINE_CHN = { label: '044 - 2277 2727', tel: '+914422772727' };
  var LANDLINE_SKHT = { label: '08578 - 224404', tel: '+918578224404' };
  var MAIL = 'mmr@groupmail.com';
  var MAIL2 = 'mmrservs@gmail.com';

  function waLink(text) {
    return 'https://wa.me/' + WA.number + (text ? '?text=' + encodeURIComponent(text) : '');
  }
  var callLink = '<span class="chat-dual"><a href="tel:' + CALL.tel + '" class="dual-call" aria-label="Call ' + CALL.label + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg></a>'
    + '<a href="' + waLink('Hi MMR SERVICES, I need some help.') + '" class="dual-wa" target="_blank" rel="noopener" aria-label="WhatsApp ' + CALL.label + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#25D366" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/><path fill="#fff" d="M8.6 7.2c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3l-1.6-.8c-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.3-.8-.7-1.3-1.5-1.4-1.8-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.2-.5.1-.2 0-.3 0-.5l-.8-1.8c-.2-.4-.4-.4-.5-.4z"/></svg></a>'
    + '<a href="tel:' + CALL.tel + '" class="dual-num">' + CALL.label + '</a></span>';
  var waAnchor = '<a href="' + waLink('Hi MMR SERVICES, I need some help.') + '" target="_blank" rel="noopener">' + WA.label + '</a>';

  // ------------------------------------------------------------ knowledge base
  // keywords: lowercase words/phrases; the topic with the most matches wins.
  var TOPICS = [
    {
      id: 'aeps', label: 'AEPS',
      keywords: ['aeps', 'aadhaar', 'aadhar', 'fingerprint', 'biometric', 'cash withdrawal', 'withdraw', 'balance', 'mini statement', 'statement', 'aadhaar pay', 'cash deposit'],
      answer: '<b>AEPS (Aadhaar Enabled Payment System)</b><br>Offer banking at your shop using just Aadhaar and a fingerprint:<ul><li>Cash withdrawal</li><li>Balance enquiry</li><li>Mini statement</li><li>Aadhaar Pay</li></ul>Customers of any bank can use it, and you earn commission on every transaction.',
      link: ['aeps.html', 'View AEPS page'],
      next: ['money', 'upi', 'retailer']
    },
    {
      id: 'money', label: 'Money Transfer',
      keywords: ['money transfer', 'transfer', 'send money', 'receive money', 'dmt', 'remittance', 'remit'],
      answer: '<b>Money Transfer</b><br>Send money and receive money, anytime, anywhere. Visit either of our offices or reach us on ' + callLink + '.',
      link: ['aeps.html', 'View details'],
      next: ['aeps', 'upi', 'contact']
    },
    {
      id: 'upi', label: 'UPI Withdrawal',
      keywords: ['upi withdrawal', 'upi cash', 'cash from upi', 'phonepe', 'gpay', 'google pay', 'paytm'],
      answer: '<b>UPI Withdrawal</b><br>Instant cash withdrawal from any UPI app.',
      link: ['aeps.html', 'View details'],
      next: ['aeps', 'qr', 'contact']
    },
    {
      id: 'bbps', label: 'Bills & Recharges',
      keywords: ['bbps', 'bill', 'bills', 'electricity', 'eb bill', 'current bill', 'water', 'gas', 'recharge', 'mobile recharge', 'jio', 'airtel', 'vi ', 'vodafone', 'bsnl', 'dth', 'tata play', 'sun direct', 'fastag', 'fas tag', 'broadband', 'landline bill', 'insurance', 'premium', 'loan', 'emi', 'credit card bill'],
      answer: '<b>BBPS, Bills &amp; Recharges</b><ul><li>EB bill: electricity, water, gas</li><li>Credit card bill payment</li><li>Mobile recharge: Jio, Airtel, Vi, BSNL</li><li>DTH: Tata Play, Airtel Digital TV, Sun Direct</li><li>FASTag, broadband and landline bills</li><li>Insurance premium &amp; loan repayment</li></ul>Instant confirmation and receipts for every payment.',
      link: ['bbps.html', 'View Bills & Recharges'],
      next: ['travel', 'rates', 'contact']
    },
    {
      id: 'travel', label: 'Bus & Flight Booking',
      keywords: ['bus', 'flight', 'ticket', 'tickets', 'travel', 'booking', 'book', 'air ticket'],
      answer: '<b>Bus &amp; Flight Booking</b><br>Book your bus tickets and flight tickets easily with us. For dates and fares: ' + callLink,
      link: ['bbps.html', 'View details'],
      next: ['bbps', 'contact']
    },
    {
      id: 'rates', label: 'Spot Cash & Card Swipe',
      keywords: ['rate', 'rates', 'charge', 'charges', 'percent', '%', 'commission', 'fee', 'fees', 'price', 'cost', 'spot cash', 'swipe', 'swiping', 'credit card', 'card swipe', 'pos', 'machine', 'payment gateway', 'gateway', 'pg', 'spot', 'minimal'],
      answer: '<b>Spot Cash &amp; Card Swipe</b><br>Swipe your credit card and get spot cash with minimal charges.<ul><li>Credit card swiping retailer ID</li><li>QR code (UPI) payments</li><li>OTP-based POS machine</li></ul>All cards supported (Visa, Mastercard, RuPay, American Express, Diners Club) with instant settlement.<br>For the latest charges: ' + callLink,
      link: ['payment-gateway.html', 'View Payment Gateway page'],
      next: ['cards', 'retailer', 'contact']
    },
    {
      id: 'cards', label: 'Cards Supported',
      keywords: ['visa', 'mastercard', 'master card', 'rupay', 'amex', 'american express', 'diners', 'debit card', 'business card', 'corporate card', 'which card', 'all cards'],
      answer: '<b>All cards supported</b><br>Visa, Mastercard, RuPay, American Express and Diners Club International, including credit, business/corporate, debit and RuPay cards.',
      link: ['payment-gateway.html', 'View details'],
      next: ['rates', 'qr']
    },
    {
      id: 'qr', label: 'QR Code',
      keywords: ['qr', 'qr code', 'scan', 'scan and pay', 'scan & pay'],
      answer: '<b>QR Code (UPI)</b><br>Scan &amp; pay with any UPI app, with instant settlement.',
      link: ['payment-gateway.html', 'View details'],
      next: ['rates', 'contact']
    },
    {
      id: 'cms', label: 'CMS (Cash Management)',
      keywords: ['cms', 'cash management', 'cash management services', 'collection', 'collections', 'receivable', 'receivables', 'payable', 'payables', 'vendor payment', 'salary', 'salaries', 'liquidity', 'cash flow', 'cash pickup', 'treasury', 'nach', 'mis', 'reconciliation'],
      answer: '<b>CMS: Cash Management Services</b><br>Simplify how your business collects, pays and tracks money:<ul><li>Collections from customers and branches</li><li>Vendor, salary and bill payments</li><li>Better cash flow and liquidity planning</li><li>Clear MIS reports and reconciliation</li></ul>Suitable for growing businesses, distributors and multi-branch firms. To discuss your needs: ' + callLink,
      link: ['cms.html', 'View CMS page'],
      wa: 'Hi MMR SERVICES, I want to know about Cash Management Services (CMS).',
      next: ['retailer', 'contact']
    },
    {
      id: 'eseva', label: 'E-Seva Services',
      keywords: ['e-seva', 'eseva', 'e seva', 'seva', 'fssai', 'food licence', 'food license', 'gst', 'pan', 'pan card', 'itr', 'income tax', 'tax return', 'passport', 'aadhaar pan link', 'pan link', 'npci', 'link aadhaar'],
      answer: '<b>E-Seva Services, now live</b><ul><li>FSSAI licence fee</li><li>GST registration &amp; GST return fees</li><li>PAN service</li><li>ITR form</li><li>Passport registration &amp; renewal fee</li><li>Aadhaar-PAN link &amp; Aadhaar-NPCI link fee</li></ul>One platform, multiple services.',
      link: ['e-seva.html', 'View E-Seva page'],
      next: ['offices', 'contact']
    },
    {
      id: 'order', label: 'Place an A4 order',
      keywords: ['how to order', 'how do i order', 'want to order', 'place order', 'place an order', 'order a4', 'order paper', 'order', 'buy', 'purchase', 'delivery', 'deliver', 'bulk', 'quantity'],
      answer: 'To place an order, tell us the <b>GSM</b> (70 / 75 / 80) and the <b>number of reams</b> on ' + callLink + ' We deliver to your doorstep.',
      wa: 'Hi MMR SERVICES, I want to order A4 sheets. GSM: ___  Reams: ___',
      next: ['a4', 'contact']
    },
    {
      id: 'a4', label: 'A4 Sheets',
      keywords: ['a4', 'paper', 'sheet', 'sheets', 'ream', 'gsm', 'copier', 'xerox', 'printing paper', 'bundle', 'stationery'],
      answer: '<b>A4 Sheets</b><ul><li>70 GSM: everyday printing &amp; photocopies</li><li>75 GSM: office documents</li><li>80 GSM: premium professional prints</li></ul>500 sheets per ream, special pricing for bulk orders, and doorstep delivery.<br>For prices and orders: ' + callLink,
      link: ['a4-sheets.html', 'View A4 Sheets page'],
      next: ['order', 'contact']
    },
    {
      id: 'retailer', label: 'Become a Retailer',
      keywords: ['retailer', 'distributor', 'partner', 'join', 'franchise', 'agent', 'register', 'registration', 'id', 'onboard', 'business', 'start'],
      answer: '<b>Become a retailer / partner</b><br>Offer AEPS, money transfer, bill payments, recharges, card swipe and E-Seva services from your shop and earn on every transaction. Credit card swiping retailer IDs are also available.<br>To get started: ' + callLink,
      wa: 'Hi MMR SERVICES, I want to become a retailer / partner.',
      next: ['login', 'rates', 'contact']
    },
    {
      id: 'login', label: 'Retailer Login',
      keywords: ['login', 'log in', 'sign in', 'signin', 'portal', 'soulpay', 'soul pay', 'mmrpe', 'mmr pe', 'password', 'account'],
      answer: '<b>Retailer &amp; partner portals</b><br>&#8226; <a href="https://secures.soulpay.in/login" target="_blank" rel="noopener">SoulPay Login</a><br>&#8226; <a href="https://mmrpe.com/login" target="_blank" rel="noopener">MMRPe Login</a><br>Trouble logging in? WhatsApp ' + waAnchor + '.',
      next: ['retailer', 'contact']
    },
    {
      id: 'offices', label: 'Office Address',
      keywords: ['address', 'office', 'location', 'where', 'branch', 'visit', 'chennai', 'sithalapakkam', 'srikalahasti', 'kalahasti', 'andhra', 'tamil nadu', 'map', 'directions'],
      answer: '<b>Chennai office</b><br>#3/740, Kanni Kovil Street, Sithalapakkam, Chennai - 600131.<br>&#128205; <a href="https://maps.app.goo.gl/EPhTznhaiuHwMEHp7" target="_blank" rel="noopener">Open in Google Maps</a><br>&#9742;&#65039; <a href="tel:' + LANDLINE_CHN.tel + '">' + LANDLINE_CHN.label + '</a><br><br><b>Srikalahasti office</b><br>1-284/5, Pichatur Road, Revenue Ward 1 (Behind Sri Draupadi Sametha Dharmaraja Swamy Temple), Srikalahasti, A.P - 517644.<br>&#128205; <a href="https://maps.app.goo.gl/B24z3HJkmfDDjsa46" target="_blank" rel="noopener">Open in Google Maps</a><br>&#9742;&#65039; <a href="tel:' + LANDLINE_SKHT.tel + '">' + LANDLINE_SKHT.label + '</a>',
      link: ['index.html#contact', 'View offices'],
      next: ['contact']
    },
    {
      id: 'contact', label: 'Contact Us',
      keywords: ['contact', 'call', 'phone', 'number', 'mobile', 'whatsapp', 'whats app', 'email', 'mail', 'talk', 'human', 'person', 'agent', 'support', 'help', 'customer care', 'reach'],
      answer: '<b>Contact MMR SERVICES</b><br>' + callLink + '<br>&#9742;&#65039; <a href="tel:' + LANDLINE_CHN.tel + '">' + LANDLINE_CHN.label + '</a> (Chennai), <a href="tel:' + LANDLINE_SKHT.tel + '">' + LANDLINE_SKHT.label + '</a> (Srikalahasti)<br>&#9993;&#65039; <a href="mailto:' + MAIL + '">' + MAIL + '</a> / <a href="mailto:' + MAIL2 + '">' + MAIL2 + '</a>',
      next: ['offices', 'retailer']
    },
    {
      id: 'thanks', label: 'Thanks',
      keywords: ['thank', 'thanks', 'thank you', 'ok', 'okay', 'great', 'super', 'nice', 'bye'],
      answer: 'You\'re welcome! &#128522; Is there anything else I can help with?',
      next: []
    },
    {
      id: 'hello', label: 'Hello',
      keywords: ['hi', 'hello', 'hey', 'hai', 'good morning', 'good evening', 'good afternoon', 'vanakkam', 'namaste', 'namaskaram'],
      answer: 'Hello! &#128075; How can I help you today? Pick a topic below or type your question.',
      next: []
    }
  ];

  var MAIN_MENU = ['aeps', 'bbps', 'rates', 'cms', 'eseva', 'a4', 'retailer', 'login', 'contact'];
  var byId = {};
  TOPICS.forEach(function (t) { byId[t.id] = t; });

  // ------------------------------------------------------------ matching
  function findTopic(text) {
    var q = ' ' + text.toLowerCase().replace(/[^a-z0-9%.\-& ]+/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
    var best = null, bestScore = 0;
    TOPICS.forEach(function (t) {
      var score = 0;
      t.keywords.forEach(function (k) {
        // short keywords must match a whole word; longer ones may match inside the text
        var hit = k.length <= 3 ? q.indexOf(' ' + k.trim() + ' ') !== -1 : q.indexOf(k) !== -1;
        if (hit) score += k.length >= 10 ? 3 : k.length > 5 ? 2 : 1;
      });
      // greetings / thanks only win when nothing more specific matched
      if ((t.id === 'hello' || t.id === 'thanks') && score) score = 0.5;
      if (score > bestScore) { bestScore = score; best = t; }
    });
    return best;
  }

  // ------------------------------------------------------------ DOM
  var ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>';
  var ICON_WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#25D366" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/><path fill="#fff" d="M8.6 7.2c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3l-1.6-.8c-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.3-.8-.7-1.3-1.5-1.4-1.8-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.2-.5.1-.2 0-.3 0-.5l-.8-1.8c-.2-.4-.4-.4-.5-.4z"/></svg>';
  var ICON_WA_WHITE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/><path fill="#1fae55" d="M8.6 7.2c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3l-1.6-.8c-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.3-.8-.7-1.3-1.5-1.4-1.8-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.2-.5.1-.2 0-.3 0-.5l-.8-1.8c-.2-.4-.4-.4-.5-.4z"/></svg>';

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function build() {
    var launcher = el('button', 'chat-launcher', ICON_CHAT + '<span class="chat-launcher-label">Chat with us</span>');
    launcher.type = 'button';
    launcher.setAttribute('aria-label', 'Open chat assistant');
    launcher.setAttribute('aria-expanded', 'false');

    var nudge = el('div', 'chat-nudge', 'Hi! &#128075; Need help with AEPS, bills, spot cash or A4 sheets?');

    var panel = el('section', 'chat-panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'MMR SERVICES chat assistant');
    panel.hidden = true;
    panel.innerHTML =
      '<header class="chat-head">' +
        '<span class="chat-logo"><img src="images/logo.png" alt="MMR SERVICES" width="1065" height="475"></span>' +
        '<div><strong>Customer Support</strong><span><i></i>Online &middot; replies instantly</span></div>' +
        '<button type="button" class="chat-close" aria-label="Close chat">' + ICON_CLOSE + '</button>' +
      '</header>' +
      '<div class="chat-body" aria-live="polite"></div>' +
      '<div class="chat-handoff"><a href="' + waLink('Hi MMR SERVICES, I need some help.') + '" target="_blank" rel="noopener">' + ICON_WA + ' ' + CALL.label + '</a></div>' +
      '<form class="chat-form" autocomplete="off">' +
        '<input type="text" name="q" placeholder="Type your question…" aria-label="Type your question" maxlength="300">' +
        '<button type="submit" aria-label="Send">' + ICON_SEND + '</button>' +
      '</form>';

    document.body.appendChild(nudge);
    document.body.appendChild(panel);
    document.body.appendChild(launcher);
    return { launcher: launcher, panel: panel, nudge: nudge };
  }

  function init() {
    var ui = build();
    var body = ui.panel.querySelector('.chat-body');
    var form = ui.panel.querySelector('.chat-form');
    var input = form.querySelector('input');
    var started = false;

    function scroll() { body.scrollTop = body.scrollHeight; }

    function addUser(text) {
      var m = el('div', 'msg msg-user');
      m.textContent = text;              // user text is never treated as HTML
      body.appendChild(m); scroll();
    }

    function addBot(html, chips, extra) {
      var typing = el('div', 'msg msg-bot typing', '<span></span><span></span><span></span>');
      body.appendChild(typing); scroll();
      setTimeout(function () {
        typing.remove();
        var m = el('div', 'msg msg-bot', html);
        if (extra) m.appendChild(extra);
        body.appendChild(m);
        if (chips && chips.length) body.appendChild(chipRow(chips));
        scroll();
      }, 450);
    }

    function chipRow(ids) {
      var row = el('div', 'chat-chips');
      ids.forEach(function (id) {
        var t = byId[id]; if (!t) return;
        var b = el('button', 'chat-chip'); b.type = 'button';
        b.textContent = t.label;
        b.addEventListener('click', function () { ask(t.label, t); });
        row.appendChild(b);
      });
      var menu = el('button', 'chat-chip chat-chip-menu', '&#9776; Main menu'); menu.type = 'button';
      menu.addEventListener('click', function () { addUser('Main menu'); addBot('Sure, what would you like to know about?', MAIN_MENU); });
      row.appendChild(menu);
      return row;
    }

    function actions(topic) {
      var box = el('div', 'msg-actions');
      if (topic.link) {
        var a = el('a', 'msg-btn', topic.link[1] + ' &rarr;');
        a.href = topic.link[0];
        box.appendChild(a);
      }
      if (topic.wa) {
        var w = el('a', 'msg-btn msg-btn-wa', ICON_WA_WHITE + ' ' + CALL.label);
        w.href = waLink(topic.wa); w.target = '_blank'; w.rel = 'noopener';
        box.appendChild(w);
      }
      return box.childNodes.length ? box : null;
    }

    function ask(text, topic) {
      addUser(text);
      topic = topic || findTopic(text);
      if (topic) {
        var next = topic.next && topic.next.length ? topic.next : MAIN_MENU;
        addBot(topic.answer, next, actions(topic));
      } else {
        var box = el('div', 'msg-actions');
        var w = el('a', 'msg-btn msg-btn-wa', ICON_WA_WHITE + ' ' + CALL.label);
        w.href = waLink('Hi MMR SERVICES, ' + text); w.target = '_blank'; w.rel = 'noopener';
        var c = el('a', 'msg-btn', '&#128222; ' + CALL.label);
        c.href = 'tel:' + CALL.tel;
        box.appendChild(w); box.appendChild(c);
        addBot('Sorry, I don\'t have an answer for that yet. Our team can help you directly: send your question or reach us on ' + CALL.label + '.', MAIN_MENU, box);
      }
    }

    function open() {
      ui.panel.hidden = false;
      ui.nudge.classList.remove('show');
      document.body.classList.add('chat-open');
      ui.launcher.setAttribute('aria-expanded', 'true');
      ui.launcher.innerHTML = ICON_CLOSE;
      ui.launcher.setAttribute('aria-label', 'Close chat assistant');
      if (!started) {
        started = true;
        addBot('Hi! &#128075; Welcome to <b>MMR SERVICES</b>.<br>I can help with our services, rates, offices and contact details. What are you looking for?', MAIN_MENU);
      }
      if (window.innerWidth > 720) setTimeout(function () { input.focus(); }, 50);
    }

    function close() {
      ui.panel.hidden = true;
      document.body.classList.remove('chat-open');
      ui.launcher.setAttribute('aria-expanded', 'false');
      ui.launcher.innerHTML = ICON_CHAT + '<span class="chat-launcher-label">Chat with us</span>';
      ui.launcher.setAttribute('aria-label', 'Open chat assistant');
      ui.launcher.focus();
    }

    ui.launcher.addEventListener('click', function () { ui.panel.hidden ? open() : close(); });
    ui.panel.querySelector('.chat-close').addEventListener('click', close);
    ui.nudge.addEventListener('click', open);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !ui.panel.hidden) close(); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text) return;
      input.value = '';
      ask(text);
    });

    // Friendly nudge bubble after a few seconds (once per visit)
    var seen = false;
    try { seen = sessionStorage.getItem('mmr-chat-nudge') === '1'; } catch (e) {}
    if (!seen) {
      setTimeout(function () {
        if (ui.panel.hidden && !document.body.classList.contains('quote-open')) ui.nudge.classList.add('show');
        try { sessionStorage.setItem('mmr-chat-nudge', '1'); } catch (e) {}
        setTimeout(function () { ui.nudge.classList.remove('show'); }, 8000);
      }, 4000);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
