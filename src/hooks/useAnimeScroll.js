import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

export function useAnimeScroll(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      delay = 0,
      duration = 800,
      easing = 'easeOutCubic',
      translateY = [30, 0],
      opacity = [0, 1],
      staggerDelay = 0,
      threshold = 0.15,
    } = options;

    if (staggerDelay && el.children.length > 0) {
      Array.from(el.children).forEach((child) => {
        child.style.opacity = '0';
      });
    } else {
      el.style.opacity = '0';
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            try {
              if (staggerDelay && el.children.length > 0) {
                animate(el.children, {
                  translateY: translateY,
                  opacity: opacity,
                  duration: duration,
                  delay: stagger(staggerDelay, { start: delay }),
                  ease: easing,
                });
              } else {
                animate(el, {
                  translateY: translateY,
                  opacity: opacity,
                  duration: duration,
                  delay: delay,
                  ease: easing,
                });
              }
            } catch (err) {
              // Fallback DOM transition if animation fails
              if (el) el.style.opacity = '1';
            }

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [options]);

  return ref;
}

export function useAnimeCounter(targetValue, duration = 1500) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || targetValue === undefined || targetValue === null) return;

    const num = parseFloat(targetValue.toString().replace(/[^0-9.]/g, '')) || 0;
    const suffix = targetValue.toString().replace(/[0-9.]/g, '');

    const obj = { count: 0 };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            try {
              animate(obj, {
                count: num,
                duration: duration,
                ease: 'easeOutQuad',
                onUpdate: function () {
                  if (el) {
                    el.textContent = `${Math.round(obj.count)}${suffix}`;
                  }
                },
              });
            } catch (e) {
              if (el) el.textContent = `${num}${suffix}`;
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [targetValue, duration]);

  return ref;
}
