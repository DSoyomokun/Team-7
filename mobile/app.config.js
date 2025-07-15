import 'dotenv/config';   // <-- keep this at the very top

export default {
  expo: {
    /* ---------- App identity ---------- */
    name: 'Team7 Budget',
    slug: 'team7budget',
    version: '1.0.0',
    scheme: 'team7budget',

    /* ---------- UI / appearance ---------- */
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    icon: './assets/images/icon.png',
    newArchEnabled: true,

    /* ---------- iOS ---------- */
    ios: { supportsTablet: true },

    /* ---------- Android ---------- */
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
    },

    /* ---------- Web ---------- */
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },

    /* ---------- Plugins ---------- */
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
    ],
    experiments: { typedRoutes: true },

    /* ---------- Env vars exposed to app ---------- */
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};
