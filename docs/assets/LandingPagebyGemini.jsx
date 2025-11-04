import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence
} from 'framer-motion';
import {
  ScanLine,
  Sparkles,
  ListChecks,
  Users,
  Layers3,
  Sun,
  Moon,
  Menu,
  X,
  Cpu, // Using Cpu icon for "Understanding"
  ShoppingCart, // Fallback icons
  GlassWater,
  Package,
  Bean,
  Banana,
  Carrot
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* STYLES & THEME INJECTION                                                   */
/* This injects your blueprint's theme variables for shadcn/ui.               */
/* -------------------------------------------------------------------------- */

const ThemeStyles = () => (
  <style>{`
    :root {
      --background: 0 0% 100%; /* light mode */
      --foreground: 240 10% 3.9%;
      --card: 0 0% 100%;
      --card-foreground: 240 10% 3.9%;
      --popover: 0 0% 100%;
      --popover-foreground: 240 10% 3.9%;
      --primary: 240 5.9% 10%;
      --primary-foreground: 0 0% 98%;
      --secondary: 240 4.8% 95.9%;
      --secondary-foreground: 240 5.9% 10%;
      --muted: 240 4.8% 95.9%;
      --muted-foreground: 240 3.8% 46.1%;
      --destructive: 0 84.2% 60.2%;
      --destructive-foreground: 0 0% 98%;
      --border: 240 5.9% 90%;
      --input: 240 5.9% 90%;
      --ring: 240 5.9% 10%;
      --radius: 0.5rem; /* 8px from blueprint */
      
      /* Custom Colors from Blueprint */
      --brand-indigo: 243 76% 58%; /* #4f46e5 */
      --success: 142 68% 41%; /* green-500 */
      --error: 0 84% 60%; /* red-500 */
      --error-bg-light: 0 100% 97%; /* red-100 */
      --error-text-light: 0 72% 51%; /* red-700 */
    }

    html.dark {
      --background: 240 5.9% 10%; /* slate-900 */
      --foreground: 0 0% 98%; /* slate-50 */
      --card: 240 3.7% 15.9%; /* slate-800 */
      --card-foreground: 0 0% 98%;
      --popover: 240 3.7% 15.9%;
      --popover-foreground: 0 0% 98%;
      --primary: 0 0% 98%;
      --primary-foreground: 240 5.9% 10%;
      --secondary: 240 3.7% 15.9%;
      --secondary-foreground: 0 0% 98%;
      --muted: 240 3.7% 15.9%;
      --muted-foreground: 240 5% 64.9%; /* slate-400 */
      --destructive: 0 62.8% 30.6%; /* red-600 */
      --destructive-foreground: 0 0% 98%;
      --border: 240 3.7% 15.9%;
      --input: 240 3.7% 15.9%;
      --ring: 0 0% 98%;
      
      --error-bg-light: 240 3.7% 15.9%;
      --error-text-light: 0 72% 51%;
    }
    
    body {
      background-color: hsl(var(--background));
      color: hsl(var(--foreground));
      font-family: 'Inter', sans-serif;
    }
    
    /* Helper classes to bridge shadcn/tailwind and our CSS vars */
    .bg-background { background-color: hsl(var(--background)); }
    .bg-foreground { background-color: hsl(var(--foreground)); }
    .bg-card { background-color: hsl(var(--card)); }
    .bg-primary { background-color: hsl(var(--primary)); }
    .bg-secondary { background-color: hsl(var(--secondary)); }
    .bg-muted { background-color: hsl(var(--muted)); }
    .bg-destructive { background-color: hsl(var(--destructive)); }
    .bg-input { background-color: hsl(var(--input)); }
    
    .text-foreground { color: hsl(var(--foreground)); }
    .text-card-foreground { color: hsl(var(--card-foreground)); }
    .text-primary { color: hsl(var(--primary)); }
    .text-primary-foreground { color: hsl(var(--primary-foreground)); }
    .text-secondary-foreground { color: hsl(var(--secondary-foreground)); }
    .text-muted-foreground { color: hsl(var(--muted-foreground)); }
    .text-destructive { color: hsl(var(--destructive)); }
    .text-destructive-foreground { color: hsl(var(--destructive-foreground)); }
    .text-success { color: hsl(var(--success)); }
    
    .border-border { border-color: hsl(var(--border)); }
    .border-input { border-color: hsl(var(--input)); }
    .ring-ring { box-shadow: 0 0 0 2px hsl(var(--ring)); }

  `}</style>
);


/* -------------------------------------------------------------------------- */
/* UTILITY HOOKS (useMediaQuery, useReducedMotion)                            */
/* -------------------------------------------------------------------------- */

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    listener();
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  return matches;
};

// Custom hook to check for reduced motion preference
const usePrefersReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  return reducedMotion;
};

/* -------------------------------------------------------------------------- */
/* REUSABLE shadcn/ui-like COMPONENTS                                         */
/* -------------------------------------------------------------------------- */

const cn = (...classes) => classes.filter(Boolean).join(' ');

// Button Component (motion-compatible)
const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-secondary hover:text-secondary-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-secondary hover:text-secondary-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8 text-base', // Updated for Hero CTA
    icon: 'h-10 w-10',
  };

  const classes = cn(
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
    variants[variant] || variants.default,
    sizes[size] || sizes.default,
    className
  );
  return <motion.button className={classes} ref={ref} {...props} />;
});

// Card Component (motion-compatible)
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={cn('rounded-lg border border-border bg-card text-card-foreground shadow-sm', className)}
    {...props}
  />
));

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
));

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('font-semibold leading-none tracking-tight', className)} {...props} />
));

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));


/* -------------------------------------------------------------------------- */
/* MAIN LANDING PAGE COMPONENT                                                */
/* -------------------------------------------------------------------------- */

export default function LandingPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = usePrefersReducedMotion();

  // Helper to disable complex animations if on mobile or reduced motion
  const useCinematicScroll = !isMobile && !prefersReducedMotion;
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const gentleLand = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 180, damping: 25 },
    },
  };
  
  // A simple fade-in for mobile fallbacks
  const simpleFadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <ThemeStyles />
      <AppHeader />

      {/* Main Content Area */}
      <main className="flex-grow">
        
        {/* [1] The Hero Section */}
        <motion.section
          className="container mx-auto max-w-4xl text-center flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-24"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tighter"
            variants={gentleLand}
          >
            Split bills. Not atoms.
          </motion.h1>
          <motion.p
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl"
            variants={gentleLand}
          >
            The truly intelligent bill splitter. Scan a receipt, assign items, and
            get a perfect summary in seconds. 100% free.
          </motion.p>
          <motion.div variants={gentleLand} className="mt-10">
            <Button size="lg" className="text-base font-semibold">
              Scan Your First Bill
            </Button>
          </motion.div>
        </motion.section>

        {/* [2] The "Mess-to-Magic" Section */}
        <MessToMagicSection 
          useCinematicScroll={useCinematicScroll}
          simpleFadeIn={simpleFadeIn}
        />

        {/* [3] "The Logic" Section */}
        <TheLogicSection
          useCinematicScroll={useCinematicScroll}
          simpleFadeIn={simpleFadeIn}
        />
        
        {/* [4] "The Trust" Section */}
        <motion.section 
          className="py-24 md:py-32 bg-secondary"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <div className="container mx-auto max-w-6xl px-6">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold tracking-tighter text-center"
              variants={simpleFadeIn}
            >
              Stop the "who owes what" headache.
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <motion.div variants={gentleLand}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>"The AI scan is magic."</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">"It's not just OCR, it actually *understands* the items. It saved my group 20 minutes on our last trip."</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={gentleLand}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>"Finally, real splitting."</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">"Finally, an app that lets me split a single item by percentage, shares, or amount. A must-have for group dinners."</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={gentleLand}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>"It just... works."</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">"It feels like an app Apple would build. The 'Pure Undo' feature is brilliant. No more 'Are you sure?' popups."</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* [5] "The Closer" Section */}
        <section className="py-24 md:py-32 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-3xl text-center px-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Get your perfect split. Every time.
            </h2>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              100% free. No accounts. No friction.
            </p>
            <div className="mt-10">
              <Button size="lg" variant="secondary" className="text-base font-semibold">
                Scan Your Bill Now
              </Button>
            </div>
          </div>
        </section>
        
      </main>

      <AppFooter />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* [2] Mess-to-Magic Component                                                */
/* -------------------------------------------------------------------------- */

const MessToMagicSection = ({ useCinematicScroll, simpleFadeIn }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // Spring-ify the scrollYProgress
  const scrollYSpring = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Opacity for 3 visuals
  const opacityV1 = useTransform(scrollYSpring, [0, 0.25, 0.33], [1, 1, 0]);
  const opacityV2 = useTransform(scrollYSpring, [0.33, 0.45, 0.66], [0, 1, 0]);
  const opacityV3 = useTransform(scrollYSpring, [0.66, 0.75, 1], [0, 1, 1]);
  
  // Scale for 3 visuals
  const scaleV1 = useTransform(scrollYSpring, [0, 0.33], [1, 0.95]);
  const scaleV2 = useTransform(scrollYSpring, [0.33, 0.66], [0.95, 0.95]);
  const scaleV3 = useTransform(scrollYSpring, [0.66, 1], [0.95, 1]);


  if (!useCinematicScroll) {
    return (
      <motion.section 
        className="container mx-auto max-w-6xl px-6 py-24 md:py-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={simpleFadeIn} className="max-w-xl">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
            An intelligent assistant, not a dumb calculator.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our AI intelligently extracts items, quantities, and prices, even from complex receipts.
          </p>
        </motion.div>
        <motion.div variants={simpleFadeIn} className="mt-12">
          {/* Mobile view just shows the end result */}
          <VisualCleanList />
        </motion.div>
      </motion.section>
    );
  }

  return (
    <section ref={targetRef} className="h-[300vh] container mx-auto max-w-6xl px-6">
      {/* FIX: Added padding-top to offset the sticky header */}
      <div className="sticky top-0 h-screen flex flex-col md:flex-row gap-12 items-center pt-24">
        {/* Left: Text */}
        <div className="w-full md:w-1/2">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
            An intelligent assistant, not a dumb calculator.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our AI intelligently extracts items, quantities, and prices, even from complex receipts.
          </p>
        </div>
        
        {/* Right: Visuals */}
        <div className="w-full md:w-1/2 h-[60vh] md:h-full relative">
          <motion.div style={{ opacity: opacityV1, scale: scaleV1 }} className="absolute inset-0">
            <VisualReceipt />
          </motion.div>
          <motion.div style={{ opacity: opacityV2, scale: scaleV2 }} className="absolute inset-0">
            <VisualAINarrative />
          </motion.div>
          <motion.div style={{ opacity: opacityV3, scale: scaleV3 }} className="absolute inset-0">
            <VisualCleanList />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* [3] The Logic Section Component                                            */
/* -------------------------------------------------------------------------- */

const TheLogicSection = ({ useCinematicScroll, simpleFadeIn }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });
  
  const scrollYSpring = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Define breakpoints for text and visual transitions
  const breakpoints = [0, 0.33, 0.66, 1];

  // --- NEW LOGIC FOR TEXT HIGHLIGHTING ---
  // We map scroll progress to an "active index"
  const activeTextIndex = useTransform(scrollYSpring, breakpoints, [0, 1, 2, 2]);

  // Opacity for 3 visuals
  // Visual 1 is active from 0 to 0.33
  const visualOpacity1 = useTransform(scrollYSpring, [0, 0.25, 0.33], [1, 1, 0]);
  // Visual 2 is active from 0.33 to 0.66
  const visualOpacity2 = useTransform(scrollYSpring, [0.33, 0.58, 0.66], [0, 1, 0]);
  // Visual 3 is active from 0.66 to 1
  const visualOpacity3 = useTransform(scrollYSpring, [0.66, 0.9, 1], [0, 1, 1]);


  // Mobile Fallback
  if (!useCinematicScroll) {
    return (
      <motion.section 
        className="container mx-auto max-w-6xl px-6 py-24 md:py-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={simpleFadeIn}
      >
        <div className="flex flex-col gap-16">
          <motion.div variants={simpleFadeIn} className="space-y-8">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Handle a Whole Trip, Not Just One Bill.</h3>
            <p className="text-lg text-muted-foreground mt-4">Scan up to three bills at once and manage them as a single merged list or in separate, collapsible sections.</p>
            <VisualMultiBill />
          </motion.div>
          <motion.div variants={simpleFadeIn} className="space-y-8">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Go Beyond 'Equally.' Split How You Actually Paid.</h3>
            <p className="text-lg text-muted-foreground mt-4">Assign items to any combination of people. Split a single item by exact amount, percentage, or share.</p>
            <VisualSplitPopover />
          </motion.div>
          <motion.div variants={simpleFadeIn} className="space-y-8">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">An App That Learns Your Habits.</h3>
            <p className="text-lg text-muted-foreground mt-4">Our app recognizes items you've split before and suggests the split, so you can get it done in one tap.</p>
            <VisualSuggestion />
          </motion.div>
        </div>
      </motion.section>
    );
  }

  // --- NEW DESKTOP LOGIC ---
  const logicFeatures = [
    {
      title: "Handle a Whole Trip, Not Just One Bill.",
      description: "Scan up to three bills at once and manage them as a single merged list or in separate, collapsible sections.",
      visual: <VisualMultiBill />
    },
    {
      title: "Go Beyond 'Equally.' Split How You Actually Paid.",
      description: "Assign items to any combination of people. Split a single item by exact amount, percentage, or share.",
      visual: <VisualSplitPopover />
    },
    {
      title: "An App That Learns Your Habits.",
      description: "Our app recognizes items you've split before and suggests the split, so you can get it done in one tap.",
      visual: <VisualSuggestion />
    }
  ];
  
  const visualOpacities = [visualOpacity1, visualOpacity2, visualOpacity3];

  return (
    <section ref={targetRef} className="h-[300vh] container mx-auto max-w-6xl px-6">
      <div className="sticky top-0 h-screen flex flex-col md:flex-row gap-12 items-center pt-24">
        {/* Left: Text */}
        <div className="w-full md:w-1/2 flex flex-col gap-12">
          {logicFeatures.map((feature, i) => (
            <FeatureText
              key={feature.title}
              title={feature.title}
              description={feature.description}
              // This is the new part: we pass the active index
              // and the motion value to the child component
              i={i}
              activeTextIndex={activeTextIndex}
            />
          ))}
        </div>
        
        {/* Right: Visuals */}
        <div className="w-full md:w-1/2 h-[60vh] md:h-full relative">
          {logicFeatures.map((feature, i) => (
            <motion.div 
              key={i}
              style={{ opacity: visualOpacities[i] }} 
              className="absolute inset-0"
            >
              {feature.visual}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// New component to handle the text highlighting logic
const FeatureText = ({ i, title, description, activeTextIndex }) => {
  // We use useTransform to map the active index (0, 1, or 2)
  // to an opacity value for this specific text block.
  const opacity = useTransform(
    activeTextIndex,
    // Input range: index before, this index, index after
    [i - 0.5, i, i + 0.5],
    // Output range: faded, active, faded
    [0.3, 1, 0.3]
  );
  
  // Also create a scale transform for a subtle "pop"
  const scale = useTransform(
    activeTextIndex,
    [i - 0.5, i, i + 0.5],
    [0.98, 1, 0.98]
  );

  return (
    <motion.div style={{ opacity, scale }} className="transition-opacity duration-200">
      <h3 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h3>
      <p className="text-lg text-muted-foreground mt-4">{description}</p>
    </motion.div>
  );
};


/* -------------------------------------------------------------------------- */
/* PLACEHOLDER VISUALS (Now with fixes)                                       */
/* -------------------------------------------------------------------------- */

// FIX 1: Converted bill image to an inline SVG representation
const VisualReceipt = () => (
  <div className="w-full h-full flex items-center justify-center">
    <Card className="w-full max-w-sm h-[85%] p-6 shadow-xl relative overflow-hidden font-mono text-xs">
      <div className="text-center space-y-0.5">
        <p className="font-bold text-sm">Aldi Sud</p>
        <p>Trierer Straße 116</p>
        <p>56072 Koblenz-Metternich</p>
      </div>
      <p className="font-bold text-sm my-4">EUR</p>
      <div className="space-y-1">
        <div className="flex justify-between"><span>4 x 415545 Naturjogurt 1kg</span> <span>7,16 A</span></div>
        <div className="flex justify-between"><span>2 x 560115 Landmilch 3,8%</span> <span>2,70 A</span></div>
        <div className="flex justify-between"><span>2 x 80000683 Pfand</span> <span>0,50 A</span></div>
        <div className="flex justify-between"><span>5 x 577446 Pringles 155g</span> <span>7,45 A</span></div>
        <div className="flex justify-between"><span>2 x 185454 Speisezwiebeln rot</span> <span>1,78 A</span></div>
        <div className="flex justify-between"><span>&nbsp;&nbsp;&nbsp;194121 Roestzwiebeln 150g</span> <span>1,19 A</span></div>
        <div className="flex justify-between"><span>&nbsp;&nbsp;&nbsp;582689 XXL Cashewkerne</span> <span>4,99 A</span></div>
        <div className="flex justify-between"><span>&nbsp;&nbsp;&nbsp;230712 Bananen RFA</span> <span>0,78 A</span></div>
        <div className="flex justify-between"><span>&nbsp;&nbsp;&nbsp;525149 Ingwer Bio</span> <span>0,11 A</span></div>
        <div className="flex justify-between"><span>&nbsp;&nbsp;&nbsp;230745 RispenTomaten lose</span> <span>1,20 A</span></div>
      </div>
      <div className="border-t border-border border-dashed my-4"></div>
      <div className="space-y-1 text-sm font-bold">
        <div className="flex justify-between"><span>Summe</span> <span>29,44</span></div>
        <div className="flex justify-between"><span>Kartenzahluung</span> <span>29,44</span></div>
      </div>
      {/* Scan Line Animation */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-brand-indigo/50"
        style={{
          boxShadow: '0 0 10px hsl(var(--brand-indigo)), 0 0 5px hsl(var(--brand-indigo))',
          filter: 'blur(1px)'
        }}
        animate={{ y: ['0%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </Card>
  </div>
);

// FIX 3: Added one-time stagger animation to the AI narrative
const VisualAINarrative = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Each line animates 0.3s after the previous
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className="w-full max-w-sm h-[85%] p-6 shadow-xl">
        <CardHeader className="p-0">
          <CardTitle>Analyzing Bill...</CardTitle>
        </CardHeader>
        {/* FIX: Wrapped motion.div in CardContent */}
        <CardContent className="p-0 mt-6">
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            // `whileInView` is used to trigger when this visual fades in
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <motion.div className="flex items-center gap-3" variants={itemVariants}>
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <span className="text-muted-foreground">Extracting items and prices...</span>
            </motion.div>
            
            <motion.div className="flex items-center gap-3" variants={itemVariants}>
              <Cpu className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">Understanding categories...</span>
            </motion.div>
            
            <motion.div className="flex items-center gap-3" variants={itemVariants}>
              <ListChecks className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">Structuring for a perfect split!</span>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

// FIX 4: Fixed overflow and added Total amount
const VisualCleanList = () => {
  const items = [
    { icon: <Package />, name: "Naturjogurt 1kg (4x)", price: "7.16" },
    { icon: <GlassWater />, name: "Landmilch 3,8% (2x)", price: "2.70" },
    { icon: <GlassWater />, name: "Pfand (2x)", price: "0.50" },
    { icon: <Package />, name: "Pringles 155g (5x)", price: "7.45" },
    { icon: <Carrot />, name: "Speisezwiebeln rot", price: "1.78" },
    { icon: <Package />, name: "Roestzwiebeln 150g", price: "1.19" },
    { icon: <Bean />, name: "XXL Cashewkerne", price: "4.99" },
    { icon: <Banana />, name: "Bananen RFA", price: "0.78" },
    { icon: <ShoppingCart />, name: "Ingwer Bio", price: "0.11" },
    { icon: <Carrot />, name: "RispenTomaten lose", price: "1.20" },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* FIX 4: Set max-h and flex-col to keep total at bottom */}
      <Card className="w-full max-w-sm h-[85%] p-6 shadow-xl flex flex-col">
        <CardHeader className="p-0">
          <CardTitle>Found 10 Items</CardTitle>
        </CardHeader>
        {/* FIX 4: Added overflow-y-auto and flex-grow */}
        <CardContent className="p-0 mt-6 space-y-4 overflow-y-auto flex-grow">
          {items.map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-foreground text-sm">{item.name}</span>
              </div>
              <span className="font-mono text-sm">€{item.price}</span>
            </motion.div>
          ))}
        </CardContent>
        {/* FIX 4: Added Total amount section */}
        <div className="border-t border-border pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Summe</span>
            <span className="text-lg font-bold font-mono">€29.44</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

const VisualMultiBill = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-full max-w-md h-[85%] space-y-3">
      <Card>
        <div className="flex justify-between items-center p-4">
          <span className="font-semibold">ALDI SÜD</span>
          <span className="text-sm text-muted-foreground">10 Items • €29.44</span>
        </div>
      </Card>
      <Card className="opacity-80 scale-95">
        <div className="flex justify-between items-center p-4">
          <span className="font-semibold">Bar Bill</span>
          <span className="text-sm text-muted-foreground">4 Items • €32.50</span>
        </div>
      </Card>
    </div>
  </div>
);

const VisualSplitPopover = () => (
  <div className="w-full h-full flex items-center justify-center">
    <Card className="w-full max-w-md h-[85%] p-6 shadow-xl">
      <CardHeader className="p-0">
        <CardTitle>Split "Shared Appetizer"</CardTitle>
        <CardDescription>Total: €14.50</CardDescription>
      </CardHeader>
      <CardContent className="p-0 mt-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-foreground">Lukas</span>
          <input type="text" value="€7.25" readOnly className="w-24 text-right bg-input border border-border rounded-md px-2 py-1 font-mono" />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-foreground">Sophie</span>
          <input type="text" value="€7.25" readOnly className="w-24 text-right bg-input border border-border rounded-md px-2 py-1 font-mono" />
        </div>
        <div className="border-t border-border pt-4 flex justify-between">
          <span className="text-success font-medium">Total</span>
          <span className="text-success font-medium font-mono">€14.50</span>
        </div>
      </CardContent>
    </Card>
  </div>
);

const VisualSuggestion = () => (
  <div className="w-full h-full flex items-center justify-center">
    <Card className="w-full max-w-md h-[85%] p-6 shadow-xl">
      <CardHeader className="p-0">
        <CardTitle>Split "Shared Appetizer"</CardTitle>
      </CardHeader>
      <CardContent className="p-0 mt-6">
        <div className="bg-secondary p-4 rounded-md">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span className="font-medium">Proactive Suggestion</span>
          </div>
          <p className="text-muted-foreground text-sm mt-2">Split like last time (Lukas, Sophie)?</p>
          <Button variant="default" size="sm" className="mt-4">Yes, split 50/50</Button>
        </div>
      </CardContent>
    </Card>
  </div>
);


/* -------------------------------------------------------------------------- */
/* PLACEHOLDER HEADER & FOOTER                                                */
/* -------------------------------------------------------------------------- */

const AppHeader = () => {
  const [theme, setTheme] = useState('dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Set initial theme based on localStorage or system pref
  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme') || 'dark'; // Default to dark
    setTheme(savedTheme);
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    window.localStorage.setItem('theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto h-20 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">S</div>
          <span className="text-xl font-bold">Splitter</span>
        </div>
        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" onClick={toggleTheme} size="icon">
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div key="sun" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
          <Button>Get Started Free</Button>
        </nav>
        <div className="md:hidden flex items-center gap-2">
          <Button variant="ghost" onClick={toggleTheme} size="icon">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" onClick={() => setIsMenuOpen(true)} size="icon">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-background p-6 md:hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Splitter</span>
              <Button variant="ghost" onClick={() => setIsMenuOpen(false)} size="icon">
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center gap-6 mt-24">
              <Button size="lg" className="w-full">Get Started Free</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const AppFooter = () => (
  <footer className="border-t border-border bg-secondary">
    <div className="container mx-auto max-w-6xl px-6 py-12 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">S</div>
        <span className="text-lg font-bold">Splitter</span>
      </div>
      <div className="flex gap-4 mt-6 md:mt-0">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Splitter. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

