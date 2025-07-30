// Glass Morphism Design System
export const GlassTheme = {
  colors: {
    // Primary Colors
    primary: {
      900: '#1a0d2e',  // Deep dark purple
      800: '#2d1b3d',  // Rich purple
      700: '#3f2a52',  // Medium purple
      600: '#5b4570',  // Lighter purple
      500: '#7c5fa0',  // Accent purple
    },
    
    // Glass Colors (with opacity)
    glass: {
      dark: 'rgba(26, 13, 46, 0.85)',     // Primary glass overlay
      medium: 'rgba(45, 27, 61, 0.75)',   // Secondary glass
      light: 'rgba(91, 69, 112, 0.25)',   // Subtle glass
    },
    
    // Neutral Colors
    neutral: {
      900: '#0a0a0a',  // True black
      800: '#1a1a1a',  // Dark grey
      700: '#2a2a2a',  // Medium dark grey
      600: '#404040',  // Grey
      500: '#666666',  // Light grey
    },
    
    // Status Colors
    success: '#10b981',  // Green for positive
    warning: '#f59e0b',  // Amber for caution
    error: '#ef4444',    // Red for negative
    info: '#7c5fa0',     // Purple for info
  },
  
  typography: {
    // Web-safe fonts with system fallbacks
    primary: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    // Web-safe fonts for body text
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    // Web-safe monospace for financial numbers
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  
  shadows: {
    glass: {
      // Simplified shadows for better web compatibility
      elevation: 8, // Android only
    },
    subtle: {
      // Simplified shadows for better web compatibility
      elevation: 4, // Android only
    },
  },
};

// Glass card styles for React Native
export const glassStyles = {
  card: {
    backgroundColor: GlassTheme.colors.glass.medium,
    borderRadius: GlassTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: GlassTheme.colors.glass.light,
    // Removed shadow spread to avoid web compatibility issues
  },
  
  cardSubtle: {
    backgroundColor: GlassTheme.colors.glass.light,
    borderRadius: GlassTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(124, 95, 160, 0.15)',
    // Removed shadow spread to avoid web compatibility issues
  },
};