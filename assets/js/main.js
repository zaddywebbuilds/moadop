(function () {
  'use strict';

  // Orders only post to the live CRM from the real domain. Anywhere else
  // (GitHub Pages preview, local file) the form confirms without sending,
  // so demos never create real orders in the client's pipeline.
  var LIVE_HOSTS = ['moadop.com', 'www.moadop.com'];
  var IS_LIVE = LIVE_HOSTS.indexOf(location.hostname) !== -1;

  var NGN = function (n) { return '₦' + n.toLocaleString('en-NG'); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- analytics shim: never throws if pixels are absent ---------- */
  function track(name, params) {
    params = params || {};
    try { if (window.dataLayer) window.dataLayer.push(Object.assign({ event: name }, params)); } catch (e) {}
    try { if (window.fbq) window.fbq('track', name, params); } catch (e) {}
    try { if (window.gtag) window.gtag('event', name, params); } catch (e) {}
  }

  /* ---------- year ---------- */
  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- states ---------- */
  var STATES = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
    'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo','Jigawa',
    'Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun',
    'Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'];
  var stateSel = $('#state');
  if (stateSel) {
    var frag = document.createDocumentFragment();
    STATES.forEach(function (s) {
      var o = document.createElement('option'); o.value = s; o.textContent = s; frag.appendChild(o);
    });
    stateSel.appendChild(frag);
  }

  /* ---------- attribution passthrough ---------- */
  (function captureAttribution() {
    var qs = new URLSearchParams(location.search);
    var keys = ['gclid','fbclid','ttclid','utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
    keys.forEach(function (k) {
      var el = document.getElementById('f_' + k);
      if (!el) return;
      var v = qs.get(k);
      if (!v) { try { v = sessionStorage.getItem('moadop_' + k) || ''; } catch (e) { v = ''; } }
      else { try { sessionStorage.setItem('moadop_' + k, v); } catch (e) {} }
      el.value = v || '';
    });
    var src = document.getElementById('f_source_url');
    if (src) src.value = location.href;
  })();

  /* ---------- package selection ---------- */
  var PACKS = {
    '20': { label: '1 Pack',  price: 18500, days: '10 day supply' },
    '21': { label: '2 Packs', price: 29500, days: '20 day supply' },
    '22': { label: '3 Packs', price: 43500, days: '30 day routine' },
    '23': { label: '4 Packs', price: 54500, days: '40 day supply' }
  };
  var pkgSel = $('#package');
  var sumPack = $('#sumPack'), sumPrice = $('#sumPrice');
  var stickyPrice = $('#stickyPrice'), stickyPack = $('#stickyPack');

  function applyPack(val, fromRadio) {
    var p = PACKS[val]; if (!p) return;
    if (pkgSel && pkgSel.value !== val) pkgSel.value = val;
    if (!fromRadio) {
      var r = $('input[name="packpick"][value="' + val + '"]');
      if (r) r.checked = true;
    }
    if (sumPack) sumPack.textContent = p.label + ' · ' + p.days;
    if (sumPrice) sumPrice.textContent = NGN(p.price);
    if (stickyPrice) stickyPrice.textContent = NGN(p.price);
    if (stickyPack) stickyPack.textContent = p.label + ' · free delivery';
  }

  $$('input[name="packpick"]').forEach(function (r) {
    r.addEventListener('change', function () {
      if (!r.checked) return;
      applyPack(r.value, true);
      track('SelectPackage', { package: PACKS[r.value].label, value: PACKS[r.value].price, currency: 'NGN' });
    });
  });
  if (pkgSel) {
    pkgSel.addEventListener('change', function () { applyPack(pkgSel.value, false); });
    applyPack(pkgSel.value, false);
  }

  /* ---------- sticky bar ---------- */
  var sticky = $('#stickyBar'), hero = $('.hero'), orderSec = $('#order');
  if (sticky && hero) {
    sticky.hidden = false;
    document.body.classList.add('has-sticky');
    var showSticky = function (on) { sticky.classList.toggle('show', on); };
    if ('IntersectionObserver' in window) {
      var pastHero = false, inOrder = false;
      new IntersectionObserver(function (es) {
        pastHero = !es[0].isIntersecting; showSticky(pastHero && !inOrder);
      }, { rootMargin: '-120px 0px 0px 0px' }).observe(hero);
      if (orderSec) {
        new IntersectionObserver(function (es) {
          inOrder = es[0].isIntersecting; showSticky(pastHero && !inOrder);
        }, { threshold: 0.12 }).observe(orderSec);
      }
    } else { showSticky(true); }
  }

  /* ---------- nav shadow ---------- */
  var nav = $('#nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 10); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* ---------- youtube facade (keeps the page fast) ---------- */
  $$('.vid').forEach(function (v) {
    var id = v.getAttribute('data-yt'); if (!id) return;
    var thumb = new Image();
    thumb.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
    thumb.alt = 'Customer video review of Moadop Herbal Tea';
    thumb.loading = 'lazy'; thumb.decoding = 'async';
    v.insertBefore(thumb, v.firstChild);
    var btn = $('.vid__btn', v);
    if (!btn) return;
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1';
      f.title = 'Customer video review';
      f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      f.setAttribute('allowfullscreen', '');
      f.loading = 'lazy';
      v.appendChild(f);
      btn.remove();
      track('PlayTestimonial', { video_id: id });
    });
  });

  /* ---------- copy NAFDAC number ---------- */
  $$('.copybtn').forEach(function (b) {
    b.addEventListener('click', function () {
      var txt = b.getAttribute('data-copy') || '';
      var done = function () {
        var old = b.textContent; b.textContent = 'Copied'; b.classList.add('done');
        setTimeout(function () { b.textContent = old; b.classList.remove('done'); }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(done).catch(done);
      } else { done(); }
    });
  });

  /* ---------- whatsapp mirrors phone ---------- */
  var phone = $('#phone_number'), wa = $('#whatsapp_number'), same = $('#sameWa');
  function syncWa() { if (same && same.checked && phone && wa) wa.value = phone.value; }
  if (phone) phone.addEventListener('input', syncWa);
  if (same) same.addEventListener('change', function () {
    if (wa) wa.disabled = same.checked;
    syncWa();
  });
  if (same && wa) { wa.disabled = same.checked; syncWa(); }

  /* ---------- cta tracking ---------- */
  $$('[data-track]').forEach(function (el) {
    el.addEventListener('click', function () {
      var n = el.getAttribute('data-track');
      track(n === 'submit_order' ? 'InitiateCheckout' : 'CTAClick', { placement: n });
    });
  });

  /* ---------- validation + submit ---------- */
  var form = $('#orderForm'), okBox = $('#orderOk'), okBody = $('#okBody'), btn = $('#submitBtn');

  function setErr(el, msg) {
    clearErr(el);
    el.classList.add('err');
    var s = document.createElement('span');
    s.className = 'msg'; s.textContent = msg;
    el.parentNode.appendChild(s);
  }
  function clearErr(el) {
    el.classList.remove('err');
    var m = el.parentNode.querySelector('.msg');
    if (m) m.remove();
  }
  function validPhone(v) {
    var d = (v || '').replace(/\D/g, '');
    return d.length >= 10 && d.length <= 15;
  }

  if (form) {
    ['full_name', 'phone_number', 'address', 'state'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () { clearErr(el); });
      if (el) el.addEventListener('change', function () { clearErr(el); });
    });

    form.addEventListener('submit', function (e) {
      syncWa();
      var bad = null;

      var name = $('#full_name');
      if (!name.value.trim() || name.value.trim().length < 3) { setErr(name, 'Please enter your full name'); bad = bad || name; }

      var ph = $('#phone_number');
      if (!validPhone(ph.value)) { setErr(ph, 'Enter a valid phone number we can call'); bad = bad || ph; }

      var st = $('#state');
      if (!st.value) { setErr(st, 'Choose your delivery state'); bad = bad || st; }

      var ad = $('#address');
      if (!ad.value.trim() || ad.value.trim().length < 10) { setErr(ad, 'Give a full address with a landmark'); bad = bad || ad; }

      if (bad) {
        e.preventDefault();
        bad.focus();
        bad.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      var p = PACKS[pkgSel.value] || {};
      track('Purchase', { value: p.price, currency: 'NGN', package: p.label, state: st.value });

      if (!IS_LIVE) {
        // Preview build: confirm visually, do not touch the live CRM.
        e.preventDefault();
        form.querySelectorAll('fieldset, #submitBtn, .order__summary').forEach(function (n) { n.style.display = 'none'; });
        if (okBody) {
          okBody.textContent = 'Thank you ' + name.value.trim().split(' ')[0] +
            '. Your order for ' + (p.label || 'your pack') + ' (' + NGN(p.price || 0) +
            ') to ' + st.value + ' has been received. Our team will call ' + ph.value +
            ' shortly to confirm delivery. [Preview build: no order was sent to the live system.]';
        }
        if (okBox) { okBox.hidden = false; okBox.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        return;
      }

      if (btn) { btn.disabled = true; btn.textContent = 'Submitting your order…'; }
    });
  }

  /* ---------- reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    var targets = $$('.card, .ing, .step, .pack, .audio, .vid, .chatgrid figure, .assure__item, .verify__shot, .formula__side, .guarantee__in, .faq details');
    targets.forEach(function (t) { t.classList.add('rv'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        var el = en.target;
        setTimeout(function () { el.classList.add('in'); }, Math.min(i * 55, 280));
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (t) { io.observe(t); });

    // Nothing on a sales page may depend on an animation firing. If the observer
    // is starved or throttled, show everything anyway.
    setTimeout(function () { targets.forEach(function (t) { t.classList.add('in'); }); }, 3000);
  }

  /* ---------- fire a view event ---------- */
  track('ViewContent', { content_name: 'Moadop Herbal Tea', content_type: 'product', currency: 'NGN', value: 18500 });
})();
