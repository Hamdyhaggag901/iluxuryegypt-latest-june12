import { useEffect, useRef } from "react";

const CHAPTER_COUNT = 4;
const PIN_MODE_QUERY = "(min-width: 768px)";

export default function WhyChooseUsEditorial() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const links = Array.from(container.querySelectorAll<HTMLAnchorElement>(".wce-progress-rail a"));
    const rail = container.querySelector<HTMLElement>(".wce-progress-rail");
    const coverSection = container.querySelector<HTMLElement>(".wce-cover");
    const closingSection = container.querySelector<HTMLElement>(".wce-closing");
    const track = container.querySelector<HTMLElement>(".wce-chapters-track");
    const panels = Array.from(container.querySelectorAll<HTMLElement>(".wce-chapter.wce-panel"));

    const shouldPin = () =>
      window.matchMedia(PIN_MODE_QUERY).matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let teardown = () => {};

    const setupStackedMode = () => {
      container.dataset.wceMode = "stacked";
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const sections = [coverSection, ...panels, closingSection].filter(
        (el): el is HTMLElement => !!el
      );
      const revealElements = Array.from(container.querySelectorAll<HTMLElement>(".wce-reveal"));

      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("wce-is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.16 }
      );
      revealElements.forEach((element) => revealObserver.observe(element));

      const railSections = [coverSection, ...panels].filter((el): el is HTMLElement => !!el);
      const activeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const index = railSections.indexOf(entry.target as HTMLElement);
            if (index === -1) return;
            links.forEach((link, linkIndex) => link.classList.toggle("wce-active", linkIndex === index));
            const dark =
              entry.target.classList.contains("wce-chapter-2") ||
              entry.target.classList.contains("wce-chapter-4");
            rail?.classList.toggle("wce-on-dark", dark);
          });
        },
        { rootMargin: "-42% 0px -48% 0px" }
      );
      railSections.forEach((section) => activeObserver.observe(section));

      if (prefersReducedMotion) {
        teardown = () => {
          revealObserver.disconnect();
          activeObserver.disconnect();
        };
        return;
      }

      const parallaxItems = Array.from(container.querySelectorAll<HTMLElement>("[data-parallax]"));
      let ticking = false;
      const renderParallax = () => {
        parallaxItems.forEach((item) => {
          const rect =
            item.closest(".wce-cover, .wce-chapter, .wce-hotel-main, .wce-hotel-secondary")?.getBoundingClientRect() ||
            item.getBoundingClientRect();
          const distance =
            (window.innerHeight / 2 - (rect.top + rect.height / 2)) * Number(item.dataset.parallax || 0.05);
          item.style.transform = `translate3d(0, ${distance.toFixed(2)}px, 0) scale(1.04)`;
        });
        ticking = false;
      };
      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(renderParallax);
          ticking = true;
        }
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      renderParallax();

      teardown = () => {
        revealObserver.disconnect();
        activeObserver.disconnect();
        window.removeEventListener("scroll", handleScroll);
      };
    };

    const setupPinnedMode = () => {
      container.dataset.wceMode = "pinned";
      if (!track) return;

      const coverRevealEls = coverSection
        ? Array.from(coverSection.querySelectorAll<HTMLElement>(".wce-reveal"))
        : [];
      const closingRevealEls = closingSection
        ? Array.from(closingSection.querySelectorAll<HTMLElement>(".wce-reveal"))
        : [];

      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("wce-is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.16 }
      );
      [...coverRevealEls, ...closingRevealEls].forEach((el) => revealObserver.observe(el));

      const coverObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((link, linkIndex) => link.classList.toggle("wce-active", linkIndex === 0));
            rail?.classList.remove("wce-on-dark");
          });
        },
        { rootMargin: "-42% 0px -48% 0px" }
      );
      if (coverSection) coverObserver.observe(coverSection);

      const panelParallaxItems = panels.map((panel) =>
        Array.from(panel.querySelectorAll<HTMLElement>("[data-parallax]"))
      );
      const panelRevealItems = panels.map((panel) =>
        Array.from(panel.querySelectorAll<HTMLElement>(".wce-reveal"))
      );

      const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
      let lastActiveIndex = -1;

      const scrollToChapter = (index: number) => {
        const trackRect = track.getBoundingClientRect();
        const viewportH = window.innerHeight;
        const scrollable = Math.max(1, track.offsetHeight - viewportH);
        const targetProgress = (index + 0.5) / CHAPTER_COUNT;
        const currentAbsoluteTrackTop = window.scrollY + trackRect.top;
        const targetY = currentAbsoluteTrackTop + targetProgress * scrollable;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      };

      const chapterLinkHandlers: Array<{ link: HTMLAnchorElement; handler: (e: MouseEvent) => void }> = [];
      links.slice(1, 1 + CHAPTER_COUNT).forEach((link, i) => {
        const handler = (e: MouseEvent) => {
          e.preventDefault();
          scrollToChapter(i);
        };
        link.addEventListener("click", handler);
        chapterLinkHandlers.push({ link, handler });
      });

      let ticking = false;
      const update = () => {
        const trackRect = track.getBoundingClientRect();
        const viewportH = window.innerHeight;
        const scrollable = Math.max(1, track.offsetHeight - viewportH);
        const totalProgress = clamp01(-trackRect.top / scrollable);
        const isPinned = trackRect.top <= 0 && trackRect.bottom > viewportH;

        const scaledProgress = totalProgress * CHAPTER_COUNT;
        const activeIndex = Math.min(CHAPTER_COUNT - 1, Math.floor(scaledProgress));
        const localProgress = clamp01(scaledProgress - activeIndex);

        if (activeIndex !== lastActiveIndex) {
          panels.forEach((panel, i) => {
            const isActive = i === activeIndex;
            panel.classList.toggle("wce-panel-active", isActive);
            panelRevealItems[i].forEach((el) => el.classList.toggle("wce-is-visible", isActive));
          });
          lastActiveIndex = activeIndex;
        }

        if (isPinned) {
          links.forEach((link, linkIndex) => link.classList.toggle("wce-active", linkIndex === activeIndex + 1));
          rail?.classList.toggle("wce-on-dark", activeIndex === 1 || activeIndex === 3);

          panelParallaxItems[activeIndex].forEach((item) => {
            const factor = Number(item.dataset.parallax || 0.05);
            const distance = (localProgress - 0.5) * factor * viewportH * 2;
            item.style.transform = `translate3d(0, ${distance.toFixed(2)}px, 0) scale(1.04)`;
          });
        }

        ticking = false;
      };

      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleScroll, { passive: true });
      update();

      teardown = () => {
        revealObserver.disconnect();
        coverObserver.disconnect();
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
        chapterLinkHandlers.forEach(({ link, handler }) => link.removeEventListener("click", handler));
      };
    };

    const setup = () => {
      teardown();
      if (shouldPin()) {
        setupPinnedMode();
      } else {
        setupStackedMode();
      }
    };

    setup();

    const desktopQuery = window.matchMedia(PIN_MODE_QUERY);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onModeChange = () => setup();
    desktopQuery.addEventListener("change", onModeChange);
    motionQuery.addEventListener("change", onModeChange);

    return () => {
      desktopQuery.removeEventListener("change", onModeChange);
      motionQuery.removeEventListener("change", onModeChange);
      teardown();
    };
  }, []);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap"
      />
      <style>{`
        .wce-editorial {
          --wce-ivory: #f9f6f1;
          --wce-beige: #f0e2d0;
          --wce-paper: #eee4d5;
          --wce-ink: #1c1c1c;
          --wce-navy: #111a22;
          --wce-navy-soft: #1b2831;
          --wce-gold: #9e7b49;
          --wce-champagne: #c5a46d;
          --wce-line: rgba(197, 164, 109, 0.46);
          --wce-muted: #706c65;
          --wce-serif: "Cormorant Garamond", Georgia, serif;
          --wce-sans: "DM Sans", Arial, sans-serif;
          --wce-gutter: clamp(1.25rem, 4vw, 5.25rem);

          position: relative;
          overflow: clip;
          color: var(--wce-ink);
          background: var(--wce-ivory);
          font-family: var(--wce-sans);
          -webkit-font-smoothing: antialiased;
        }
        .wce-editorial a {
          color: inherit;
        }
        .wce-editorial img {
          display: block;
          width: 100%;
        }
        .wce-eyebrow,
        .wce-chapter-kicker,
        .wce-microcopy,
        .wce-folio,
        .wce-image-caption,
        .wce-chapter-index,
        .wce-cover-note {
          font-size: 0.63rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          line-height: 1.5;
          text-transform: uppercase;
        }
        .wce-eyebrow,
        .wce-chapter-kicker {
          color: var(--wce-gold);
        }
        .wce-cover {
          position: relative;
          display: grid;
          min-height: max(720px, 100svh);
          isolation: isolate;
          align-items: end;
          color: var(--wce-ivory);
          background: var(--wce-navy);
        }
        .wce-cover::after {
          position: absolute;
          z-index: -1;
          inset: 0;
          content: "";
          background:
            linear-gradient(90deg, rgba(13, 20, 26, 0.72) 0%, rgba(13, 20, 26, 0.22) 58%, rgba(13, 20, 26, 0.3) 100%),
            linear-gradient(180deg, rgba(13, 20, 26, 0.08) 36%, rgba(13, 20, 26, 0.82) 100%);
        }
        .wce-cover-media {
          position: absolute;
          z-index: -2;
          inset: -4% -2%;
          overflow: hidden;
        }
        .wce-cover-media img {
          height: 108%;
          object-fit: cover;
          object-position: 52% 42%;
          transform: scale(1.03);
          will-change: transform;
        }
        .wce-cover-content {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 2rem;
          align-items: end;
          width: min(100%, 120rem);
          margin: 0 auto;
          padding: 0 var(--wce-gutter) clamp(3.5rem, 9vh, 7rem);
        }
        .wce-cover-copy {
          max-width: 52rem;
        }
        .wce-cover-kicker {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 1.6rem;
          color: var(--wce-champagne);
        }
        .wce-cover-kicker::before {
          width: 2.5rem;
          height: 1px;
          content: "";
          background: var(--wce-champagne);
        }
        .wce-cover h2 {
          max-width: 11ch;
          margin: 0;
          font-family: var(--wce-serif);
          font-size: clamp(4.5rem, 12vw, 11.5rem);
          font-weight: 400;
          letter-spacing: -0.055em;
          line-height: 0.78;
        }
        .wce-cover h2 span {
          display: block;
          margin-left: 0.28em;
          font-size: 0.5em;
          letter-spacing: -0.04em;
          line-height: 1.1;
        }
        .wce-cover-note {
          max-width: 13rem;
          padding-bottom: 0.25rem;
          color: rgba(249, 246, 241, 0.8);
          line-height: 1.8;
        }
        .wce-cover-folio {
          position: absolute;
          top: clamp(1.5rem, 4vw, 3.25rem);
          right: var(--wce-gutter);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .wce-cover-folio::before {
          width: 2.4rem;
          height: 1px;
          content: "";
          background: var(--wce-champagne);
        }
        .wce-cover-scroll {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          color: rgba(249, 246, 241, 0.68);
          transform: rotate(-90deg) translateX(-50%);
          transform-origin: left center;
        }
        .wce-cover-scroll::after {
          width: 3rem;
          height: 1px;
          content: "";
          background: var(--wce-champagne);
        }
        .wce-chapter {
          position: relative;
          min-height: 100svh;
          padding: clamp(6rem, 12vw, 12rem) var(--wce-gutter);
        }
        .wce-chapter-inner {
          position: relative;
          width: min(100%, 90rem);
          margin: 0 auto;
        }
        .wce-chapter-1 {
          background: var(--wce-ivory);
        }
        .wce-chapter-1 .wce-chapter-inner {
          display: grid;
          grid-template-columns: minmax(19rem, 0.82fr) minmax(0, 1fr);
          gap: clamp(3rem, 10vw, 11rem);
          align-items: center;
        }
        .wce-chapter-1 .wce-chapter-copy {
          padding-top: clamp(2rem, 7vw, 8rem);
        }
        .wce-chapter-kicker {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.8rem;
        }
        .wce-chapter-kicker::after {
          width: 3rem;
          height: 1px;
          content: "";
          background: var(--wce-line);
        }
        .wce-chapter h3 {
          margin: 0;
          font-family: var(--wce-serif);
          font-weight: 500;
          letter-spacing: -0.045em;
          line-height: 0.91;
          max-width: 8ch;
          font-size: clamp(4.25rem, 8.2vw, 8.8rem);
        }
        .wce-chapter-title {
          max-width: 11ch;
          margin: 1.6rem 0 2rem;
          font-family: var(--wce-serif);
          font-size: clamp(2rem, 3vw, 3.25rem);
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 0.96;
        }
        .wce-chapter-body {
          max-width: 25rem;
          margin: 0;
          color: #5e5a54;
          font-size: 0.92rem;
          line-height: 1.95;
        }
        .wce-chapter-index {
          position: absolute;
          top: 0;
          right: 0;
          color: var(--wce-gold);
        }
        .wce-chapter-image {
          position: relative;
          min-height: 68vh;
          overflow: hidden;
          background: var(--wce-beige);
        }
        .wce-chapter-image img {
          height: 110%;
          object-fit: cover;
          will-change: transform;
        }
        .wce-chapter-image::before {
          position: absolute;
          z-index: 1;
          inset: 1rem;
          border: 1px solid rgba(249, 246, 241, 0.58);
          content: "";
          pointer-events: none;
        }
        .wce-image-caption {
          position: absolute;
          z-index: 2;
          bottom: 1.75rem;
          left: 1.75rem;
          color: rgba(249, 246, 241, 0.85);
          text-shadow: 0 1px 18px rgba(0, 0, 0, 0.35);
        }
        .wce-chapter-2 {
          display: grid;
          align-items: center;
          min-height: 110svh;
          color: var(--wce-ivory);
          background: var(--wce-navy);
        }
        .wce-chapter-2 .wce-chapter-inner {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.8fr) minmax(0, 0.7fr);
          gap: clamp(2rem, 5vw, 5.5rem);
          align-items: center;
        }
        .wce-chapter-2 .wce-chapter-kicker {
          color: var(--wce-champagne);
        }
        .wce-chapter-2 .wce-chapter-kicker::after {
          background: rgba(197, 164, 109, 0.5);
        }
        .wce-chapter-2 .wce-chapter-title {
          color: var(--wce-ivory);
          font-size: clamp(2.25rem, 4vw, 4.25rem);
        }
        .wce-chapter-2 .wce-chapter-body {
          color: rgba(249, 246, 241, 0.66);
        }
        .wce-chapter-2 .wce-chapter-image {
          min-height: 64vh;
        }
        .wce-chapter-2 .wce-chapter-image::before {
          border-color: rgba(197, 164, 109, 0.46);
        }
        .wce-service-detail {
          display: grid;
          align-content: center;
          gap: 2.25rem;
          min-height: 28rem;
          padding: 2rem 0 2rem clamp(0rem, 3vw, 3rem);
          border-top: 1px solid rgba(197, 164, 109, 0.5);
          border-bottom: 1px solid rgba(197, 164, 109, 0.5);
        }
        .wce-service-detail figure {
          position: relative;
          width: min(100%, 15rem);
          margin: 0;
          transform: translateX(2rem);
        }
        .wce-service-detail figure::before {
          position: absolute;
          z-index: -1;
          top: 1rem;
          left: -1rem;
          width: 100%;
          height: 100%;
          border: 1px solid rgba(197, 164, 109, 0.4);
          content: "";
        }
        .wce-service-detail img {
          aspect-ratio: 0.83;
          object-fit: cover;
        }
        .wce-service-detail figcaption {
          margin-top: 0.75rem;
          color: rgba(249, 246, 241, 0.62);
          font-family: var(--wce-serif);
          font-size: 1.15rem;
          font-style: italic;
        }
        .wce-chapter-2 .wce-chapter-index,
        .wce-chapter-4 .wce-chapter-index {
          color: var(--wce-champagne);
        }
        .wce-chapter-3 {
          background: var(--wce-paper);
        }
        .wce-chapter-3 .wce-chapter-inner {
          display: grid;
          grid-template-columns: minmax(0, 0.7fr) minmax(18rem, 1fr);
          gap: clamp(3rem, 10vw, 10rem);
          align-items: center;
        }
        .wce-hotel-spread {
          position: relative;
          min-height: 78vh;
        }
        .wce-hotel-main,
        .wce-hotel-secondary {
          position: absolute;
          overflow: hidden;
        }
        .wce-hotel-main {
          top: 0;
          right: 0;
          width: 78%;
          height: 72%;
        }
        .wce-hotel-secondary {
          bottom: 0;
          left: 0;
          z-index: 2;
          width: 48%;
          height: 39%;
          border: 0.8rem solid var(--wce-paper);
        }
        .wce-hotel-main img,
        .wce-hotel-secondary img {
          height: 110%;
          object-fit: cover;
          will-change: transform;
        }
        .wce-hotel-caption {
          position: absolute;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          width: 43%;
          color: var(--wce-gold);
        }
        .wce-hotel-caption::before {
          width: 2rem;
          height: 1px;
          content: "";
          background: var(--wce-gold);
        }
        .wce-hotel-caption span {
          font-family: var(--wce-serif);
          font-size: 1.15rem;
          font-style: italic;
        }
        .wce-chapter-3 .wce-chapter-title {
          max-width: 9ch;
        }
        .wce-chapter-4 {
          display: grid;
          align-items: center;
          min-height: 115svh;
          color: var(--wce-ivory);
          background: var(--wce-navy-soft);
        }
        .wce-chapter-4::before {
          position: absolute;
          inset: 0;
          content: "";
          background: linear-gradient(90deg, rgba(17, 26, 34, 0.95) 8%, rgba(17, 26, 34, 0.56) 45%, rgba(17, 26, 34, 0.18) 100%);
          pointer-events: none;
        }
        .wce-chapter-4 .wce-chapter-inner {
          z-index: 1;
          min-height: 75vh;
          display: flex;
          align-items: center;
        }
        .wce-chapter-4 .wce-chapter-image {
          position: absolute;
          z-index: -1;
          inset: 0;
          min-height: 100%;
          opacity: 0.92;
        }
        .wce-chapter-4 .wce-chapter-image::before {
          display: none;
        }
        .wce-chapter-4 .wce-chapter-image img {
          height: 112%;
          object-position: 62% center;
        }
        .wce-chapter-4 .wce-chapter-copy {
          max-width: 39rem;
          padding-bottom: 4rem;
        }
        .wce-chapter-4 .wce-chapter-kicker {
          color: var(--wce-champagne);
        }
        .wce-chapter-4 .wce-chapter-title {
          max-width: 8ch;
          margin-top: 2.5rem;
          color: var(--wce-ivory);
          font-size: clamp(2.5rem, 5vw, 5.5rem);
        }
        .wce-chapter-4 .wce-chapter-body {
          max-width: 27rem;
          color: rgba(249, 246, 241, 0.74);
        }
        .wce-closing {
          display: grid;
          place-items: center;
          min-height: 70svh;
          padding: 7rem var(--wce-gutter);
          text-align: center;
          background: var(--wce-ivory);
        }
        .wce-closing-inner {
          width: min(100%, 47rem);
        }
        .wce-closing h3 {
          margin: 0.7rem 0 1.7rem;
          font-family: var(--wce-serif);
          font-size: clamp(4.5rem, 10vw, 9.5rem);
          font-weight: 400;
          letter-spacing: -0.07em;
          line-height: 0.78;
        }
        .wce-closing h3 span {
          display: block;
          margin-left: 0.9em;
        }
        .wce-closing p {
          max-width: 20rem;
          margin: 0 auto 2.5rem;
          color: var(--wce-muted);
          font-size: 0.88rem;
          line-height: 1.85;
        }
        .wce-closing-link {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          padding-bottom: 0.65rem;
          border-bottom: 1px solid var(--wce-gold);
          color: var(--wce-ink);
          font-size: 0.73rem;
          letter-spacing: 0.17em;
          text-decoration: none;
          text-transform: uppercase;
          transition: gap 300ms ease, color 300ms ease;
        }
        .wce-closing-link:hover,
        .wce-closing-link:focus-visible {
          gap: 1.45rem;
          color: var(--wce-gold);
        }
        .wce-closing-link span {
          font-size: 1.2rem;
          line-height: 0;
        }
        .wce-progress-rail {
          position: fixed;
          z-index: 10;
          top: 50%;
          right: clamp(1rem, 2.5vw, 2rem);
          display: grid;
          gap: 0.65rem;
          transform: translateY(-50%);
        }
        .wce-progress-rail a {
          display: grid;
          grid-template-columns: 0.45rem 1fr;
          gap: 0.75rem;
          align-items: center;
          color: rgba(28, 28, 28, 0.48);
          font-size: 0.57rem;
          letter-spacing: 0.15em;
          text-decoration: none;
          transition: color 250ms ease;
        }
        .wce-progress-rail a::before {
          width: 0.4rem;
          height: 0.4rem;
          border: 1px solid currentColor;
          border-radius: 50%;
          content: "";
          transition: background 250ms ease, transform 250ms ease;
        }
        .wce-progress-rail a.wce-active {
          color: var(--wce-gold);
        }
        .wce-progress-rail a.wce-active::before {
          background: currentColor;
          transform: scale(1.35);
        }
        .wce-progress-rail.wce-on-dark a {
          color: rgba(249, 246, 241, 0.4);
        }
        .wce-progress-rail.wce-on-dark a.wce-active {
          color: var(--wce-champagne);
        }
        .wce-reveal {
          opacity: 0;
          transform: translateY(2.5rem);
          transition: opacity 1000ms cubic-bezier(0.22, 1, 0.36, 1), transform 1000ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .wce-reveal.wce-is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .wce-reveal-delay-1 {
          transition-delay: 120ms;
        }
        .wce-reveal-delay-2 {
          transition-delay: 230ms;
        }
        .wce-chapters-track {
          position: relative;
        }
        [data-wce-mode="pinned"] .wce-chapters-track {
          height: 400vh;
        }
        [data-wce-mode="pinned"] .wce-chapters-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          height: 100svh;
          overflow: hidden;
        }
        [data-wce-mode="stacked"] .wce-chapters-sticky {
          display: contents;
        }
        [data-wce-mode="pinned"] .wce-chapter.wce-panel {
          position: absolute;
          inset: 0;
          height: 100%;
          min-height: 0;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          overflow-y: auto;
          padding: clamp(1.5rem, 4vw, 3.5rem) var(--wce-gutter);
          transition: opacity 700ms ease;
        }
        [data-wce-mode="pinned"] .wce-chapter.wce-panel.wce-panel-active {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }
        @media (max-width: 900px) {
          .wce-progress-rail a span {
            display: none;
          }
          .wce-progress-rail a {
            display: block;
          }
          .wce-progress-rail {
            right: 1.25rem;
          }
          .wce-chapter-1 .wce-chapter-inner,
          .wce-chapter-3 .wce-chapter-inner {
            grid-template-columns: minmax(0, 0.75fr) minmax(16rem, 1fr);
            gap: 3rem;
          }
          .wce-chapter-2 .wce-chapter-inner {
            grid-template-columns: minmax(0, 1fr) minmax(15rem, 0.9fr);
          }
          .wce-service-detail {
            grid-column: 1 / -1;
            grid-template-columns: 1fr auto;
            min-height: auto;
            padding: 2rem 0 0;
            border-bottom: 0;
          }
          .wce-service-detail figure {
            grid-column: 2;
            grid-row: 1;
            transform: translateX(0);
          }
          .wce-chapter-2 .wce-chapter-copy {
            grid-column: 1;
            grid-row: 1;
          }
          .wce-chapter-2 .wce-chapter-image {
            grid-column: 1 / -1;
            grid-row: 2;
            min-height: 48vh;
          }
        }
        @media (max-width: 640px) {
          .wce-cover {
            min-height: 90svh;
          }
          .wce-cover-content {
            display: block;
            padding-bottom: 5.2rem;
          }
          .wce-cover h2 {
            font-size: clamp(4.2rem, 19vw, 7rem);
          }
          .wce-cover-note {
            margin-top: 2.3rem;
          }
          .wce-cover-scroll {
            display: none;
          }
          .wce-chapter {
            min-height: auto;
            padding-top: 6rem;
            padding-bottom: 7rem;
          }
          .wce-chapter-1 .wce-chapter-inner,
          .wce-chapter-2 .wce-chapter-inner,
          .wce-chapter-3 .wce-chapter-inner {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 3.2rem;
          }
          .wce-chapter-index {
            position: static;
            order: -2;
            margin-bottom: -1.5rem;
          }
          .wce-chapter-1 .wce-chapter-copy,
          .wce-chapter-4 .wce-chapter-copy {
            padding-top: 0;
            padding-bottom: 0;
          }
          .wce-chapter h3 {
            font-size: clamp(4.1rem, 20vw, 7rem);
          }
          .wce-chapter-title {
            font-size: 2.5rem;
          }
          .wce-chapter-image,
          .wce-chapter-2 .wce-chapter-image {
            min-height: 72svh;
          }
          .wce-chapter-2 .wce-chapter-image {
            order: 2;
          }
          .wce-service-detail {
            display: grid;
            grid-template-columns: 1fr 8rem;
            order: 1;
          }
          .wce-service-detail figure {
            width: 8rem;
          }
          .wce-service-detail figcaption {
            font-size: 1rem;
          }
          .wce-chapter-3 .wce-chapter-inner {
            gap: 4.5rem;
          }
          .wce-hotel-spread {
            min-height: 78svh;
            order: 2;
          }
          .wce-hotel-main {
            width: 86%;
            height: 68%;
          }
          .wce-hotel-secondary {
            width: 58%;
            height: 40%;
            border-width: 0.55rem;
          }
          .wce-hotel-caption {
            width: 45%;
          }
          .wce-chapter-4 {
            min-height: 100svh;
          }
          .wce-chapter-4 .wce-chapter-inner {
            min-height: 75svh;
          }
          .wce-chapter-4::before {
            background: linear-gradient(90deg, rgba(17, 26, 34, 0.82), rgba(17, 26, 34, 0.3)), linear-gradient(0deg, rgba(17, 26, 34, 0.82), transparent);
          }
          .wce-chapter-4 .wce-chapter-title {
            font-size: clamp(2.9rem, 12vw, 4.4rem);
          }
          .wce-chapter-4 .wce-chapter-image img {
            object-position: 65% center;
          }
          .wce-closing {
            min-height: 65svh;
          }
          .wce-closing h3 {
            font-size: clamp(4.6rem, 20vw, 7rem);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .wce-editorial,
          .wce-editorial *,
          .wce-editorial *::before,
          .wce-editorial *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .wce-reveal {
            opacity: 1;
            transform: none;
          }
          .wce-cover-media img,
          .wce-chapter-image img,
          .wce-hotel-main img,
          .wce-hotel-secondary img {
            transform: none !important;
          }
        }
      `}</style>
      <div
        className="wce-editorial"
        id="wce-top"
        ref={containerRef}
        data-testid="why-choose-us-editorial-section"
        data-wce-mode="stacked"
      >
        <nav className="wce-progress-rail" aria-label="Editorial chapters">
          <a className="wce-active" href="#wce-cover" aria-label="Cover"><span>Cover</span></a>
          <a href="#wce-private-access" aria-label="Private Access"><span>01</span></a>
          <a href="#wce-vip-service" aria-label="Luxury VIP Service"><span>02</span></a>
          <a href="#wce-accommodation" aria-label="5-Star Accommodation"><span>03</span></a>
          <a href="#wce-itineraries" aria-label="Tailor-Made Itineraries"><span>04</span></a>
        </nav>

        <section className="wce-cover" id="wce-cover" data-section="cover" aria-labelledby="wce-cover-title">
          <div className="wce-cover-media" aria-hidden="true">
            <img
              data-parallax="0.075"
              src="https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=2200&q=88&fm=webp"
              alt=""
            />
          </div>
          <div className="wce-cover-folio wce-folio">01 / 04</div>
          <div className="wce-cover-content">
            <div className="wce-cover-copy">
              <div className="wce-cover-kicker wce-eyebrow wce-reveal">The iLuxury Egypt edit</div>
              <h2 id="wce-cover-title" className="wce-reveal wce-reveal-delay-1">
                Why Choose<span>iLuxury Egypt</span>
              </h2>
            </div>
            <p className="wce-cover-note wce-reveal wce-reveal-delay-2">
              Luxury Egypt tours,<br />personally curated.
            </p>
          </div>
          <div className="wce-cover-scroll wce-microcopy" aria-hidden="true">Enter the story</div>
        </section>

        <div className="wce-chapters-track">
        <div className="wce-chapters-sticky">
        <section
          className="wce-chapter wce-chapter-1 wce-panel"
          id="wce-private-access"
          data-section="private-access"
          aria-labelledby="wce-private-access-title"
        >
          <div className="wce-chapter-inner">
            <div className="wce-chapter-copy">
              <div className="wce-chapter-index wce-reveal">Chapter 01</div>
              <div className="wce-chapter-kicker wce-reveal">Private Access in Egypt</div>
              <h3 id="wce-private-access-title" className="wce-reveal wce-reveal-delay-1">
                Where History Opens Only for You
              </h3>
              <p className="wce-chapter-title wce-reveal wce-reveal-delay-2">
                A quieter way to meet the ancient world.
              </p>
              <p className="wce-chapter-body wce-reveal wce-reveal-delay-2">
                Our luxury Egypt tours open doors most travelers never see. Through carefully secured permits and an
                unmatched portfolio of storied properties, we grant access few will ever witness — private hours at
                Egypt&rsquo;s ancient wonders, paired with residences that have hosted kings.
              </p>
            </div>
            <figure className="wce-chapter-image wce-reveal wce-reveal-delay-1">
              <img
                data-parallax="0.11"
                src="https://iluxuryegypt.com/api/assets/uploads/b586bad2-3ba5-4c70-b6a7-109f222a4e92.webp"
                alt="An ancient Egyptian landmark bathed in golden light — private access Egypt tours"
                loading="lazy"
              />
              <figcaption className="wce-image-caption">A private hour / Luxor</figcaption>
            </figure>
          </div>
        </section>

        <section
          className="wce-chapter wce-chapter-2 wce-panel"
          id="wce-vip-service"
          data-section="vip-service"
          aria-labelledby="wce-vip-service-title"
        >
          <div className="wce-chapter-inner">
            <div className="wce-chapter-copy">
              <div className="wce-chapter-index wce-reveal">Chapter 02</div>
              <div className="wce-chapter-kicker wce-reveal">Luxury VIP service</div>
              <h3 id="wce-vip-service-title" className="wce-chapter-title wce-reveal wce-reveal-delay-1">
                An Escort Worthy of Royalty
              </h3>
              <p className="wce-chapter-body wce-reveal wce-reveal-delay-2">
                Every transfer is arranged through our trusted network of premier private transportation partners,
                vetted for comfort, discretion, and reliability. Your journey through Egypt unfolds with nothing left
                to chance.
              </p>
            </div>
            <figure className="wce-chapter-image wce-reveal wce-reveal-delay-1">
              <img
                data-parallax="0.08"
                src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1500&q=88&fm=webp"
                alt="An elegant private vehicle moving through a warm Egyptian landscape"
                loading="lazy"
              />
              <figcaption className="wce-image-caption">In motion / The Nile Valley</figcaption>
            </figure>
            <aside className="wce-service-detail wce-reveal wce-reveal-delay-2" aria-label="Service detail">
              <div>
                <div className="wce-microcopy" style={{ color: "var(--wce-champagne)" }}>
                  The small things
                </div>
                <p
                  className="wce-chapter-title"
                  style={{ margin: "0.8rem 0 0", fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}
                >
                  Effort, removed.
                </p>
              </div>
              <figure>
                <img
                  src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=600&q=86&fm=webp"
                  alt="A refined table set for a private evening"
                  loading="lazy"
                />
                <figcaption>Nothing left to chance.</figcaption>
              </figure>
            </aside>
          </div>
        </section>

        <section
          className="wce-chapter wce-chapter-3 wce-panel"
          id="wce-accommodation"
          data-section="accommodation"
          aria-labelledby="wce-accommodation-title"
        >
          <div className="wce-chapter-inner">
            <div className="wce-chapter-copy">
              <div className="wce-chapter-index wce-reveal">Chapter 03</div>
              <div className="wce-chapter-kicker wce-reveal">5-Star Egypt Hotels</div>
              <h3 id="wce-accommodation-title" className="wce-chapter-title wce-reveal wce-reveal-delay-1">
                Palaces Along the Nile
              </h3>
              <p className="wce-chapter-body wce-reveal wce-reveal-delay-2">
                From the storied halls of Mena House to the modern grandeur of the Nile Ritz-Carlton, our thirteen
                handpicked residences are not simply places to rest — they are chapters of your journey in their own
                right.
              </p>
            </div>
            <div className="wce-hotel-spread">
              <figure className="wce-hotel-main wce-reveal">
                <img
                  data-parallax="0.085"
                  src="https://iluxuryegypt.com/api/assets/uploads/32ef96ad-7c53-4204-bda3-06a9865b332b.webp"
                  alt="Mena House hotel exterior — luxury Egypt tours accommodation"
                  loading="lazy"
                />
              </figure>
              <figure className="wce-hotel-secondary wce-reveal wce-reveal-delay-1">
                <img
                  data-parallax="0.12"
                  src="https://iluxuryegypt.com/api/assets/uploads/1baf9cb1-334b-4688-9b0e-e3dda1d2d13e.webp"
                  alt="Nile Ritz-Carlton hotel interior overlooking the Nile — 5-star Egypt hotels"
                  loading="lazy"
                />
              </figure>
              <div className="wce-hotel-caption wce-reveal wce-reveal-delay-2">
                <span>Thirteen handpicked residences</span>
              </div>
            </div>
          </div>
        </section>

        <section
          className="wce-chapter wce-chapter-4 wce-panel"
          id="wce-itineraries"
          data-section="itineraries"
          aria-labelledby="wce-itineraries-title"
        >
          <div className="wce-chapter-image" aria-hidden="true">
            <img
              data-parallax="0.055"
              src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2200&q=88&fm=webp"
              alt=""
              loading="lazy"
            />
          </div>
          <div className="wce-chapter-inner">
            <div className="wce-chapter-copy">
              <div className="wce-chapter-index wce-reveal">Chapter 04</div>
              <div className="wce-chapter-kicker wce-reveal">Tailor-made itineraries</div>
              <h3 id="wce-itineraries-title" className="wce-chapter-title wce-reveal wce-reveal-delay-1">
                A Journey Written for You Alone
              </h3>
              <p className="wce-chapter-body wce-reveal wce-reveal-delay-2">
                No itinerary is ever repeated. Each journey is composed around your interests, your pace, and your
                vision of Egypt — a private commission, not a package.
              </p>
            </div>
          </div>
        </section>
        </div>
        </div>

        <section className="wce-closing" aria-labelledby="wce-closing-title">
          <div className="wce-closing-inner">
            <div className="wce-eyebrow wce-reveal">The final page is yours</div>
            <h3 id="wce-closing-title" className="wce-reveal wce-reveal-delay-1">
              Your Egypt.<span>Your Way.</span>
            </h3>
            <p className="wce-reveal wce-reveal-delay-2">A journey personally curated around you.</p>
            <a className="wce-closing-link wce-reveal wce-reveal-delay-2" href="#wce-top">
              Begin Your Journey <span>→</span>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
