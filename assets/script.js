/* ============================================================
   AUGVENTA — Site scripts
    1. Sticky-header shadow
    2. Mobile navigation
    3. Reveal-on-scroll
    4. Tech / Non-Tech service toggle
    5. Animated stat counters
    6. Rotating carousels (stats bar, case studies, testimonials)
    7. FAQ accordion
    8. Form validation + submission (contact page and modal)
    9. Service CTA modal
   10. Pre-select a service on the contact page from ?service=
   11. Newsletter sign-up
   12. Footer year
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Sticky-header shadow ---------- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 2. Mobile navigation ---------- */
  var burger = document.getElementById('burger');
  var links  = document.getElementById('navLinks');

  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });

    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 3. Reveal on scroll ---------- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- 4. Tech / Non-Tech service toggle ----------
     Both rows are shown by default (as in the approved design). Picking a
     track narrows the grid to just that side; picking the same track again
     brings both rows back. */
  var toggleBtns = document.querySelectorAll('.toggle [data-track]');
  var trackTech  = document.getElementById('trackTech');
  var trackNon   = document.getElementById('trackNonTech');
  var activeTrack = null;

  if (toggleBtns.length && trackTech && trackNon) {
    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var want = btn.getAttribute('data-track');
        activeTrack = (activeTrack === want) ? null : want;

        toggleBtns.forEach(function (b) {
          var on = b.getAttribute('data-track') === activeTrack || (!activeTrack && b === toggleBtns[0]);
          b.classList.toggle('on', on);
          b.setAttribute('aria-selected', String(on));
        });

        trackTech.classList.toggle('hide', activeTrack === 'nontech');
        trackNon.classList.toggle('hide',  activeTrack === 'tech');
      });
    });
  }

  /* ---------- 5. Animated stat counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduceMotion || isNaN(target)) { el.textContent = target + suffix; return; }

      var start = null, dur = 1400;
      var tick = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0' + suffix;
      requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { co.observe(el); });
    }
  }

  /* ---------- 6. Rotating carousels ----------
     One small helper drives the stats bar, the case studies and the
     testimonials. "Next" moves the first card to the end of the row, so the
     controls stay meaningful at every screen width — including desktop,
     where every card is already visible. */
  function makeRotator(track, opts) {
    if (!track) return null;
    opts = opts || {};
    var count = track.children.length;
    var index = 0;

    var paint = function () {
      if (!opts.dots) return;
      opts.dots.forEach(function (d, i) { d.classList.toggle('on', i === index); });
    };

    var step = function (dir) {
      if (count < 2) return;
      if (dir > 0) track.appendChild(track.firstElementChild);
      else track.insertBefore(track.lastElementChild, track.firstElementChild);

      index = (index + dir + count) % count;
      paint();

      if (!reduceMotion) {
        track.style.transition = 'none';
        track.style.opacity = '.35';
        requestAnimationFrame(function () {
          track.style.transition = 'opacity .35s ease';
          track.style.opacity = '1';
        });
      }
    };

    var goTo = function (target) {
      var diff = (target - index + count) % count;
      for (var i = 0; i < diff; i++) step(1);
    };

    if (opts.prev) opts.prev.addEventListener('click', function () { step(-1); });
    if (opts.next) opts.next.addEventListener('click', function () { step(1); });
    if (opts.dots) {
      opts.dots.forEach(function (d, i) {
        d.addEventListener('click', function () { goTo(i); });
      });
    }
    paint();
    return { step: step, goTo: goTo };
  }

  var dotsFor = function (id) {
    var group = document.querySelector('[data-dots-for="' + id + '"]');
    return group ? Array.prototype.slice.call(group.querySelectorAll('.dot')) : null;
  };

  // Stats bar
  var statsBar = document.getElementById('statsBar');
  makeRotator(document.getElementById('statsTrack'), {
    prev: statsBar ? statsBar.querySelector('.arw.prev') : null,
    next: statsBar ? statsBar.querySelector('.arw.next') : null
  });

  // Case studies
  makeRotator(document.getElementById('casesGrid'), { dots: dotsFor('casesGrid') });

  // Testimonials
  makeRotator(document.getElementById('tstCards'), {
    prev: document.querySelector('[data-tst="prev"]'),
    next: document.querySelector('[data-tst="next"]'),
    dots: dotsFor('tstCards')
  });

  /* ---------- 7. FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item   = btn.parentElement;
      var body   = item.querySelector('.faq-a');
      var isOpen = item.classList.contains('open');

      var scope = item.closest('.faq-list, .faq') || document;
      scope.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('open');
        i.querySelector('.faq-a').style.maxHeight = null;
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- 8. Form validation + submission ----------
     Shared by the full contact form and the popup enquiry form.

     Submissions POST to FormSubmit, which emails them to the address in the
     form's `action` and cc's the `_cc` hidden field. To switch provider,
     change the `action` attribute in the HTML — nothing here needs editing.

     NOTE: FormSubmit requires a one-time activation. The very first
     submission sends a confirmation link to the target address; until
     someone clicks it, nothing is delivered. */
  function wireForm(form, msgEl) {
    if (!form) return;

    var btn        = form.querySelector('button[type=submit]');
    var btnDefault = btn ? btn.innerHTML : '';

    var mark = function (input, bad) {
      var field = input.closest('.field');
      if (field) field.classList.toggle('invalid', bad);
    };

    var say = function (text, isError) {
      if (!msgEl) return;
      msgEl.textContent = text;
      msgEl.classList.toggle('error', !!isError);
      msgEl.classList.add('show');
      msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll('[data-required]').forEach(function (input) {
        var val = (input.value || '').trim();
        var bad = val === '';
        if (!bad && input.type === 'email') {
          bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
        }
        mark(input, bad);
        if (bad) valid = false;
      });

      if (!valid) {
        var first = form.querySelector('.field.invalid input, .field.invalid select, .field.invalid textarea');
        if (first) first.focus();
        return;
      }

      if (!form.action || form.action.indexOf('formsubmit') === -1) {
        form.submit();   // no endpoint configured — fall back to a normal submit
        return;
      }

      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function () {
        say('✅ Thanks — your message is on its way. We reply within one working day.', false);
        form.reset();
      })
      .catch(function () {
        say('⚠️ Sorry, that didn’t send. Please email us directly at sidrah@augventa.com or call +92 332 4322045.', true);
      })
      .finally(function () {
        if (btn) { btn.disabled = false; btn.innerHTML = btnDefault; }
      });
    });

    form.querySelectorAll('[data-required]').forEach(function (input) {
      input.addEventListener('input', function () { mark(input, false); });
    });
  }

  wireForm(document.getElementById('contactForm'), document.getElementById('formSuccess'));
  wireForm(document.getElementById('modalForm'),   document.getElementById('modalSuccess'));

  /* ---------- 9. Service CTA modal ----------
     Each service card links to contact.html?service=xxx. If JS is available
     we intercept that and open the popup instead, so the CTA still works
     with JS disabled rather than being a dead button. */
  var modal = document.getElementById('ctaModal');
  if (modal) {
    var svcField  = document.getElementById('modalService');
    var svcLabel  = document.getElementById('modalServiceLabel');
    var modalForm = document.getElementById('modalForm');
    var fullLink  = document.getElementById('modalFullLink');
    var lastFocus = null;

    var openModal = function (value, label) {
      lastFocus = document.activeElement;
      if (svcField) svcField.value = value || '';
      if (svcLabel) svcLabel.textContent = label || 'Enquiry';
      if (fullLink && value) fullLink.href = 'contact.html?service=' + encodeURIComponent(value);

      modal.classList.add('open');
      document.body.classList.add('modal-open');

      var firstInput = modal.querySelector('input:not([type=hidden]), textarea');
      if (firstInput) firstInput.focus();
    };

    var closeModal = function () {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
      if (modalForm) {
        modalForm.querySelectorAll('.field.invalid').forEach(function (f) {
          f.classList.remove('invalid');
        });
      }
      if (lastFocus) lastFocus.focus();
    };

    document.querySelectorAll('[data-cta]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(el.getAttribute('data-cta'), el.getAttribute('data-cta-label'));
      });
    });

    modal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    // Keep tab focus inside the dialog while it's open
    modal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = modal.querySelectorAll('button, input, textarea, select, a[href]');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------- 10. Pre-select a service on the contact page ----------
     So contact.html?service=gcp lands with GCP Integration already chosen. */
  var serviceSelect = document.getElementById('service');
  if (serviceSelect && window.location.search) {
    var wanted = new URLSearchParams(window.location.search).get('service');
    if (wanted) {
      var match = serviceSelect.querySelector('option[value="' + CSS.escape(wanted) + '"]');
      if (match) {
        serviceSelect.value = wanted;
        serviceSelect.closest('.field').scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  /* ---------- 11. Newsletter sign-up ----------
     Posts to the same FormSubmit inbox as the contact form. */
  var newsForm = document.getElementById('newsForm');
  if (newsForm) {
    newsForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = document.getElementById('newsEmail');
      var msg   = document.getElementById('newsMsg');
      var val   = (input.value || '').trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
        msg.textContent = 'Please enter a valid email address.';
        input.focus();
        return;
      }

      msg.textContent = 'Subscribing…';
      fetch('https://formsubmit.co/ajax/shakeelzain04@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: 'New newsletter subscriber — Augventa',
          _cc: 'sidrah@augventa.com',
          _captcha: 'false',
          email: val
        })
      })
      .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
      .then(function () { msg.textContent = '✅ Subscribed. Thanks!'; newsForm.reset(); })
      .catch(function () { msg.textContent = 'Could not subscribe — email us at sidrah@augventa.com.'; });
    });
  }

  /* ---------- 12. Footer year ---------- */
  document.querySelectorAll('.year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

});
