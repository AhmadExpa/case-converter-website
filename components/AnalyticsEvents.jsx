import { useEffect } from 'react';

const CLICK_SELECTOR =
  '[data-ga-event], a, button, [role="button"], input[type="button"], input[type="submit"]';
const DOWNLOAD_PATTERN =
  /\.(7z|csv|docx?|gif|jpe?g|json|mp3|mp4|mov|pdf|png|pptx?|rar|svg|txt|webm|webp|xlsx?|xml|zip)$/i;

function cleanText(value, maxLength = 100) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function cleanEventName(value) {
  return cleanText(value, 40)
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function getElementLabel(element) {
  const explicit =
    element.getAttribute('data-ga-label') ||
    element.getAttribute('aria-label') ||
    element.getAttribute('title') ||
    element.getAttribute('name') ||
    element.getAttribute('id');

  if (explicit) return cleanText(explicit);

  if (element instanceof HTMLInputElement) {
    return cleanText(element.name || element.type || element.id);
  }

  return cleanText(element.textContent) || element.tagName.toLowerCase();
}

function getSection(element) {
  const explicit = element.closest('[data-ga-section]')?.getAttribute('data-ga-section');
  if (explicit) return cleanText(explicit, 60);
  if (element.closest('nav')) return 'navigation';
  if (element.closest('header')) return 'header';
  if (element.closest('footer')) return 'footer';
  if (element.closest('form')) return 'form';
  if (element.closest('main')) return 'main';
  return 'content';
}

function getLinkInfo(element) {
  const anchor = element.closest('a[href]');
  if (!anchor) return {};

  const rawHref = anchor.getAttribute('href') || '';

  try {
    const url = new URL(rawHref, window.location.href);
    const protocol = url.protocol.toLowerCase();
    const isMail = protocol === 'mailto:';
    const isTel = protocol === 'tel:';
    const isDownload = anchor.hasAttribute('download') || DOWNLOAD_PATTERN.test(url.pathname);
    const isOutbound =
      !isMail && !isTel && Boolean(url.hostname) && url.hostname !== window.location.hostname;

    return {
      href: url.href,
      linkDomain: url.hostname,
      isDownload,
      isOutbound,
      isMail,
      isTel,
    };
  } catch {
    return { href: rawHref };
  }
}

function getEventName(element, label, section, linkInfo) {
  const explicit = element.getAttribute('data-ga-event');
  if (explicit) return cleanEventName(explicit) || 'custom_click';

  if (linkInfo.isDownload || /\b(download|export|save file)\b/i.test(label)) {
    return 'file_download';
  }

  if (linkInfo.isMail || linkInfo.isTel) return 'contact_click';
  if (linkInfo.isOutbound) return 'outbound_click';
  if (section === 'navigation' || section === 'header' || section === 'footer') {
    return 'navigation_click';
  }

  if (/\b(pricing|subscribe|upgrade|trial|checkout|billing|account|login|sign up)\b/i.test(label)) {
    return 'subscription_click';
  }

  if (
    /\b(calculate|convert|generate|copy|reset|save|start|stop|merge|compress|reorder|spin|roll|pick|format)\b/i.test(
      label,
    )
  ) {
    return 'tool_interaction';
  }

  return 'cta_click';
}

export function sendAnalyticsEvent(eventName, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  const sanitizedParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ''),
  );

  window.gtag('event', cleanEventName(eventName) || 'custom_event', {
    event_category: 'engagement',
    ...sanitizedParams,
  });
}

export default function AnalyticsEvents() {
  useEffect(() => {
    const handleClick = (event) => {
      if (!(event.target instanceof Element)) return;

      const element = event.target.closest(CLICK_SELECTOR);
      if (!(element instanceof Element) || element.closest('[data-ga-ignore="true"]')) return;

      const label = getElementLabel(element);
      const section = getSection(element);
      const linkInfo = getLinkInfo(element);
      const eventName = getEventName(element, label, section, linkInfo);

      sendAnalyticsEvent(eventName, {
        event_label: label,
        element_type: element.tagName.toLowerCase(),
        link_url: linkInfo.href,
        link_domain: linkInfo.linkDomain,
        page_path: `${window.location.pathname}${window.location.search}`,
        page_title: document.title,
        section,
      });
    };

    const handleSubmit = (event) => {
      const form = event.target instanceof HTMLFormElement ? event.target : null;
      if (!form || form.closest('[data-ga-ignore="true"]')) return;

      sendAnalyticsEvent(form.getAttribute('data-ga-submit-event') || 'form_submit', {
        event_label: cleanText(form.getAttribute('data-ga-label') || form.id || form.name || 'form'),
        form_id: cleanText(form.id),
        form_name: cleanText(form.name),
        page_path: `${window.location.pathname}${window.location.search}`,
        page_title: document.title,
        section: getSection(form),
      });
    };

    document.addEventListener('click', handleClick, { capture: true });
    document.addEventListener('submit', handleSubmit, { capture: true });

    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
      document.removeEventListener('submit', handleSubmit, { capture: true });
    };
  }, []);

  return null;
}
