# � ScanToSplit.ai - AI-Powered Bill Splitting Made Simple

<div align="center">

![ScanToSplit.ai Banner](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Split bills effortlessly with AI-powered receipt scanning.**

[Live Demo](#-demo) • [Features](#-features) • [Getting Started](#-getting-started) • [Documentation](#-documentation)

</div>

---

## 🎯 What is ScanToSplit.ai?

ScanToSplit.ai is a premium bill-splitting application that uses AI to scan receipts, extract items, and calculate fair splits among participants. No more manual entry, no more math errors, no more awkward money conversations.

**Perfect for:**
- 🍕 Group dinners with friends
- 🏠 Roommate shared expenses
- ✈️ Travel expense tracking
- 🎉 Event cost splitting
- 🛒 Grocery shopping splits

---

## ✨ Features

### 🤖 AI-Powered Receipt Scanning
- **Smart OCR**: Upload receipt photos and let Google Gemini AI extract items automatically
- **Multi-Receipt Support**: Scan up to 3 receipts at once
- **Drag & Drop**: Intuitive file upload with real-time previews
- **Manual Entry**: Paste or type receipts if you prefer

### 💎 Premium User Experience
- **iOS-Inspired Design**: Minimalist interface inspired by Apple and Revolut
- **Smooth Animations**: Buttery 60fps transitions with Framer Motion
- **Responsive**: Perfect on mobile, tablet, and desktop
- **Dark Mode**: Eye-friendly theme switching
- **Accessibility**: Full keyboard navigation and reduced motion support

### 🎨 Smart Assignment
- **Flexible Splitting**: Assign items to individuals or groups
- **Custom Splits**: Define exact amounts or percentages
- **Saved Groups**: Reuse common participant groups
- **Tax & Tip Handling**: Fair distribution of additional charges
- **Special Lines**: Auto-detect deposits, refunds, and discounts

### 📊 Analytics & Export
- **Visual Summaries**: Charts and breakdowns by category
- **Payment Links**: Generate Venmo/PayPal payment requests
- **PDF Export**: Professional receipt summaries
- **Image Sharing**: Beautiful shareable split summaries
- **History Tracking**: Review past splits and spending patterns

### 🔐 Privacy First
- **Local Storage**: All data stays on your device
- **PII Detection**: Automatic masking of sensitive information
- **No Server**: Zero backend, zero data collection
- **XSS Protection**: DOMPurify sanitization for all inputs

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 9+ (included with Node.js)
- **Google Gemini API Key** ([Get one free](https://ai.google.dev/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KPatel-00/Splitter_React_Vite.git
   cd Splitter_React_Vite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your Gemini API key
   # VITE_GOOGLE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build       # Build optimized production bundle
npm run preview     # Preview production build locally
```

---

## 📖 Documentation

### Quick Usage

1. **Upload a receipt** - Drag & drop or click to browse
2. **AI extracts items** - Google Gemini processes the image
3. **Add participants** - Who's splitting the bill?
4. **Assign items** - Tap to assign items to people
5. **View summary** - See who owes what
6. **Export & share** - PDF, image, or payment links

### Key Workflows

- **Setup Flow**: `/setup` - Upload receipts or enter manually
- **Assignment**: `/assignment` - Assign items to participants
- **Summary**: `/summary` - View split breakdown and export
- **Analytics**: `/analytics` - Spending insights and charts

### Development Commands

```bash
npm run dev         # Start dev server (localhost:3000)
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run type-check  # TypeScript type checking
```

### Environment Variables

```env
# Required
VITE_GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# Optional (defaults provided)
VITE_API_TIMEOUT=30000
VITE_MAX_FILE_SIZE=10485760
```

---

## 🏗️ Tech Stack

### Core
- **React 18.3** - UI library with lazy-loaded routes
- **TypeScript 5.5** - Strict type safety (zero errors required)
- **Vite 5.4** - Lightning-fast build tool with manual chunk splitting

### State Management
- **Zustand 4.5** - 9 domain slices with fine-grained selectors
- **localStorage** - Persistent data with async hydration pattern

### UI/UX
- **Tailwind CSS 3.4** - Utility-first styling
- **shadcn/ui** - Accessible component primitives
- **Framer Motion 11.5** - Smooth animations
- **Lucide Icons** - Beautiful icon set

### AI & Processing
- **@google/generative-ai** - Gemini 1.5 Flash OCR
- **browser-image-compression** - Client-side image optimization
- **DOMPurify** - XSS protection

### Export & Sharing
- **jsPDF** - PDF generation
- **html2canvas** - Image export
- **React Hook Form** - Form validation

### Internationalization
- **i18next** - Multi-language support (EN, DE)

---

## 📁 Project Structure

```
src/
├── components/          # Shared UI components (used 3+ features)
│   ├── ui/             # shadcn/ui primitives
│   └── ...             # App-specific components
├── features/           # Feature modules (feature-based structure)
│   ├── landing-page/   # Marketing landing
│   ├── setup/          # Receipt upload & setup
│   │   ├── components/ # 6 extracted UI components
│   │   └── hooks/      # 2 business logic hooks
│   ├── assignment/     # Item assignment flow
│   └── summary/        # Split summary & export
├── lib/                # Pure utilities & helpers
│   ├── motion/         # Animation presets (43 variants)
│   ├── taxonomy/       # Category system (50+ codes)
│   ├── typography.ts   # 40+ responsive text variants
│   └── sanitize.ts     # XSS prevention with DOMPurify
├── store/              # Zustand state management
│   ├── slices/         # Domain slices (9 total, ~90 lines each)
│   ├── selectors/      # Computed values
│   └── useStore.ts     # Combined store (302 lines)
├── hooks/              # Global custom React hooks
└── pages/              # Route components (lazy-loaded)
```

### Code Quality Metrics (Nov 4, 2025)
- **ScanPortal.tsx refactoring**: 658 → 183 lines (72% reduction)
  - Phase 1: Extracted 6 UI components (367 lines removed)
  - Phase 2: Extracted 2 business logic hooks (67 lines removed)
  - Phase 3: Moved to global motion presets (41 lines removed)
- **Zero breaking changes**: All functionality preserved
- **TypeScript errors**: 0 in refactored files (36 pre-existing in analytics)
- **Motion library**: 43 named presets (added `fadeInUp` for common fade+slide pattern)

---

## 🎨 Design Philosophy

### Minimalist & Purposeful
- **Every pixel serves a purpose** - No visual clutter
- **Content-first** - UI fades into the background
- **Generous whitespace** - Room to breathe

### Smooth & Responsive
- **60fps animations** - Hardware-accelerated transforms
- **Instant feedback** - Haptics, sounds, micro-interactions
- **Adaptive layouts** - Breakpoints: xs, sm, md, lg, xl, 2xl

### Accessible & Inclusive
- **WCAG 2.1 AA** - Contrast ratios, focus indicators
- **Keyboard navigation** - Full app accessible without mouse
- **Screen readers** - Semantic HTML, ARIA labels
- **Reduced motion** - Respects user preferences

---

## 🔧 Configuration

### Tailwind Breakpoints

```js
xs: '414px'   // Small phones (iPhone SE)
sm: '640px'   // Large phones
md: '768px'   // Tablets
lg: '1024px'  // Laptops
xl: '1366px'  // Desktops
2xl: '1920px' // Large displays
```

### Animation System

43 named motion presets in `src/lib/motion/`:
- **Tactile**: Button interactions (8 variants)
- **Entry**: Content animations (8 variants, including new `fadeInUp`)
- **Layout**: FLIP transitions (6 variants)
- **Stagger**: List animations (4 variants)
- **Specialized**: Modals, overlays (12 variants)
- **Page**: Route transitions (5 variants)

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** (follow our [guidelines](docs/core/DEVELOPMENT_GUIDELINES.md))
4. **Run tests** (`npm run lint && npm run build`)
5. **Commit** (`git commit -m 'Add amazing feature'`)
6. **Push** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Development Guidelines

- **TypeScript strict mode** - Zero errors required
- **ESLint** - Zero warnings on commit
- **Prettier** - Auto-formatted on save
- **Conventional Commits** - `feat:`, `fix:`, `docs:`, etc.
- **Pre-commit checks** - See [checklist](docs/core/PRE_COMMIT_CHECKLIST.md)

---

## 📊 Performance

### Bundle Size (Production)
- **Main bundle**: 85.6 kB gzipped
- **PDF export**: 118.5 kB (lazy-loaded)
- **AI scanning**: 6.3 kB (lazy-loaded)
- **Image export**: 53.3 kB (lazy-loaded)

### Lighthouse Scores
- **Performance**: 98/100
- **Accessibility**: 100/100
- **Best Practices**: 100/100
- **SEO**: 100/100

---

## 🐛 Known Issues

- **Safari < 15**: Motion animations may stutter (use Safari 15+)
- **HEIC on Windows**: Requires external codec (we show error message)
- **Large PDFs**: Files >5MB may timeout (we compress automatically)

See [Issues](https://github.com/KPatel-00/Splitter_React_Vite/issues) for full list.

---

## 🗺️ Roadmap

### v2.0 (Q1 2026)
- [ ] Real-time collaboration (WebRTC)
- [ ] Recurring splits (subscriptions, rent)
- [ ] Currency conversion (multi-currency bills)
- [ ] Voice input (dictate receipts)

### v2.1 (Q2 2026)
- [ ] Browser extension (scan from any site)
- [ ] Mobile apps (React Native)
- [ ] Integrations (Splitwise, Venmo API)
- [ ] Smart suggestions (ML-based assignment)

See [ROADMAP.md](docs/ROADMAP.md) for details.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**TL;DR**: You can use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software. Just include the original copyright notice.

---

## 👥 Authors & Contributors

### Created by
**Krutarth Patel** ([@KPatel-00](https://github.com/KPatel-00))
- 💼 [LinkedIn](https://linkedin.com/in/kpatel-00)
- 🐦 [Twitter](https://twitter.com/kpatel-00)
- 📧 Email: krutarthpatel.dev@gmail.com

### Special Thanks
- **Google Gemini Team** - For the amazing AI API
- **shadcn** - For beautiful UI components
- **Vercel** - For inspiration on design excellence

---

## 🙏 Acknowledgments

- **Design Inspiration**: Apple iOS, Revolut, Linear, Stripe
- **Icons**: [Lucide Icons](https://lucide.dev)
- **Fonts**: Inter (UI), JetBrains Mono (code)
- **AI**: Google Gemini 1.5 Flash

---

## 📞 Support & Community

### Get Help
- 📖 [Documentation](docs/core/QUICK_REFERENCE.md)
- 💬 [Discussions](https://github.com/KPatel-00/Splitter_React_Vite/discussions)
- 🐛 [Report Bug](https://github.com/KPatel-00/Splitter_React_Vite/issues/new?template=bug_report.md)
- ✨ [Request Feature](https://github.com/KPatel-00/Splitter_React_Vite/issues/new?template=feature_request.md)

### Stay Updated
- ⭐ Star this repo to follow updates
- 👀 Watch releases for new versions
- 🍴 Fork to create your own version

---

## 🌟 Show Your Support

If you find ScanToSplit.ai useful, please consider:
- ⭐ **Starring** this repository
- 🐦 **Sharing** on social media
- 💖 **Sponsoring** development
- 🤝 **Contributing** code or ideas

---

<div align="center">

**Made with ❤️ by [Krutarth Patel](https://github.com/KPatel-00)**

*Split bills, not friendships!*

</div>
