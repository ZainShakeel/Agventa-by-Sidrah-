/* ============================================================
   Augventa — Site scripts
   1. Mobile navigation toggle
   2. Reveal-on-scroll animation
   3. FAQ accordion
   4. Form validation (shared by the contact page and the modal)
   5. Service CTA modal
   6. Pre-select a service on the contact page from ?service=
   7. Footer year
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. Mobile nav ---------- */
  var burger = document.querySelector('.burger');
  var links  = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      links.classList.toggle('open');
      burger.classList.toggle('open');
      burger.setAttribute('aria-expanded', links.classList.contains('open'));
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        burger.classList.remove('open');
      });
    });
  }

  /* ---------- 2. Reveal on scroll ---------- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- 3. FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      var body = item.querySelector('.faq-a');
      var isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach(function (i) {
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

  /* ---------- 4. Form validation + submission ----------
     Shared by the full contact form and the popup enquiry form.

     Submissions POST to FormSubmit, which emails them to the address in the
     form's `action` and cc's the `_cc` hidden field. To switch provider, change
     the `action` attribute in the HTML — nothing here needs editing.

     NOTE: FormSubmit requires a one-time activation. The very first submission
     sends a confirmation link to the target address; until someone clicks it,
     nothing is delivered. */
  function wireForm(form, msgEl) {
    if (!form) return;

    var btn        = form.querySelector('button[type=submit]');
    var btnDefault = btn ? btn.textContent : '';

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
        // No endpoint configured — fall back to a normal submit.
        form.submit();
        return;
      }

      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      // FormSubmit's AJAX endpoint keeps the user on the page.
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
        say('⚠️ Sorry, that didn’t send. Please email us directly at Sidrah@adventa.com or call +92 332 4322045.', true);
      })
      .finally(function () {
        if (btn) { btn.disabled = false; btn.textContent = btnDefault; }
      });
    });

    form.querySelectorAll('[data-required]').forEach(function (input) {
      input.addEventListener('input', function () { mark(input, false); });
    });
  }

  wireForm(document.getElementById('contactForm'), document.getElementById('formSuccess'));
  wireForm(document.getElementById('modalForm'),   document.getElementById('modalSuccess'));

  /* ---------- 5. Service CTA modal ----------
     Each service card links to contact.html?service=xxx. If JS is available we
     intercept that and open the popup instead, so the CTA still works with
     JS disabled rather than being a dead button. */
  var modal = document.getElementById('ctaModal');
  if (modal) {
    var svcField   = document.getElementById('modalService');
    var svcLabel   = document.getElementById('modalServiceLabel');
    var modalForm  = document.getElementById('modalForm');
    var fullLink   = document.getElementById('modalFullLink');
    var lastFocus  = null;

    function openModal(value, label) {
      lastFocus = document.activeElement;
      if (svcField) svcField.value = value || '';
      if (svcLabel) svcLabel.textContent = label || 'Enquiry';
      if (fullLink && value) fullLink.href = 'contact.html?service=' + encodeURIComponent(value);

      modal.classList.add('open');
      document.body.classList.add('modal-open');

      var firstInput = modal.querySelector('input:not([type=hidden]), textarea');
      if (firstInput) firstInput.focus();
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
      if (modalForm) {
        modalForm.querySelectorAll('.field.invalid').forEach(function (f) {
          f.classList.remove('invalid');
        });
      }
      if (lastFocus) lastFocus.focus();
    }

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

  /* ---------- 6. Pre-select a service on the contact page ----------
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

  /* ---------- 7. Footer year ---------- */
  document.querySelectorAll('.year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

});
