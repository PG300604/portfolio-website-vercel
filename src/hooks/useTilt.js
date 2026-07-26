import { useRef, useCallback } from 'react';

export function useTilt(options = {}) {
  const ref = useRef(null);
  const { max = 12, scale = 1.02, speed = 400 } = options;

  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -max;
    const rotateY = ((x - centerX) / centerX) * max;

    el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;
    el.style.transition = `transform ${speed / 4}ms ease-out`;
  }, [max, scale, speed]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    el.style.transition = `transform ${speed}ms ease-out`;
  }, [speed]);

  return { ref, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave };
}
