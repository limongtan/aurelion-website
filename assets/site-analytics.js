/*
 * Aurelion site analytics.
 *
 * Paste the IDs below to switch tracking on. While both are empty this file
 * does nothing, so it is safe to ship before the accounts exist.
 *   GA4_ID      Google Analytics 4 measurement ID, looks like "G-XXXXXXXXXX"
 *   CLARITY_ID  Microsoft Clarity project ID, looks like "abcd1234ef"
 *
 * Events sent (GA4 event name, plus a Clarity custom event of the same name):
 *   whatsapp_click       any wa.me link       (label = course/section, page)
 *   email_click          any mailto: link
 *   phone_click          any tel: link
 *   enquiry_form_click   the external enquiry form (FormHug)
 *   enquiry_form_submit  the homepage "Continue in WhatsApp" form
 *   growth_report_click  Aurelion Insights / Life Garden report links
 *   course_open          a course "See what's inside" button on HRD Courses
 *   price_list_click     the website price list PDF
 */
(() => {
  const GA4_ID = "";
  const CLARITY_ID = "";

  if (!GA4_ID && !CLARITY_ID) return;
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1") return;

  if (GA4_ID) {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA4_ID);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA4_ID, { anonymize_ip: true });
  }

  if (CLARITY_ID) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_ID);
  }

  const send = (name, params) => {
    const data = Object.assign({ page_path: location.pathname }, params || {});
    try { if (window.gtag) window.gtag("event", name, data); } catch (e) {}
    try { if (window.clarity) { window.clarity("event", name); if (data.label) window.clarity("set", name, String(data.label).slice(0, 100)); } } catch (e) {}
  };
  window.aurelionTrack = send;

  // The nearest heading or labelled card tells us which course/section the click came from.
  const contextOf = (el) => {
    const card = el.closest("[data-course], [data-track], article, section, .card, li");
    const named = card && (card.getAttribute("data-course") || card.getAttribute("data-track"));
    if (named) return named;
    const h = card && card.querySelector("h1, h2, h3, h4");
    return (h ? h.textContent : el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);
  };

  document.addEventListener("click", (event) => {
    const el = event.target instanceof Element ? event.target.closest("a[href], button") : null;
    if (!el) return;
    const href = el.getAttribute("href") || "";
    const label = contextOf(el);
    if (/wa\.me\/|api\.whatsapp\.com/.test(href)) return send("whatsapp_click", { label, link_text: el.textContent.trim().slice(0, 60) });
    if (href.startsWith("mailto:")) return send("email_click", { label });
    if (href.startsWith("tel:")) return send("phone_click", { label });
    if (/formhug\.ai/.test(href)) return send("enquiry_form_click", { label });
    if (/insights\.aurelion-earth\.com|life-gardens\.com/.test(href)) return send("growth_report_click", { label });
    if (/price-list\.pdf/.test(href)) return send("price_list_click", { label });
    if (el.tagName === "BUTTON" && /see what.s inside/i.test(el.textContent)) return send("course_open", { label });
  }, { capture: true });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const interest = form.querySelector("select");
    send("enquiry_form_submit", { label: interest ? interest.value : form.id || "form" });
  }, { capture: true });
})();
