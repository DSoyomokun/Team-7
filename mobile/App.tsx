import React from 'react';
import { AuthProvider } from './src/context/AuthProvider';
import Navigation from './Navigation';

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
