import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  stagger
} from 'framer-motion';
import {
  ScanLine, Sparkles, ListChecks, Users, Layers3, Sun, Moon, Menu, X, Cpu,
  ShoppingCart, GlassWater, Package, Bean, Banana, Carrot, UploadCloud
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* STYLES & THEME INJECTION                                                   */
/* -------------------------------------------------------------------------- */

const ThemeStyles = () => (
  <style>{`
    :root { /* Light Mode */
      --background: 0 0% 100%; --foreground: 240 10% 3.9%; --card: 0 0% 100%;
      --card-foreground: 240 10% 3.9%; --popover: 0 0% 100%; --popover-foreground: 240 10% 3.9%;
      --primary: 240 5.9% 10%; --primary-foreground: 0 0% 98%; --secondary: 240 4.8% 95.9%;
      --secondary-foreground: 240 5.9% 10%; --muted: 240 4.8% 95.9%; --muted-foreground: 240 3.8% 46.1%;
      --destructive: 0 84.2% 60.2%; --destructive-foreground: 0 0% 98%; --border: 240 5.9% 90%;
      --input: 240 5.9% 90%; --ring: 240 5.9% 10%; --radius: 0.5rem;
      --brand-indigo: 243 76% 58%; --success: 142 68% 41%; --error: 0 84% 60%;
      --error-bg-light: 0 100% 97%; --error-text-light: 0 72% 51%;
      --white: 0 0% 100%; --black: 0 0% 0%;
    }
    html.dark { /* Dark Mode */
      --background: 240 5.9% 10%; --foreground: 0 0% 98%; --card: 240 3.7% 15.9%;
      --card-foreground: 0 0% 98%; --popover: 240 3.7% 15.9%; --popover-foreground: 0 0% 98%;
      --primary: 0 0% 98%; --primary-foreground: 240 5.9% 10%; --secondary: 240 3.7% 15.9%;
      --secondary-foreground: 0 0% 98%; --muted: 240 3.7% 15.9%; --muted-foreground: 240 5% 64.9%;
      --destructive: 0 62.8% 30.6%; --destructive-foreground: 0 0% 98%; --border: 240 3.7% 25.9%;
      --input: 240 3.7% 25.9%; --ring: 0 0% 98%;
      --error-bg-light: 240 3.7% 15.9%; --error-text-light: 0 72% 51%;
      --white: 0 0% 100%; --black: 0 0% 0%;
    }
    body {
      background-color: hsl(var(--background)); color: hsl(var(--foreground));
      font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
      transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
    }
    /* ... Helper classes ... */
    .bg-background { background-color: hsl(var(--background)); } .bg-card { background-color: hsl(var(--card)); }
    .bg-primary { background-color: hsl(var(--primary)); } .bg-secondary { background-color: hsl(var(--secondary)); }
    .bg-destructive { background-color: hsl(var(--destructive)); } .text-foreground { color: hsl(var(--foreground)); }
    .text-muted-foreground { color: hsl(var(--muted-foreground)); } .text-primary { color: hsl(var(--primary)); }
    .text-primary-foreground { color: hsl(var(--primary-foreground)); } .text-secondary-foreground { color: hsl(var(--secondary-foreground)); }
    .text-destructive { color: hsl(var(--destructive)); } .text-success { color: hsl(var(--success)); }
    .border-border { border-color: hsl(var(--border)); } .border-input { border-color: hsl(var(--input)); }
    .ring-ring { box-shadow: 0 0 0 2px hsl(var(--ring)); } .ring-primary { box-shadow: 0 0 0 2px hsl(var(--primary)); }
    .ring-offset-background { box-shadow: 0 0 0 2px hsl(var(--ring)), 0 0 0 4px hsl(var(--background)); }

    .button-shimmer { position: relative; overflow: hidden; }
    .button-shimmer::before { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, hsla(0,0%,100%,0.2), transparent); transition: transform 0.5s ease-out; transform: skewX(-25deg); pointer-events: none; }
    /* No hover trigger needed for shimmer if using whileHover */
    .balance-text { text-wrap: balance; }

    .border-animate-white { --animate-border-color: hsl(var(--white)); }
    .border-animate-primary { --animate-border-color: hsl(var(--primary)); }

    /* Fix: Ensure group-* utilities work for the border animation */
    .group:hover .group-hover\\:after\\:-inset-1::after,
    .group:focus-visible .group-focus-visible\\:after\\:-inset-1::after,
    .group:active .group-active\\:after\\:-inset-1::after {
       inset: -0.25rem; /* Equivalent to -inset-1 */
    }


  `}</style>
);


/* -------------------------------------------------------------------------- */
/* UTILITY HOOKS & COMPONENTS                                                 */
/* -------------------------------------------------------------------------- */
const useMediaQuery = (query) => { const [matches, setMatches] = useState(false); useEffect(() => { if (typeof window === 'undefined') return; const media = window.matchMedia(query); const listener = () => setMatches(media.matches); listener(); media.addEventListener('change', listener); return () => media.removeEventListener('change', listener); }, [query]); return matches; };
const usePrefersReducedMotion = () => { const [reducedMotion, setReducedMotion] = useState(false); useEffect(() => { if (typeof window === 'undefined') return; const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)'); setReducedMotion(mediaQuery.matches); const handler = () => setReducedMotion(mediaQuery.matches); mediaQuery.addEventListener('change', handler); return () => mediaQuery.removeEventListener('change', handler); }, []); return reducedMotion; };
const cn = (...classes) => classes.filter(Boolean).join(' ');

// --- REFACTORED Button Component with Framer Motion Physics ---
// Renamed back to Button and integrated Framer props
const Button = React.forwardRef(({
  className,
  variant = 'default',
  size = 'default',
  animateBorderColor = 'white',
  children,
  ...props
}, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const variants = { /* ... variants as before ... */
    default: 'bg-primary text-primary-foreground hover:bg-primary/90', destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90', outline: 'border border-input bg-background hover:bg-secondary hover:text-secondary-foreground', secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80', ghost: 'hover:bg-secondary hover:text-secondary-foreground', link: 'text-primary underline-offset-4 hover:underline', ctaSpecial: 'bg-white text-black hover:bg-white/90',
   };
  const sizes = { /* ... sizes as before ... */
    default: 'h-10 px-4 py-2', sm: 'h-9 rounded-md px-3', lg: 'h-11 rounded-md px-8 text-base', icon: 'h-10 w-10',
   };
  const finalBorderColor = animateBorderColor === 'primary' ? 'hsl(var(--primary))' : 'hsl(var(--white))';

  const classes = cn(
    // Base styles
    'relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none group', // Added group
    // Variant and Size
    variants[variant] || variants.default,
    sizes[size] || sizes.default,

    // --- Outward Border Animation (CSS Only, triggered by group state) ---
    "after:content-[''] after:absolute after:inset-0 after:rounded-[inherit]",
    'after:border',
    `after:border-[${finalBorderColor}]`,
    'after:transition-[inset] after:duration-200 after:ease-out',
    // Apply triggers using group state classes directly here (Tailwind limitation workaround)
    'group-hover:after:-inset-1 group-focus-visible:after:-inset-1 group-active:after:-inset-1',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-background', // Standard focus ring
    'motion-reduce:after:transition-none',
    // --- End Outward Border ---
    className
  );

  // --- Framer Motion Physics ---
  const tapSpring = prefersReducedMotion ? {} : { type: 'spring', stiffness: 400, damping: 15 };
  const hoverSpring = prefersReducedMotion ? {} : { scale: 1.03 }; // Simple scale for hover via Framer

  return (
    <motion.button
      className={classes}
      ref={ref}
      whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}} // Blueprint "quickTap" scale handled by Framer
      whileHover={hoverSpring} // Apply hover scale via Framer
      transition={tapSpring} // Spring applied on release from tap/hover
      {...props}
    >
      {children}
    </motion.button>
  );
});


const Card = React.forwardRef(({ className, ...props }, ref) => ( <motion.div ref={ref} className={cn('rounded-lg border border-border bg-card text-card-foreground shadow-sm', className)} {...props} /> ));
const CardHeader = React.forwardRef(({ className, ...props }, ref) => ( <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} /> ));
const CardTitle = React.forwardRef(({ className, ...props }, ref) => ( <h3 ref={ref} className={cn('font-semibold leading-none tracking-tight', className)} {...props} /> ));
const CardDescription = React.forwardRef(({ className, ...props }, ref) => ( <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} /> ));
const CardContent = React.forwardRef(({ className, ...props }, ref) => ( <div ref={ref} className={cn('p-6 pt-0', className)} {...props} /> ));

/* -------------------------------------------------------------------------- */
/* MAIN LANDING PAGE COMPONENT                                                */
/* -------------------------------------------------------------------------- */
export default function LandingPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = usePrefersReducedMotion();
  const useCinematicScroll = !isMobile && !prefersReducedMotion;

  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delayChildren: 0.1, staggerChildren: prefersReducedMotion ? 0 : 0.07, }, }, };
  const gentleLandWord = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: prefersReducedMotion ? { duration: 0.01 } : { type: 'spring', stiffness: 180, damping: 25 }, }, };
  const simpleFadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: prefersReducedMotion ? 0.01 : 0.5 } } };
  const heroHeadline = "Split bills. Not atoms.";
  const heroWords = heroHeadline.split(" ");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <ThemeStyles />
      <AppHeader />
      <main className="flex-grow">
        <motion.section className="container mx-auto max-w-4xl text-center flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-24 overflow-hidden" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.h1 className="text-5xl md:text-7xl font-bold tracking-tighter" style={{ textWrap: 'balance' }} aria-label={heroHeadline} variants={staggerContainer} >
             {heroWords.map((word, i) => ( <motion.span key={i} variants={gentleLandWord} style={{ display: 'inline-block', marginRight: '0.25em' }}> {word} </motion.span> ))}
          </motion.h1>
          <motion.p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl" variants={gentleLandWord} transition={{delay: prefersReducedMotion ? 0 : 0.2}}> The truly intelligent bill splitter. Scan a receipt, assign items, and get a perfect summary in seconds. 100% free. </motion.p>
          <motion.div variants={gentleLandWord} transition={{delay: prefersReducedMotion ? 0 : 0.4}} className="mt-10">
            {/* Using the Button component with Framer Motion physics */}
            <Button
               size="lg"
               variant="ctaSpecial"
               animateBorderColor="white"
               className="text-base font-semibold button-shimmer" // Keep shimmer if desired
             >
               <motion.span
                 // Icon pulse using Framer Motion animation
                 animate={!prefersReducedMotion ? { scale: [1, 1.15, 1] } : {}}
                 transition={!prefersReducedMotion ? { duration: 1.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.3 } : {}}
                 style={{display: 'inline-block'}} className="mr-2"
               >
                 <UploadCloud className="w-5 h-5" />
               </motion.span> Scan Your First Bill
             </Button>
          </motion.div>
        </motion.section>
        <MessToMagicSection useCinematicScroll={useCinematicScroll} simpleFadeIn={simpleFadeIn} prefersReducedMotion={prefersReducedMotion} />
        <TheLogicSection useCinematicScroll={useCinematicScroll} simpleFadeIn={simpleFadeIn} prefersReducedMotion={prefersReducedMotion} />
        <TheTrustSection simpleFadeIn={simpleFadeIn} gentleLand={gentleLandWord} staggerContainer={staggerContainer} />
        <TheCloserSection simpleFadeIn={simpleFadeIn} prefersReducedMotion={prefersReducedMotion}/>
      </main>
      <AppFooter />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SECTION COMPONENTS & VISUALS (Implementations mostly unchanged)            */
/* -------------------------------------------------------------------------- */
const MessToMagicSection = ({ useCinematicScroll, simpleFadeIn, prefersReducedMotion }) => { const targetRef = useRef(null); const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start start', 'end end'], }); const scrollYSpring = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 }); const effectiveScrollY = prefersReducedMotion ? scrollYProgress : scrollYSpring; const opacityV1 = useTransform(effectiveScrollY, [0, 0.25, 0.33], [1, 1, 0]); const opacityV2 = useTransform(effectiveScrollY, [0.33, 0.45, 0.66], [0, 1, 0]); const opacityV3 = useTransform(effectiveScrollY, [0.66, 0.75, 1], [0, 1, 1]); const scaleV1 = useTransform(effectiveScrollY, [0, 0.33], prefersReducedMotion ? [1, 1] : [1, 0.95]); const scaleV2 = useTransform(effectiveScrollY, [0.33, 0.66], prefersReducedMotion ? [1, 1] : [0.95, 0.95]); const scaleV3 = useTransform(effectiveScrollY, [0.66, 1], prefersReducedMotion ? [1, 1] : [0.95, 1]); if (!useCinematicScroll) { return ( <motion.section className="container mx-auto max-w-6xl px-6 py-24 md:py-32" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}> <motion.div variants={simpleFadeIn} className="max-w-xl"> <h2 className="text-4xl md:text-5xl font-bold tracking-tighter balance-text" style={{ textWrap: 'balance' }}> An intelligent assistant, not a dumb calculator. </h2> <p className="mt-4 text-lg text-muted-foreground"> Our AI intelligently extracts items, quantities, and prices, even from complex receipts. </p> </motion.div> <motion.div variants={simpleFadeIn} className="mt-12"> <VisualCleanList prefersReducedMotion={prefersReducedMotion}/> </motion.div> </motion.section> ); } return ( <section ref={targetRef} className="h-[300vh] container mx-auto max-w-6xl px-6"> <div className="sticky top-0 h-screen flex flex-col md:flex-row gap-12 items-center pt-24"> <div className="w-full md:w-1/2"> <h2 className="text-4xl md:text-5xl font-bold tracking-tighter balance-text" style={{ textWrap: 'balance' }}> An intelligent assistant, not a dumb calculator. </h2> <p className="mt-4 text-lg text-muted-foreground"> Our AI intelligently extracts items, quantities, and prices, even from complex receipts. </p> </div> <div className="w-full md:w-1/2 h-[60vh] md:h-full relative"> <motion.div style={{ opacity: opacityV1, scale: scaleV1 }} className="absolute inset-0"> <VisualReceipt /> </motion.div> <motion.div style={{ opacity: opacityV2, scale: scaleV2 }} className="absolute inset-0"> <VisualAINarrative prefersReducedMotion={prefersReducedMotion}/> </motion.div> <motion.div style={{ opacity: opacityV3, scale: scaleV3 }} className="absolute inset-0"> <VisualCleanList prefersReducedMotion={prefersReducedMotion}/> </motion.div> </div> </div> </section> ); };
const TheLogicSection = ({ useCinematicScroll, simpleFadeIn, prefersReducedMotion }) => { const targetRef = useRef(null); const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start start', 'end end'], }); const scrollYSpring = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 }); const effectiveScrollY = prefersReducedMotion ? scrollYProgress : scrollYSpring; const breakpoints = [0, 0.33, 0.66, 1]; const activeTextIndex = useTransform(effectiveScrollY, breakpoints, [0, 1, 2, 2]); const visualOpacity1 = useTransform(effectiveScrollY, [0, 0.25, 0.33], [1, 1, 0]); const visualOpacity2 = useTransform(effectiveScrollY, [0.33, 0.58, 0.66], [0, 1, 0]); const visualOpacity3 = useTransform(effectiveScrollY, [0.66, 0.9, 1], [0, 1, 1]); if (!useCinematicScroll) { return ( <motion.section className="container mx-auto max-w-6xl px-6 py-24 md:py-32" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={simpleFadeIn} > <div className="flex flex-col gap-16 md:gap-24"> <motion.div variants={simpleFadeIn} className="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:items-center"> <div> <h3 className="text-3xl md:text-4xl font-bold tracking-tight balance-text" style={{ textWrap: 'balance' }}>Handle a Whole Trip, Not Just One Bill.</h3> <p className="text-lg text-muted-foreground mt-4">Scan up to three bills at once and manage them as a single merged list or in separate, collapsible sections.</p> </div> <VisualMultiBill /> </motion.div> <motion.div variants={simpleFadeIn} className="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:items-center"> <div className="md:order-2"> <h3 className="text-3xl md:text-4xl font-bold tracking-tight balance-text" style={{ textWrap: 'balance' }}>Go Beyond 'Equally.' Split How You Actually Paid.</h3> <p className="text-lg text-muted-foreground mt-4">Assign items to any combination of people. Split a single item by exact amount, percentage, or share.</p> </div> <div className="md:order-1"> <VisualSplitPopover /> </div> </motion.div> <motion.div variants={simpleFadeIn} className="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:items-center"> <div> <h3 className="text-3xl md:text-4xl font-bold tracking-tight balance-text" style={{ textWrap: 'balance' }}>An App That Learns Your Habits.</h3> <p className="text-lg text-muted-foreground mt-4">Our app recognizes items you've split before and suggests the split, so you can get it done in one tap.</p> </div> <VisualSuggestion isVisible={true} simpleFadeIn={simpleFadeIn} prefersReducedMotion={prefersReducedMotion} /> </motion.div> </div> </motion.section> ); } const logicFeatures = [ { title: "Handle a Whole Trip, Not Just One Bill.", description: "Scan up to three bills at once...", visual: <VisualMultiBill /> }, { title: "Go Beyond 'Equally.' Split How You Actually Paid.", description: "Assign items to any combination...", visual: <VisualSplitPopover /> }, { title: "An App That Learns Your Habits.", description: "Our app recognizes items...", visual: <VisualSuggestion isVisible={visualOpacity3} prefersReducedMotion={prefersReducedMotion} /> } ]; const visualOpacities = [visualOpacity1, visualOpacity2, visualOpacity3]; return ( <section ref={targetRef} className="h-[300vh] container mx-auto max-w-6xl px-6"> <div className="sticky top-0 h-screen flex flex-col md:flex-row gap-12 items-center pt-24"> <div className="w-full md:w-1/2 flex flex-col gap-16"> {logicFeatures.map((feature, i) => ( <FeatureText key={feature.title} title={feature.title} description={feature.description} i={i} activeTextIndex={activeTextIndex} prefersReducedMotion={prefersReducedMotion} /> ))} </div> <div className="w-full md:w-1/2 h-[60vh] md:h-full relative"> {logicFeatures.map((feature, i) => ( <motion.div key={i} style={{ opacity: visualOpacities[i] }} className="absolute inset-0" transition={prefersReducedMotion ? {duration: 0.01} : {duration: 0.3}} > {feature.visual} </motion.div> ))} </div> </div> </section> ); };
const FeatureText = ({ i, title, description, activeTextIndex, prefersReducedMotion }) => { const opacity = useTransform( activeTextIndex, [i - 0.5, i, i + 0.5], [0.3, 1, 0.3] ); const scale = useTransform( activeTextIndex, [i - 0.5, i, i + 0.5], prefersReducedMotion ? [1, 1, 1] : [0.98, 1, 0.98] ); return ( <motion.div style={{ opacity, scale }} className={prefersReducedMotion ? "" : "transition-opacity duration-200"}> <h3 className="text-3xl md:text-4xl font-bold tracking-tight balance-text" style={{ textWrap: 'balance' }}>{title}</h3> <p className="text-lg text-muted-foreground mt-4">{description}</p> </motion.div> ); };
const TheTrustSection = ({ simpleFadeIn, gentleLand, staggerContainer }) => ( <motion.section className="py-24 md:py-32 bg-secondary" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer} > <div className="container mx-auto max-w-6xl px-6"> <motion.h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-center balance-text" style={{ textWrap: 'balance' }} variants={simpleFadeIn} > Stop the "who owes what" headache. </motion.h2> <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"> <motion.div variants={gentleLand}><Card className="h-full"><CardHeader><CardTitle>"The AI scan is magic."</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">"It's not just OCR, it actually *understands* the items. Saved us 20 minutes."</p></CardContent></Card></motion.div> <motion.div variants={gentleLand}><Card className="h-full"><CardHeader><CardTitle>"Finally, real splitting."</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">"Lets me split a single item by percentage, shares, or amount. Must-have."</p></CardContent></Card></motion.div> <motion.div variants={gentleLand}><Card className="h-full"><CardHeader><CardTitle>"It just... works."</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">"Feels like an app Apple would build. The 'Pure Undo' is brilliant."</p></CardContent></Card></motion.div> </div> </div> </motion.section> );
const TheCloserSection = ({ simpleFadeIn, prefersReducedMotion }) => ( <section className="py-24 md:py-32 bg-primary text-primary-foreground"> <div className="container mx-auto max-w-3xl text-center px-6"> <h2 className="text-4xl md:text-5xl font-bold tracking-tighter balance-text" style={{ textWrap: 'balance' }}> Get your perfect split. Every time. </h2> <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto"> 100% free. No accounts. No friction. </p> <div className="mt-10"> <Button size="lg" variant="ctaSpecial" className="text-base font-semibold button-shimmer" animateBorderColor="white" > Scan Your Bill Now </Button> </div> </div> </section> );

/* -------------------------------------------------------------------------- */
/* PLACEHOLDER VISUALS                                                        */
/* -------------------------------------------------------------------------- */
const VisualReceipt = () => ( <div className="w-full h-full flex items-center justify-center"> <Card className="w-full max-w-sm h-[85%] p-6 shadow-xl relative overflow-hidden font-mono text-xs text-foreground"> <div className="text-center space-y-0.5"><p className="font-bold text-sm">Aldi Sud</p><p>Trierer Straße 116</p><p>56072 Koblenz-Metternich</p></div><p className="font-bold text-sm my-4">EUR</p> <div className="space-y-1 text-[10px] leading-tight"> <div className="flex justify-between"><span>4 x 415545 Naturjogurt 1kg</span> <span>7,16 A</span></div> <div className="flex justify-between"><span>2 x 560115 Landmilch 3,8%</span> <span>2,70 A</span></div> <div className="flex justify-between"><span>2 x 80000683 Pfand</span> <span>0,50 A</span></div> <div className="flex justify-between"><span>5 x 577446 Pringles 155g</span> <span>7,45 A</span></div> <div className="flex justify-between"><span>2 x 185454 Speisezwiebeln rot</span> <span>1,78 A</span></div> <div className="flex justify-between"><span>&nbsp;&nbsp;&nbsp;194121 Roestzwiebeln 150g</span> <span>1,19 A</span></div> <div className="flex justify-between"><span>&nbsp;&nbsp;&nbsp;582689 XXL Cashewkerne</span> <span>4,99 A</span></div> <div className="flex justify-between"><span>&nbsp;&nbsp;&nbsp;230712 Bananen RFA</span> <span>0,78 A</span></div> <div className="flex justify-between"><span>&nbsp;&nbsp;&nbsp;525149 Ingwer Bio</span> <span>0,11 A</span></div> <div className="flex justify-between"><span>&nbsp;&nbsp;&nbsp;230745 RispenTomaten lose</span> <span>1,20 A</span></div> </div> <div className="border-t border-border border-dashed my-3"></div><div className="space-y-0.5 text-sm font-bold"><div className="flex justify-between"><span>Summe</span> <span>29,44</span></div><div className="flex justify-between"><span>Kartenzahluung</span> <span>29,44</span></div></div> <motion.div className="absolute top-0 left-0 w-full h-1 bg-brand-indigo/50" style={{ boxShadow: '0 0 10px hsl(var(--brand-indigo)), 0 0 5px hsl(var(--brand-indigo))', filter: 'blur(1px)' }} animate={{ y: ['0%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear", repeatDelay: 0.5 }}/> </Card> </div> );
const VisualAINarrative = ({ prefersReducedMotion }) => { const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.3 } } }; const itemVariants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100 } } }; const iconAnimation = prefersReducedMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7], transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" } }; return ( <div className="w-full h-full flex items-center justify-center"> <Card className="w-full max-w-sm h-[85%] p-6 shadow-xl"> <CardHeader className="p-0"><CardTitle>Analyzing Bill...</CardTitle></CardHeader> <CardContent className="p-0 mt-6"> <motion.div className="space-y-4" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}> <motion.div className="flex items-center gap-3" variants={itemVariants}> <motion.span animate={iconAnimation}><Sparkles className="w-5 h-5 text-indigo-500" /></motion.span> <span className="text-muted-foreground">Extracting items and prices...</span> </motion.div> <motion.div className="flex items-center gap-3" variants={itemVariants}> <motion.span animate={iconAnimation} transition={{ ...iconAnimation.transition, delay: 0.2}}><Cpu className="w-5 h-5 text-muted-foreground" /></motion.span> <span className="text-muted-foreground">Understanding categories...</span> </motion.div> <motion.div className="flex items-center gap-3" variants={itemVariants}> <motion.span animate={iconAnimation} transition={{ ...iconAnimation.transition, delay: 0.4}}><ListChecks className="w-5 h-5 text-muted-foreground" /></motion.span> <span className="text-muted-foreground">Structuring for a perfect split!</span> </motion.div> </motion.div> </CardContent> </Card> </div> ); };
const VisualCleanList = ({ prefersReducedMotion }) => { const items = [ { icon: <Package />, name: "Naturjogurt 1kg (4x)", price: "7.16" }, { icon: <GlassWater />, name: "Landmilch 3,8% (2x)", price: "2.70" }, { icon: <GlassWater />, name: "Pfand (2x)", price: "0.50" }, { icon: <Package />, name: "Pringles 155g (5x)", price: "7.45" }, { icon: <Carrot />, name: "Speisezwiebeln rot", price: "1.78" }, { icon: <Package />, name: "Roestzwiebeln 150g", price: "1.19" }, { icon: <Bean />, name: "XXL Cashewkerne", price: "4.99" }, { icon: <Banana />, name: "Bananen RFA", price: "0.78" }, { icon: <ShoppingCart />, name: "Ingwer Bio", price: "0.11" }, { icon: <Carrot />, name: "RispenTomaten lose", price: "1.20" }, ]; return ( <div className="w-full h-full flex items-center justify-center"> <Card className="w-full max-w-sm h-[85%] p-6 shadow-xl flex flex-col"> <CardHeader className="p-0"><CardTitle>Found 10 Items</CardTitle></CardHeader> <CardContent className="p-0 mt-6 space-y-3 overflow-y-auto flex-grow"> {items.map((item, i) => ( <motion.div key={i} className="flex items-center justify-between" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: prefersReducedMotion ? 0 : 0.08 * i + 0.1, type: 'spring', stiffness: 120, damping: 20 }} > <div className="flex items-center gap-3"> <span className="text-lg">{React.cloneElement(item.icon, { className: "w-5 h-5 text-muted-foreground" })}</span> <span className="text-foreground text-sm">{item.name}</span> </div> <span className="font-mono text-sm text-foreground">€{item.price}</span> </motion.div> ))} </CardContent> <div className="border-t border-border pt-3 mt-3"> <div className="flex justify-between items-center"> <span className="text-base font-semibold">Summe</span> <span className="text-base font-semibold font-mono">€29.44</span> </div> </div> </Card> </div> ); };
const VisualMultiBill = () => ( <div className="w-full h-full flex items-center justify-center"> <div className="w-full max-w-md h-[85%] space-y-3 flex flex-col justify-center"> <Card> <div className="flex justify-between items-center p-4"> <span className="font-semibold">ALDI SÜD</span> <span className="text-sm text-muted-foreground">10 Items • €29.44</span> </div> </Card> <Card className="opacity-80 scale-95"> <div className="flex justify-between items-center p-4"> <span className="font-semibold">Bar Bill</span> <span className="text-sm text-muted-foreground">4 Items • €32.50</span> </div> </Card> </div> </div> );
const VisualSplitPopover = () => ( <div className="w-full h-full flex items-center justify-center"> <Card className="w-full max-w-md h-[85%] p-6 shadow-xl flex flex-col justify-center"> <CardHeader className="p-0"><CardTitle>Split "Shared Appetizer"</CardTitle><CardDescription>Total: €14.50</CardDescription></CardHeader> <CardContent className="p-0 mt-6 space-y-4"> <div className="flex justify-between items-center"><span className="text-foreground text-sm">Lukas</span><input type="text" value="€7.25" readOnly className="w-24 text-right bg-input border border-input rounded-md px-2 py-1 font-mono text-sm"/></div> <div className="flex justify-between items-center"><span className="text-foreground text-sm">Sophie</span><input type="text" value="€7.25" readOnly className="w-24 text-right bg-input border border-input rounded-md px-2 py-1 font-mono text-sm"/></div> <div className="border-t border-border pt-3 mt-3 flex justify-between"><span className="text-success font-medium text-sm">Total</span><span className="text-success font-medium font-mono text-sm">€14.50</span></div> </CardContent> </Card> </div> );
const VisualSuggestion = ({ isVisible, simpleFadeIn, prefersReducedMotion }) => { const variants = simpleFadeIn || { hidden: { opacity: 0 }, visible: { opacity: 1 } }; return ( <motion.div className="w-full h-full flex items-center justify-center" variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.8 }}> <Card className="w-full max-w-md h-[85%] p-6 shadow-xl flex flex-col justify-center"> <CardHeader className="p-0"><CardTitle>Split "Shared Appetizer"</CardTitle></CardHeader> <CardContent className="p-0 mt-6"> <div className="bg-secondary p-4 rounded-md"> <div className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-indigo-500"/><span className="font-medium text-sm">Proactive Suggestion</span></div> <p className="text-muted-foreground text-xs mt-1">Split like last time (Lukas, Sophie)?</p><Button variant="default" size="sm" className="mt-3 min-h-[36px]"> Yes, split 50/50 </Button> </div> </CardContent> </Card> </motion.div> ); };

/* -------------------------------------------------------------------------- */
/* HEADER & FOOTER                                                            */
/* -------------------------------------------------------------------------- */
const AppHeader = () => { const [theme, setTheme] = useState('light'); const [isMenuOpen, setIsMenuOpen] = useState(false); const prefersReducedMotion = usePrefersReducedMotion(); useEffect(() => { if (typeof window === 'undefined') return; const savedTheme = window.localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); setTheme(savedTheme); document.documentElement.classList.toggle('dark', savedTheme === 'dark'); document.documentElement.classList.toggle('light', savedTheme === 'light'); }, []); const toggleTheme = () => { const newTheme = theme === 'light' ? 'dark' : 'light'; setTheme(newTheme); window.localStorage.setItem('theme', newTheme); document.documentElement.classList.toggle('dark', newTheme === 'dark'); document.documentElement.classList.toggle('light', newTheme === 'light'); }; const iconVariants = { initial: { y: -20, opacity: 0, rotate: -90 }, animate: { y: 0, opacity: 1, rotate: 0 }, exit: { y: 20, opacity: 0, rotate: 90 }, }; const iconTransition = prefersReducedMotion ? { duration: 0.01 } : { type: 'spring', stiffness: 300, damping: 20 }; return ( <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm"> <div className="container mx-auto h-20 px-6 flex items-center justify-between"> <div className="flex items-center gap-2"> <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">S</div> <span className="text-xl font-bold">Splitter</span> </div> <nav className="hidden md:flex items-center gap-4"> <Button variant="ghost" onClick={toggleTheme} size="icon" aria-label="Toggle theme" className="overflow-hidden"> <AnimatePresence mode="wait" initial={false}> {theme === 'dark' ? ( <motion.div key="sun" variants={iconVariants} initial="initial" animate="animate" exit="exit" transition={iconTransition}> <Sun className="w-5 h-5" /> </motion.div> ) : ( <motion.div key="moon" variants={iconVariants} initial="initial" animate="animate" exit="exit" transition={iconTransition}> <Moon className="w-5 h-5" /> </motion.div> )} </AnimatePresence> </Button> <Button>Get Started Free</Button> </nav> <div className="md:hidden flex items-center gap-2"> <Button variant="ghost" onClick={toggleTheme} size="icon" aria-label="Toggle theme"> {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />} </Button> <Button variant="ghost" onClick={() => setIsMenuOpen(true)} size="icon" aria-label="Open menu"> <Menu className="w-6 h-6" /> </Button> </div> </div> <AnimatePresence> {isMenuOpen && ( <motion.div className="fixed inset-0 z-[100] bg-background p-6 md:hidden" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}> <div className="flex justify-between items-center"> <span className="text-xl font-bold">Splitter</span> <Button variant="ghost" onClick={() => setIsMenuOpen(false)} size="icon" aria-label="Close menu"> <X className="w-6 h-6" /> </Button> </div> <div className="flex flex-col items-center justify-center gap-6 mt-24"> <Button size="lg" className="w-full">Get Started Free</Button> </div> </motion.div> )} </AnimatePresence> </header> ); };
const AppFooter = () => ( <footer className="border-t border-border bg-secondary"> <div className="container mx-auto max-w-6xl px-6 py-12 flex flex-col md:flex-row justify-between items-center"> <div className="flex items-center gap-2"> <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">S</div> <span className="text-lg font-bold">Splitter</span> </div> <div className="flex gap-4 mt-6 md:mt-0"> <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Splitter. All rights reserved.</p> </div> </div> </footer> );

