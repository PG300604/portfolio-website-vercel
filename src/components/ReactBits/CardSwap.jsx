import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import './CardSwap.css';

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

const getSlotTransform = (index, distX, distY, total) => {
  return {
    x: index * distX,
    y: -index * distY,
    z: -index * 90,
    scale: 1 - index * 0.04,
    zIndex: total - index
  };
};

const CardSwap = ({
  width = 540,
  height = 340,
  cardDistance = 32,
  verticalDistance = 36,
  delay = 3500,
  pauseOnHover = true,
  onCardClick,
  skewAmount = 2,
  children
}) => {
  const childArr = useMemo(() => Children.toArray(children), [children]);
  const totalCards = childArr.length;
  
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    [childArr.length]
  );

  const orderRef = useRef(Array.from({ length: totalCards }, (_, i) => i));
  const isAnimatingRef = useRef(false);
  const timerRef = useRef(null);
  const containerRef = useRef(null);

  // Apply slot transforms deterministically
  const applySlots = (isInitial = false) => {
    orderRef.current.forEach((cardIdx, slotIdx) => {
      const el = refs[cardIdx]?.current;
      if (!el) return;

      const slot = getSlotTransform(slotIdx, cardDistance, verticalDistance, totalCards);

      if (isInitial) {
        gsap.set(el, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          scale: slot.scale,
          xPercent: -50,
          yPercent: -50,
          skewY: skewAmount,
          zIndex: slot.zIndex,
          transformOrigin: 'center center',
          force3D: true
        });
      } else {
        gsap.to(el, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          scale: slot.scale,
          skewY: skewAmount,
          zIndex: slot.zIndex,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    });
  };

  // Perform card swap transition
  const doSwap = () => {
    if (totalCards < 2 || isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const frontIdx = orderRef.current[0];
    const frontEl = refs[frontIdx]?.current;

    if (!frontEl) {
      isAnimatingRef.current = false;
      return;
    }

    // Step 1: Drop front card down smoothly
    gsap.to(frontEl, {
      y: 180,
      opacity: 0.7,
      scale: 0.95,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        // Step 2: Rotate order array
        orderRef.current.push(orderRef.current.shift());

        // Step 3: Animate all cards to their new slots
        orderRef.current.forEach((cIdx, sIdx) => {
          const el = refs[cIdx]?.current;
          if (!el) return;

          const slot = getSlotTransform(sIdx, cardDistance, verticalDistance, totalCards);
          
          if (cIdx === frontIdx) {
            // Move front card into back slot
            gsap.set(el, { zIndex: slot.zIndex });
            gsap.to(el, {
              x: slot.x,
              y: slot.y,
              z: slot.z,
              scale: slot.scale,
              opacity: 1,
              duration: 0.35,
              ease: 'power2.out',
              onComplete: () => {
                isAnimatingRef.current = false;
              }
            });
          } else {
            // Move remaining cards forward
            gsap.to(el, {
              x: slot.x,
              y: slot.y,
              z: slot.z,
              scale: slot.scale,
              zIndex: slot.zIndex,
              opacity: 1,
              duration: 0.35,
              ease: 'power2.out'
            });
          }
        });
      }
    });
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    timerRef.current = setInterval(doSwap, delay);
  };

  const stopAutoPlay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    applySlots(true);
    startAutoPlay();

    const node = containerRef.current;
    if (pauseOnHover && node) {
      const handleEnter = () => stopAutoPlay();
      const handleLeave = () => startAutoPlay();
      node.addEventListener('mouseenter', handleEnter);
      node.addEventListener('mouseleave', handleLeave);
      return () => {
        node.removeEventListener('mouseenter', handleEnter);
        node.removeEventListener('mouseleave', handleLeave);
        stopAutoPlay();
      };
    }

    return () => stopAutoPlay();
  }, [totalCards, cardDistance, verticalDistance, delay, pauseOnHover, skewAmount]);

  const handleCardClick = (idx, e) => {
    doSwap();
    onCardClick?.(idx);
  };

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: e => {
            child.props.onClick?.(e);
            handleCardClick(i, e);
          }
        })
      : child
  );

  return (
    <div className="flex flex-col items-center">
      <div ref={containerRef} className="card-swap-container cursor-pointer" style={{ width, height }}>
        {rendered}
      </div>

      {/* Side Quick Navigation Controls */}
      <div className="mt-8 flex items-center gap-4 font-mono-custom text-xs">
        <button
          onClick={doSwap}
          className="px-5 py-2.5 rounded-full border border-[var(--border-subtle)] bg-[var(--card-bg)] text-[var(--text-main)] hover:border-[var(--text-main)] transition-all font-bold shadow-lg uppercase"
        >
          [ SWAP CARD NEXT ➔ ]
        </button>
      </div>
    </div>
  );
};

export default CardSwap;
