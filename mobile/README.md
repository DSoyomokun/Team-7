# Team-7 Mobile App

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (install globally with `npm install -g expo-cli`)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Install Expo dependencies (if using Expo):**
   ```bash
   npx expo install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the `mobile` directory with your Supabase credentials:
     ```
     EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Start the development server:**
   ```bash
   npm start
   # or
   expo start
   ```

### Notes

- Make sure you do **not** commit your `node_modules/` or `.env` files.
- If you see errors about missing modules (like `react` or `react-native`), run `npm install` again.
