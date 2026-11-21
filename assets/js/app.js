/* Just Imagine Heating — interaction layer (vanilla, no dependencies) */
(function () {
  "use strict";

  var doc = document;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header state ---------- */
  var header = doc.getElementById("siteHeader");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = doc.querySelector(".nav-toggle");
  var menu = doc.getElementById("mobileMenu");

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    doc.body.style.overflow = open ? "hidden" : "";
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add("is-open"); });
    } else {
      menu.classList.remove("is-open");
      window.setTimeout(function () { menu.hidden = true; }, 260);
    }
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 920 && toggle.getAttribute("aria-expanded") === "true") setMenu(false);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealables = [].slice.call(doc.querySelectorAll("[data-reveal]"));
  if (revealables.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealables.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      revealables.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Accordions: keep one open at a time per group ---------- */
  [].slice.call(doc.querySelectorAll("[data-accordion]")).forEach(function (group) {
    var items = [].slice.call(group.querySelectorAll("details"));
    items.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (!item.open) return;
        items.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      });
    });
  });

  /* ---------- Quote Form (Direct WhatsApp Lead Submission) ---------- */
  var WA_PHONE = "447774079152";

  var form = doc.querySelector("[data-quote-form]");
  if (form) {
    var status = form.querySelector("[data-form-status]");

    function showStatus(type, message) {
      if (!status) return;
      status.className = "form__status is-visible is-" + type;
      status.textContent = message;
    }

    function fieldOf(input) { return input.closest(".field"); }

    function validate() {
      var firstInvalid = null;
      [].slice.call(form.querySelectorAll("[required]")).forEach(function (input) {
        var field = fieldOf(input);
        var value = (input.value || "").trim();
        var invalid = false;

        if (input.type === "checkbox") {
          invalid = !input.checked;
        } else if (input.type === "tel") {
          invalid = value.replace(/[^\d]/g, "").length < 9;
        } else {
          invalid = value.length < 2;
        }

        if (field) {
          field.classList.toggle("has-error", invalid);
        }
        if (invalid && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) firstInvalid.focus();
      return !firstInvalid;
    }

    form.addEventListener("input", function (e) {
      var field = fieldOf(e.target);
      if (field && field.classList.contains("has-error")) {
        field.classList.remove("has-error");
      }
    });

    form.addEventListener("change", function (e) {
      var field = fieldOf(e.target);
      if (field && field.classList.contains("has-error")) {
        field.classList.remove("has-error");
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) {
        showStatus("err", "Please fill in your details and accept consent.");
        return;
      }

      var data = new FormData(form);
      var name = String(data.get("name") || "").trim();
      var phone = String(data.get("phone") || "").trim();
      var postcode = String(data.get("postcode") || "").trim();
      var service = String(data.get("service") || "").trim();
      var message = String(data.get("message") || "").trim();

      var quoteMsg = "Hello Just Imagine Heating, here is my quote enquiry from your website:\n";
      quoteMsg += "• Name: " + name + "\n";
      quoteMsg += "• Phone: " + phone + "\n";
      quoteMsg += "• Postcode: " + postcode;
      if (service) quoteMsg += "\n• Service: " + service;
      if (message) quoteMsg += "\n• Details: " + message;

      showStatus("ok", "Opening WhatsApp with your quote details...");

      var waUrl = "https://wa.me/" + WA_PHONE + "?text=" + encodeURIComponent(quoteMsg);
      window.open(waUrl, "_blank");
    });
  }

  /* ---------- Cookie / storage notice ---------- */
  var notice = doc.getElementById("cookieNotice");
  var STORAGE_KEY = "jih-consent";
  if (notice) {
    var stored = null;
    try { stored = window.localStorage.getItem(STORAGE_KEY); } catch (err) { stored = null; }
    if (!stored) {
      window.setTimeout(function () { notice.classList.add("is-visible"); }, 1200);
    }
    notice.addEventListener("click", function (e) {
      var choice = e.target.getAttribute("data-consent");
      if (!choice) return;
      try { window.localStorage.setItem(STORAGE_KEY, choice); } catch (err) { /* storage blocked */ }
      notice.classList.remove("is-visible");
      if (choice === "accepted" && typeof window.loadAnalytics === "function") {
        window.loadAnalytics();
      }
    });
  }

  /* ---------- Current year ---------- */
  [].slice.call(doc.querySelectorAll("[data-year]")).forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });



  /* ---------- Premium Centered Preloader Dismissal ---------- */
  function dismissPreloader() {
    var p = doc.getElementById("sitePreloader");
    if (p && !p.classList.contains("is-loaded")) {
      p.classList.add("is-loaded");
      window.setTimeout(function () {
        if (p && p.parentNode) p.parentNode.removeChild(p);
      }, 400);
    }
  }
  if (doc.readyState === "complete" || doc.readyState === "interactive") {
    window.setTimeout(dismissPreloader, 320);
  } else {
    doc.addEventListener("DOMContentLoaded", function () {
      window.setTimeout(dismissPreloader, 280);
    });
    window.addEventListener("load", dismissPreloader);
  }
  window.setTimeout(dismissPreloader, 750);

  /* ---------- Global Compact Floating WhatsApp Button ---------- */
  if (!doc.querySelector(".floating-whatsapp")) {
    var floatWa = doc.createElement("a");
    floatWa.className = "floating-whatsapp";
    var isAreaPage = window.location.pathname.indexOf("/areas/") !== -1;
    var isContactPage = window.location.pathname.indexOf("contact.html") !== -1;
    if (isContactPage) {
      floatWa.href = "#quote-form";
      floatWa.setAttribute("data-scroll-quote", "");
    } else if (isAreaPage) {
      floatWa.href = "../contact.html#quote-form";
    } else {
      floatWa.href = "contact.html#quote-form";
    }
    floatWa.setAttribute("aria-label", "Request WhatsApp Quote");
    floatWa.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg><span>WhatsApp Quote</span>';
    doc.body.appendChild(floatWa);
  }

  // Auto-hide floating button when quote form is visible so it never overlaps form buttons
  var quoteSection = doc.getElementById("quote") || doc.querySelector("[data-quote-form]");
  if (quoteSection && "IntersectionObserver" in window) {
    var quoteObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var floatBtn = doc.querySelector(".floating-whatsapp");
        if (floatBtn) {
          floatBtn.classList.toggle("is-hidden", entry.isIntersecting);
        }
      });
    }, { threshold: 0.15 });
    quoteObserver.observe(quoteSection);
  }

  /* ---------- Smooth Scroll to Quote Form ---------- */
  doc.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-scroll-quote], a[href='#quote'], a[href='#quote-form']");
    if (!trigger) return;
    var target = doc.getElementById("quote-form") || doc.getElementById("quote") || doc.querySelector("[data-quote-form]");
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      var firstInput = target.querySelector("input:not([type='hidden']), select, textarea");
      if (firstInput) {
        window.setTimeout(function () {
          try { firstInput.focus({ preventScroll: true }); } catch (err) {}
        }, 450);
      }
    }
  });

  /* ---------- Handle incoming hash scroll (e.g. from Get a quote CTA) ---------- */
  function checkInitialHash() {
    if (window.location.hash === "#quote-form" || window.location.hash === "#quote") {
      var target = doc.getElementById("quote-form") || doc.getElementById("quote") || doc.querySelector("[data-quote-form]");
      if (target) {
        window.setTimeout(function () {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          var firstInput = target.querySelector("input:not([type='hidden']), select, textarea");
          if (firstInput) {
            window.setTimeout(function () {
              try { firstInput.focus({ preventScroll: true }); } catch (err) {}
            }, 350);
          }
        }, 360);
      }
    }
  }
  if (doc.readyState === "complete") {
    checkInitialHash();
  } else {
    window.addEventListener("load", checkInitialHash);
  }

})();
