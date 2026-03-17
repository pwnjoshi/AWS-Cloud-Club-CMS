import { useLayoutEffect } from 'react';

function revealEl(el) {
  el.classList.add('opacity-100', 'translate-y-0');
  el.classList.remove('opacity-0', 'translate-y-10', 'translate-y-8');
}

/**
 * Reveals `.reveal-on-scroll` elements without flicker:
 * - Elements already in the viewport are revealed synchronously before
 *   the browser paints (useLayoutEffect), so they never flash as invisible.
 * - Off-screen elements are revealed by IntersectionObserver on first entry,
 *   then unobserved so they can never retrigger.
 */
export function useScrollReveal(selector = '.reveal-on-scroll') {
  useLayoutEffect(() => {
    const elements = Array.from(document.querySelectorAll(selector));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealEl(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // Already visible — reveal now, before the browser paints
        revealEl(el);
      } else {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [selector]);
}
