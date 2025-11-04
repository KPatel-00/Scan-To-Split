import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Parallax Chapter Scroll Page
 * - Lands on a full-bleed hero
 * - Smooth, buttery transitions between chapters
 * - Previous chapter scrolls up, current fades/slides in
 * - Parallax backgrounds
 * - Logical, staggered fade-in of text/components per chapter
 *
 * Assumptions:
 * - TailwindCSS is available in the host environment
 * - Framer Motion is available
 */

const fadeStagger = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.18,
    },
  },
};

const child = {
  hidden: { opacity: 0, y: 18 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.9, 
      ease: [0.22, 1, 0.36, 1] } },
};

function ParallaxBg({ targetRef, src, intensity = 60, overlay = "" }) {
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start end", "end start"] });
  // Move the background more slowly than the foreground for parallax
  const y = useTransform(scrollYProgress, [0, 1], [intensity * -1, intensity]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1.0]); // subtle zoom-out

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{ y, scale }}
    >
      <div className="absolute inset-0">
        <img src={src} alt="" className="h-full w-full object-cover object-center" />
        {overlay && <div className={"absolute inset-0 " + overlay} />}
      </div>
    </motion.div>
  );
}

function Chapter({ index, title, bullets, bg, accent = "from-indigo-500/30 to-purple-500/20" }) {
  const ref = useRef(null);

  return (
    <section ref={ref} className="relative h-screen snap-start">
      {/* Parallax background */}
      <ParallaxBg targetRef={ref} src={bg} overlay={`bg-gradient-to-b ${accent}`} intensity={70} />

      {/* Sticky viewport frame for buttery transitions */}
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <motion.div
          variants={fadeStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.35, once: false }}
          className="mx-auto max-w-4xl px-6"
        >
          <motion.h2 variants={child} className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-xl">
            {String(index).padStart(2, "0")} · {title}
          </motion.h2>

          <motion.p variants={child} className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl">
            This chapter fades in smoothly as you scroll; the previous slides up and away.
          </motion.p>

          <motion.ul className="mt-8 grid gap-4 md:grid-cols-2">
            {bullets.map((b, i) => (
              <motion.li
                key={i}
                variants={child}
                className="rounded-2xl bg-white/10 backdrop-blur p-5 text-white shadow-lg ring-1 ring-white/10"
              >
                <div className="text-base md:text-lg leading-relaxed">{b}</div>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const ySub = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [1, 0.6, 0.2]);

  return (
    <header ref={ref} className="relative h-screen snap-start">
      <ParallaxBg
        targetRef={ref}
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070&auto=format&fit=crop"
        overlay="bg-gradient-to-b from-black/50 via-black/30 to-black/70"
        intensity={90}
      />

      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto max-w-5xl px-6">
          <motion.h1
            style={{ y: yTitle, opacity }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-xl"
          >
            See the hero first
          </motion.h1>
          <motion.p style={{ y: ySub, opacity }} className="mt-6 max-w-2xl text-lg md:text-2xl text-white/90">
            Then scroll. Everything moves buttery-smooth with parallax and staggered reveals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex items-center gap-3 text-white/80"
          >
            <div className="h-10 w-10 rounded-full border border-white/30 grid place-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M11.47 3.97a.75.75 0 0 1 1.06 0l6.5 6.5a.75.75 0 1 1-1.06 1.06L12.75 6.81V20a.75.75 0 0 1-1.5 0V6.81L6.03 11.53a.75.75 0 0 1-1.06-1.06l6.5-6.5Z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm md:text-base">Scroll slowly · enjoy the transitions</span>
          </motion.div>
        </div>
      </div>
    </header>
  );
}

export default function ParallaxChapterScrollPage() {
  return (
    <div
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <Hero />

      <Chapter
        index={1}
        title="Foundations"
        bg="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=2069&auto=format&fit=crop"
        bullets={[
          "Sticky viewport makes each chapter feel anchored while the previous slides up.",
          "Parallax backgrounds drift at a different pace for depth.",
          "Staggered fade-in guides the eye in a logical sequence.",
          "Transitions tuned with smooth, easing curves for buttery motion.",
        ]}
      />

      <Chapter
        index={2}
        title="Interaction Design"
        bg="https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=2070&auto=format&fit=crop"
        bullets={[
          "Viewport-based triggers ensure content animates only when visible.",
          "Readable durations (~0.9s) emphasize calm, slow reveals.",
          "Cards are translucent with subtle blur to sit over imagery.",
          "Mobile-friendly layout with comfortable spacing and large type.",
        ]}
      />

      <Chapter
        index={3}
        title="Customization"
        bg="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2069&auto=format&fit=crop"
        bullets={[
          "Swap background images per chapter for different moods.",
          "Tune parallax intensity (0–120) per section.",
          "Adjust ease curves and stagger for desired tempo.",
          "Add components (charts/forms) as additional staggered children.",
        ]}
      />

      <footer className="relative h-[60vh] snap-start">
        <div className="sticky top-0 flex h-[60vh] items-center">
          <div className="mx-auto max-w-4xl px-6">
            <h3 className="text-white/90 text-2xl md:text-4xl font-semibold">That’s it.</h3>
            <p className="mt-4 text-white/70 max-w-xl">You’ve seen the hero first, then each chapter glided in with parallax and staggered reveals.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
