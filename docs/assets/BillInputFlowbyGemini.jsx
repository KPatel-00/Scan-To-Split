import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useAnimate,
  stagger,
  LayoutGroup // Import LayoutGroup for the stepper animation
} from 'framer-motion';
import {
  Sparkles,
  UploadCloud,
  Plus,
  Users,
  X,
  PlusCircle,
  FileText,
  Loader2,
  List,
  CheckCircle2,
  Sun, // For theme
  Moon, // For theme
  ChevronRight, // For CTA
  ChevronLeft, // For Back navigation
  Package, // Item icons
  GlassWater,
  Carrot,
  Bone,
  ListChecks,
  Check // Added Check icon for completed steps
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* STYLES & THEME INJECTION                                                   */
/* -------------------------------------------------------------------------- */
const ThemeStyles = () => (
  <style>{`
    :root {
      --background: 0 0% 100%; /* light mode: slate-50 */
      --foreground: 240 10% 3.9%; /* slate-900 */
      --card: 0 0% 100%; /* white */
      --card-foreground: 240 10% 3.9%;
      --popover: 0 0% 100%;
      --popover-foreground: 240 10% 3.9%;
      --primary: 243 76% 58%; /* indigo-600 */
      --primary-foreground: 0 0% 98%;
      --secondary: 240 4.8% 95.9%; /* slate-100 - Use sparingly */
      --secondary-foreground: 240 5.9% 10%;
      --muted: 240 4.8% 95.9%;
      --muted-foreground: 240 3.8% 46.1%; /* slate-600 */
      --destructive: 0 84.2% 60.2%; /* red-500 */
      --destructive-foreground: 0 0% 98%;
      --border: 240 5.9% 90%; /* slate-200 */
      --input: 240 5.9% 90%;
      --ring: 243 76% 58%;
      --radius: 0.5rem; /* 8px */

      /* Custom Colors */
      --brand-indigo: 243 76% 58%; /* #4f46e5 */
      --success: 139 71% 42%; /* green-500 */
      --error: 0 84.2% 60.2%; /* red-500 */
      --error-bg-light: 0 86% 97%; /* red-100 */
      --error-text-light: 0 72% 51%; /* red-700 */
    }
    html.dark {
      --background: 240 5.9% 10%; /* slate-900 */
      --foreground: 0 0% 98%; /* slate-50 */
      --card: 240 3.7% 15.9%; /* slate-800 */
      --card-foreground: 0 0% 98%;
      --popover: 240 3.7% 15.9%;
      --popover-foreground: 0 0% 98%;
      --primary: 243 76% 58%; /* indigo-600 */
      --primary-foreground: 0 0% 98%;
      --secondary: 240 3.7% 15.9%; /* slate-800 - Use sparingly */
      --secondary-foreground: 0 0% 98%;
      --muted: 240 3.7% 15.9%;
      --muted-foreground: 240 5% 64.9%; /* slate-400 */
      --destructive: 0 62.8% 30.6%;
      --destructive-foreground: 0 0% 98%;
      --border: 240 3.7% 25.9%; /* slate-700 */
      --input: 240 3.7% 25.9%;
      --ring: 243 76% 58%;
      --error-bg-light: 0 62.8% 30.6%;
      --error-text-light: 0 84.2% 60.2%;
    }
    /* ... (helper classes) */
    .bg-background { background-color: hsl(var(--background)); }
    .bg-card { background-color: hsl(var(--card)); }
    .bg-primary { background-color: hsl(var(--primary)); }
    .bg-secondary { background-color: hsl(var(--secondary)); }
    .bg-destructive { background-color: hsl(var(--destructive)); }
    .text-foreground { color: hsl(var(--foreground)); }
    .text-muted-foreground { color: hsl(var(--muted-foreground)); }
    .text-primary { color: hsl(var(--primary)); }
    .text-primary-foreground { color: hsl(var(--primary-foreground)); }
    .text-secondary-foreground { color: hsl(var(--secondary-foreground)); }
    .text-destructive { color: hsl(var(--destructive)); }
    .text-success { color: hsl(var(--success)); }
    .text-error-light { color: hsl(var(--error-text-light)); }
    .bg-error-light { background-color: hsl(var(--error-bg-light)); }
    .border-border { border-color: hsl(var(--border)); }
    .border-input { border-color: hsl(var(--input)); }

    /* Minimalist Tabs styles */
    .minimal-tabs-list { background-color: transparent; padding: 0; height: auto; border-bottom: 1px solid hsl(var(--border)); }
    .minimal-tabs-trigger { background-color: transparent; box-shadow: none; border-bottom: 2px solid transparent; border-radius: 0; padding: 1rem 0.5rem; color: hsl(var(--muted-foreground)); font-weight: 500; }
    .minimal-tabs-trigger[data-state="active"] { background-color: transparent; color: hsl(var(--primary)); border-bottom-color: hsl(var(--primary)); box-shadow: none; }

    /* NEW: Stepper Transition */
    .stepper-underline {
      position: absolute;
      bottom: -1px; /* Align with border */
      left: 0;
      right: 0;
      height: 2px;
      background: hsl(var(--primary));
      border-radius: 1px;
    }
  `}</style>
);

/* -------------------------------------------------------------------------- */
/* UTILITY HOOKS & COMPONENTS                                                 */
/* -------------------------------------------------------------------------- */
const cn = (...classes) => classes.filter(Boolean).join(' ');

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

// --- Reusable shadcn/ui-like Components ---
const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  const variants = { default: 'bg-primary text-primary-foreground hover:bg-primary/90', destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90', outline: 'border border-input bg-background hover:bg-secondary hover:text-secondary-foreground', secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80', ghost: 'hover:bg-secondary hover:text-secondary-foreground', link: 'text-primary underline-offset-4 hover:underline', };
  const sizes = { default: 'h-10 px-4 py-2', sm: 'h-9 rounded-md px-3', lg: 'h-11 rounded-md px-8', icon: 'h-10 w-10' };
  const classes = cn('inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none', variants[variant] || variants.default, sizes[size] || sizes.default, className);
  return <motion.button className={classes} ref={ref} {...props} />;
});
const Card = React.forwardRef(({ className, ...props }, ref) => ( <div ref={ref} className={cn('rounded-lg border border-border bg-card text-foreground shadow-sm', className)} {...props} /> ));
const CardHeader = React.forwardRef(({ className, ...props }, ref) => ( <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} /> ));
const CardTitle = React.forwardRef(({ className, ...props }, ref) => ( <h3 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} /> ));
const CardContent = React.forwardRef(({ className, ...props }, ref) => ( <div ref={ref} className={cn('p-6 pt-0', className)} {...props} /> ));
const CardFooter = React.forwardRef(({ className, ...props }, ref) => ( <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} /> ));
const Input = React.forwardRef(({ className, ...props }, ref) => ( <input className={cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50', className)} ref={ref} {...props} /> ));
const Avatar = React.forwardRef(({ className, ...props }, ref) => ( <div ref={ref} className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)} {...props} /> ));
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => ( <div ref={ref} className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted font-medium', className)} {...props} /> ));
const Tabs = ({ children, defaultValue }) => { const [activeTab, setActiveTab] = useState(defaultValue); return (<TabsContext.Provider value={{ activeTab, setActiveTab }}> <div className="flex flex-col w-full">{children}</div> </TabsContext.Provider>); };
const TabsContext = React.createContext(null);
const TabsList = ({ children, className }) => ( <div className={cn('minimal-tabs-list flex space-x-1', className)}> {children} </div> );
const TabsTrigger = ({ children, value, className }) => { const { activeTab, setActiveTab } = React.useContext(TabsContext); const isActive = activeTab === value; return ( <button onClick={() => setActiveTab(value)} data-state={isActive ? 'active' : 'inactive'} className={cn('minimal-tabs-trigger inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50', className)}> {children} </button> ); };
const TabsContent = ({ children, value }) => { const { activeTab } = React.useContext(TabsContext); return activeTab === value ? <div className="mt-6">{children}</div> : null; };

// --- Mock Header ---
const AppHeader = () => (
  <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
    <div className="container mx-auto h-20 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2"> <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">S</div> <span className="text-xl font-bold">Splitter</span> </div>
      <Button variant="ghost" size="icon"> <Sun className="w-5 h-5" /> </Button>
    </div>
  </header>
);

/* -------------------------------------------------------------------------- */
/* STEPPER COMPONENT - REDESIGNED                                             */
/* -------------------------------------------------------------------------- */
const AppStepper = ({ currentStep, onStepClick }) => { // Added onStepClick prop
  const steps = [
    { number: 1, name: "Bill Input" },
    { number: 2, name: "Assign Items" },
    { number: 3, name: "Summary" }
  ];

  return (
    <nav className="py-4 bg-background border-b border-border"> {/* Reduced padding */}
      <div className="container mx-auto max-w-2xl px-6"> {/* Reduced max-width */}
        {/* LayoutGroup enables animation between step underlines */}
        <LayoutGroup>
          <div className="relative flex items-center justify-between">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />

            {steps.map((step) => {
              const isActive = step.number === currentStep;
              const isCompleted = step.number < currentStep;
              // Allow clicking completed steps (Blueprint Rule)
              const isClickable = isCompleted && onStepClick;

              return (
                <div key={step.number} className="relative z-10 flex flex-col items-center">
                  <motion.button
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
                      isActive ? "bg-primary border-primary text-primary-foreground" :
                      isCompleted ? "bg-background border-primary text-primary" :
                      "bg-background border-border text-muted-foreground",
                      isClickable && "cursor-pointer hover:bg-primary/10"
                    )}
                    onClick={() => isClickable && onStepClick(step.number)}
                    disabled={!isClickable && !isActive} // Disable future steps
                    // Subtle pop animation on hover/tap
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-sm font-bold">{step.number}</span>}
                  </motion.button>
                  <p className={cn(
                    "mt-2 text-xs font-medium absolute top-full whitespace-nowrap pt-1", // Use absolute for consistent spacing
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {step.name}
                  </p>
                </div>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
    </nav>
  );
};


/* -------------------------------------------------------------------------- */
/* PART 2.0: THE "HERO PORTAL" (REDESIGNED)                                   */
/* -------------------------------------------------------------------------- */
const ScanPortal = ({ onScan }) => {
  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const gentleLand = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 180, damping: 25 } } };
  
  return (
    <motion.div
      className="container mx-auto max-w-4xl px-6 flex flex-col items-center justify-center text-center"
      style={{ minHeight: 'calc(100vh - 200px)' }} // 100vh - header - stepper height approx
      variants={staggerContainer} initial="hidden" animate="visible"
    >
      <motion.h1 className="text-5xl md:text-7xl font-bold tracking-tighter" variants={gentleLand}>
        Let's get this sorted.
      </motion.h1>
      <motion.p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl" variants={gentleLand}>
        Scan or upload up to 3 receipts to begin. The AI will do the heavy lifting.
      </motion.p>
      <motion.div variants={gentleLand} className="mt-12" onClick={onScan}>
        <Button size="lg" className="text-base font-semibold h-14 px-10 shadow-lg" whileTap={{ scale: 0.98, transition: { type: 'spring', stiffness: 400, damping: 15 } }}>
          <UploadCloud className="w-6 h-6 mr-3" />
          Scan or Upload Receipts
        </Button>
      </motion.div>
      <motion.div className="flex flex-col sm:flex-row gap-4 mt-8" variants={gentleLand}>
        <Button variant="link" className="text-muted-foreground">
          <Plus className="w-4 h-4 mr-2" /> Add an item manually
        </Button>
        <Button variant="link" className="text-primary"> Try our Demo Bill </Button>
      </motion.div>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/* PART 2.2: THE "NARRATIVE LOADING" SCREEN                                   */
/* -------------------------------------------------------------------------- */
const NarrativeLoadingScreen = ({ onComplete }) => {
  const [scope, animate] = useAnimate();
  useEffect(() => {
    const runAnimation = async () => {
      await animate("li", { opacity: 1, x: 0 }, { duration: 0.4, delay: stagger(0.5) });
      await new Promise(res => setTimeout(res, 500));
      await animate("li", { opacity: 0, x: -20 }, { duration: 0.3 });
      await animate("#done", { opacity: 1, scale: 1 }, { duration: 0.3 });
      await new Promise(res => setTimeout(res, 1200)); onComplete();
    };
    runAnimation();
  }, [animate, onComplete]);
  return (
    <motion.div className="fixed inset-0 z-50 bg-background flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div ref={scope} className="flex flex-col items-center">
        <AnimatePresence>
          <ul className="space-y-6">
            <li className="flex items-center gap-4 text-2xl font-medium opacity-0 translate-x-10"> <Sparkles className="w-8 h-8 text-primary" /> <span>Let's see what we have...</span> </li>
            <li className="flex items-center gap-4 text-2xl font-medium opacity-0 translate-x-10"> <FileText className="w-8 h-8 text-muted-foreground" /> <span>Reading items and prices...</span> </li>
            <li className="flex items-center gap-4 text-2xl font-medium opacity-0 translate-x-10"> <ListChecks className="w-8 h-8 text-muted-foreground" /> <span>Checking for currency...</span> </li>
          </ul>
        </AnimatePresence>
        <motion.div id="done" className="flex flex-col items-center text-primary" initial={{ opacity: 0, scale: 0.8 }}>
          <CheckCircle2 className="w-24 h-24" strokeWidth={1.5} /> <p className="mt-4 text-3xl font-medium">Done!</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/* PART 2.5: THE "BILL HUB" (COCKPIT) - REDESIGNED                            */
/* -------------------------------------------------------------------------- */
const BillHub = ({ items, participants, onAddItem, onAddParticipant, onRemoveParticipant, onGoBack }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const canAssign = items.length > 0 && participants.length > 1;
  const ItemsCardContent = () => (<ItemsCard items={items} onAddItem={onAddItem} calculatedTotal={29.44} billTotal={29.44} />);
  const ParticipantsCardContent = () => (<ParticipantsCard participants={participants} onAddParticipant={onAddParticipant} onRemoveParticipant={onRemoveParticipant} />);

  return (
    <motion.div className="container mx-auto max-w-6xl px-6 py-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 25, delay: 0.2 }}>
      <div className="mb-6"> <Button variant="ghost" size="sm" onClick={onGoBack} className="text-muted-foreground"> <ChevronLeft className="w-4 h-4 mr-1" /> Back to Scan </Button> </div>
      {isMobile ? (
        <Tabs defaultValue="items">
          <TabsList className="grid w-full grid-cols-2 mb-6"> <TabsTrigger value="items">Items ({items.length})</TabsTrigger> <TabsTrigger value="people">People ({participants.length})</TabsTrigger> </TabsList>
          <TabsContent value="items"> <ItemsCardContent /> </TabsContent>
          <TabsContent value="people"> <ParticipantsCardContent /> </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 lg:gap-12">
          <div className="md:col-span-2"> <ItemsCardContent /> </div>
          <div className="md:col-span-1 mt-8 md:mt-0"> <div className="sticky top-28"> <ParticipantsCardContent /> </div> </div>
        </div>
      )}
      <CardFooter className="justify-center mt-12 border-t border-border pt-8">
        <div>
          <Button size="lg" className="text-base font-semibold" disabled={!canAssign}> Assign Items <ChevronRight className="w-5 h-5 ml-2" /> </Button>
          {!canAssign && ( <p className="text-center text-sm text-muted-foreground mt-3"> Add at least 1 item and 2 participants to continue. </p> )}
        </div>
      </CardFooter>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/* PART 2.5: CHILD COMPONENTS (Items & Participants) - REDESIGNED             */
/* -------------------------------------------------------------------------- */
const ItemsCard = ({ items, onAddItem, calculatedTotal, billTotal }) => {
  const difference = calculatedTotal - billTotal; const isVerified = difference === 0;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4"> <CardTitle>Your Bill</CardTitle> <Button variant="ghost" size="sm" onClick={onAddItem} className="text-primary"> <PlusCircle className="w-4 h-4 mr-2" /> Add Item </Button> </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center border border-dashed border-border rounded-md bg-secondary/50"> <List className="w-10 h-10 text-muted-foreground" /> <p className="mt-4 font-medium">No items yet</p> <p className="text-sm text-muted-foreground">Add items manually or go back to scan.</p> </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 border-b border-border last:border-b-0">
                <div className="flex items-center gap-3"> <span className="text-xl p-1 bg-secondary rounded-md">{item.icon}</span> <div> <p className="font-medium text-sm">{item.name}</p> <p className="text-xs text-muted-foreground"> {item.quantity} x {(item.price / item.quantity).toFixed(2)}€ </p> </div> </div>
                <span className="font-mono font-medium text-sm">€{item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start space-y-2 border-t border-border pt-4 mt-6">
        <div className="w-full flex justify-between text-sm"> <span className="text-muted-foreground">Calculated Total:</span> <span className="font-medium font-mono">€{calculatedTotal.toFixed(2)}</span> </div>
        <div className="w-full flex justify-between text-sm"> <span className="text-muted-foreground">Bill Total:</span> <span className="font-medium font-mono">€{billTotal.toFixed(2)}</span> </div>
        <div className={cn("w-full flex justify-between text-sm font-medium", isVerified ? "text-success" : "text-error-light")}> <span>Difference:</span> <span className="font-mono">{difference.toFixed(2)}€</span> </div>
      </CardFooter>
    </Card>
  );
};
const ParticipantsCard = ({ participants, onAddParticipant, onRemoveParticipant }) => {
  const [name, setName] = useState(''); const handleSubmit = (e) => { e.preventDefault(); if (name.trim()) { onAddParticipant(name.trim()); setName(''); } };
  const getAvatar = (name) => { const initials = name.split(' ').map(n => n[0]).join('').toUpperCase(); const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0); const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500']; const color = colors[charCodeSum % colors.length]; return { initials, color }; };
  return (
    <div className="rounded-lg border border-border bg-card text-foreground shadow-sm">
      <CardHeader> <CardTitle>Participants</CardTitle> </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2"> <Input placeholder="e.g., Lukas" value={name} onChange={(e) => setName(e.target.value)} /> <Button type="submit">Add</Button> </form>
        <div className="mt-6 space-y-3">
          {participants.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-center border border-dashed border-border rounded-md bg-secondary/50"> <Users className="w-10 h-10 text-muted-foreground" /> <p className="mt-4 font-medium">No one's here yet</p> <p className="text-sm text-muted-foreground">Add people to the bill.</p> </div>
          ) : (
            participants.map(p => { const { initials, color } = getAvatar(p.name); return (
              <div key={p.id} className="flex items-center justify-between p-3 border-b border-border last:border-b-0">
                <div className="flex items-center gap-3"> <Avatar> <AvatarFallback className={cn(color, "text-white text-xs font-bold")}>{initials}</AvatarFallback> </Avatar> <span className="font-medium text-sm">{p.name}</span> </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive w-8 h-8" onClick={() => onRemoveParticipant(p.id)}> <X className="w-4 h-4" /> </Button>
              </div> );
            })
          )}
        </div>
      </CardContent>
      {participants.length > 0 && ( <CardFooter className="gap-2 border-t border-border pt-6 mt-6"> <Button variant="outline" size="sm" className="w-full">Load Group</Button> <Button variant="outline" size="sm" className="w-full">Save Group</Button> </CardFooter> )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN APP (State Management)                                                */
/* -------------------------------------------------------------------------- */
export default function App() {
  const [pageState, setPageState] = useState('scanPortal'); // 'scanPortal' | 'narrativeLoading' | 'billHub' | 'assignItems' | 'summary'
  const [currentStep, setCurrentStep] = useState(1); // For the stepper
  const [items, setItems] = useState([]);
  const [participants, setParticipants] = useState([]);

  // --- Navigation Logic ---
  const handleScan = () => { setPageState('narrativeLoading'); };
  const handleScanComplete = () => {
    setItems([ /* ... mock items ... */ { id: 1, name: 'Naturjogurt 1kg', quantity: 4, price: 7.16, icon: <Package /> }, { id: 2, name: 'Landmilch 3,8%', quantity: 2, price: 2.70, icon: <GlassWater /> }, { id: 3, name: 'Pfand', quantity: 2, price: 0.50, icon: <GlassWater /> }, { id: 4, name: 'Pringles 155g', quantity: 5, price: 7.45, icon: <Package /> }, { id: 5, name: 'Bananen RFA', quantity: 1, price: 0.78, icon: <Bone /> }, ]);
    setParticipants([ /* ... mock participants ... */ { id: 'a', name: 'Lukas' }, { id: 'b', name: 'Sophie' }, ]);
    setPageState('billHub');
    setCurrentStep(1); // Still on step 1 visually
  };
  const handleGoBackToScan = () => { setPageState('scanPortal'); setCurrentStep(1); };
  
  // NEW: Navigate to Step 2 (Assign Items) - This would trigger loading Part 3 component
  const handleGoToAssignItems = () => {
    if (items.length > 0 && participants.length > 1) {
      setPageState('assignItems'); // Change state to load the next component
      setCurrentStep(2);
    }
  };
  
  // NEW: Allow clicking completed steps (Blueprint Rule)
  const handleStepClick = (stepNumber) => {
    if (stepNumber === 1 && currentStep > 1) { // Only allow going back to step 1 from step 2 or 3
      setPageState('billHub');
      setCurrentStep(1);
    }
    // Add logic for going back to step 2 if needed
  };

  // --- Mock State Actions ---
  const handleAddItem = () => { const name = prompt("Item Name:", "New Item"); const priceStr = prompt("Item Price:", "1.99"); if (name && priceStr) { const price = parseFloat(priceStr); if (!isNaN(price)) { setItems([...items, { id: Date.now(), name, quantity: 1, price, icon: <Carrot /> }]); } else { console.error("Invalid price"); } } };
  const handleAddParticipant = (name) => { setParticipants([...participants, { id: Date.now().toString(), name }]); };
  const handleRemoveParticipant = (id) => { setParticipants(participants.filter(p => p.id !== id)); };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeStyles />
      <AppHeader />
      {/* Pass currentStep and the click handler */}
      <AppStepper currentStep={currentStep} onStepClick={handleStepClick} />
      
      <AnimatePresence mode="wait">
        {pageState === 'scanPortal' && (<ScanPortal key="portal" onScan={handleScan} />)}
        {pageState === 'narrativeLoading' && (<NarrativeLoadingScreen key="loading" onComplete={handleScanComplete} />)}
        {pageState === 'billHub' && (
          <BillHub
            key="hub"
            items={items}
            participants={participants}
            onAddItem={handleAddItem}
            onAddParticipant={handleAddParticipant}
            onRemoveParticipant={handleRemoveParticipant}
            onGoBack={handleGoBackToScan}
            // --- NEW: Pass handler to the CTA ---
            onAssignItems={handleGoToAssignItems} 
          />
        )}
        {/* Placeholder for future pages */}
        {pageState === 'assignItems' && (
          <motion.div key="assign" className="container mx-auto p-6" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
            <h2>Step 2: Assign Items (Placeholder)</h2>
            <Button onClick={() => handleStepClick(1)}>Go Back</Button> 
            {/* Add button to go to step 3 */}
          </motion.div>
        )}
        {pageState === 'summary' && (
           <motion.div key="summary" className="container mx-auto p-6" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
            <h2>Step 3: Summary (Placeholder)</h2>
            <Button onClick={() => handleStepClick(1)}>Go Back to Bill</Button> 
            {/* Add button to go back to step 2 */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

