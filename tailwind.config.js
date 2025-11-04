/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	screens: {
  		xs: '414px',
  		sm: '640px',
  		md: '768px',
  		lg: '1024px',
  		xl: '1366px',
  		'2xl': '1920px'
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-inter)',
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		transitionTimingFunction: {
  			premium: 'var(--ease-premium)',
  			smooth: 'var(--ease-smooth)',
  			bounce: 'var(--ease-bounce)'
  		},
  		transitionDuration: {
  			instant: 'var(--duration-instant)',
  			fast: 'var(--duration-fast)',
  			normal: 'var(--duration-normal)',
  			slow: 'var(--duration-slow)',
  			slower: 'var(--duration-slower)'
  		},
  		animationDuration: {
  			instant: 'var(--duration-instant)',
  			fast: 'var(--duration-fast)',
  			normal: 'var(--duration-normal)',
  			slow: 'var(--duration-slow)',
  			slower: 'var(--duration-slower)'
  		},
  		animationTimingFunction: {
  			premium: 'var(--ease-premium)',
  			smooth: 'var(--ease-smooth)',
  			bounce: 'var(--ease-bounce)'
  		},
  		zIndex: {
  			dropdown: 'var(--z-dropdown)',
  			sticky: 'var(--z-sticky)',
  			fixed: 'var(--z-fixed)',
  			'modal-backdrop': 'var(--z-modal-backdrop)',
  			modal: 'var(--z-modal)',
  			popover: 'var(--z-popover)',
  			tooltip: 'var(--z-tooltip)',
  			toast: 'var(--z-toast)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    // Premium responsive variants - orientation + foldables
    plugin(function({ addVariant }) {
      // Orientation variants (Gemini recommendation - built-in CSS feature)
      addVariant('portrait', '@media (orientation: portrait)');
      addVariant('landscape', '@media (orientation: landscape)');
      
      // Foldable device support (CSS spanning API)
      addVariant('fold-v', '@media (spanning: single-fold-vertical)');
      addVariant('fold-h', '@media (spanning: single-fold-horizontal)');
    }),
  ],
}
