import React, { useEffect, useRef } from "react";

const HoverDisabler: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isScrolling = false;

    const handleScrollStart = () => {
      if (!isScrolling) {
        document.documentElement.style.setProperty("--scrolling", "1");
        isScrolling = true;
      }

      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        document.documentElement.style.setProperty("--scrolling", "0");
        isScrolling = false;
      }, 350);
    };

    let lastScrollTime = 0;
    const throttledScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime > 16) {
        handleScrollStart();
        lastScrollTime = now;
      }
    };

    document.addEventListener("scroll", throttledScroll, { passive: true });

    return () => {
      document.removeEventListener("scroll", throttledScroll);
      if (timer.current) {
        clearTimeout(timer.current);
      }
      document.documentElement.style.setProperty("--scrolling", "0");
    };
  }, []);

  return <>{children}</>;
};

export default HoverDisabler;
